import { useQuery } from "@tanstack/react-query";
import { getSyncServerUrl } from "@/state/sync-status";
import type { AnalyticsData } from "./types";
import { useMemo } from "react";

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch analytics: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export function useAnalytics(days: number) {
  const syncServerUrl = useMemo(() => getSyncServerUrl(), []);

  return useQuery<AnalyticsData>({
    queryKey: ["analytics", syncServerUrl, days],
    queryFn: () => {
      const url = new URL("/analytics", syncServerUrl);
      url.searchParams.set("days", String(days));
      return fetchJson<AnalyticsData>(url.toString());
    },
  });
}
