import { describe, test, expect, beforeEach, vi } from "vitest";
import type { InternalAxiosRequestConfig } from "axios";

// We need to test the interceptors, so we mock axios.create to capture them
const requestInterceptors: Array<
  (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
> = [];

vi.mock("axios", () => {
  const instance = {
    defaults: { baseURL: "" },
    interceptors: {
      request: {
        use: vi.fn((fn: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig) => {
          requestInterceptors.push(fn);
        }),
      },
      response: {
        use: vi.fn(),
      },
    },
  };

  return {
    default: {
      create: vi.fn((config: { baseURL: string }) => {
        instance.defaults.baseURL = config.baseURL;
        return instance;
      }),
    },
  };
});

describe("Axios client", () => {
  beforeEach(() => {
    localStorage.clear();
    requestInterceptors.length = 0;
    vi.resetModules();
  });

  test("test_axios_client_has_correct_base_url", async () => {
    const axios = (await import("axios")).default;
    await import("../api/client");

    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: expect.stringContaining("localhost:8001"),
      })
    );
  });

  test("test_request_interceptor_adds_auth_header", async () => {
    await import("../api/client");

    localStorage.setItem("token", "my-secret-token");

    const interceptor = requestInterceptors[0];
    expect(interceptor).toBeDefined();

    const config = {
      headers: {},
    } as InternalAxiosRequestConfig;

    const result = interceptor(config);
    expect(result.headers.Authorization).toBe("Bearer my-secret-token");
  });

  test("test_request_interceptor_skips_header_when_no_token", async () => {
    await import("../api/client");

    const interceptor = requestInterceptors[0];
    expect(interceptor).toBeDefined();

    const config = {
      headers: {},
    } as InternalAxiosRequestConfig;

    const result = interceptor(config);
    expect(result.headers.Authorization).toBeUndefined();
  });
});
