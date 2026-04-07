import useSWR from "swr";
import type { DashboardStats } from "@/lib/types";
import { getDashboardStats } from "@/lib/api";

const DASHBOARD_KEY = "/dashboard/stats";

export function useDashboard() {
  const { data, error, isLoading, mutate } = useSWR<DashboardStats>(
    DASHBOARD_KEY,
    getDashboardStats,
    {
      revalidateOnFocus: false,
      errorRetryCount: 3,
    }
  );

  return {
    stats: data,
    isLoading,
    isError: !!error,
    error: error as Error | undefined,
    mutate,
  };
}
