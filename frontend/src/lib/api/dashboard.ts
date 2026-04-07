import { fetchApi } from "../api";
import type { DashboardMetrics } from "@/types/dashboard";

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  return fetchApi<DashboardMetrics>("/dashboard");
}
