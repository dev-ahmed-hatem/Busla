"use client";

import { useQuery } from "@tanstack/react-query";

import { api } from "./client";

/** Phase-0 health probe — proves the DRF → OpenAPI → generated TS client → web loop. */
export function useHealth() {
  return useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const { data, error } = await api.GET("/api/v1/health/");
      if (error) throw new Error("health check failed");
      return data;
    },
  });
}
