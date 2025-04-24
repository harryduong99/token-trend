import { useQuery } from "@tanstack/react-query";
import { poolService } from "../services/trend-service";
import { CandleData } from "../types";

export const useTokenTrend = (pair: string) => {
  return useQuery<CandleData[]>({
    queryKey: ["token-trend", pair],
    queryFn: () => poolService.getTokenTrend(pair),
    staleTime: 15 * 60 * 1000,  // 15 minutes
    gcTime: 60 * 60 * 1000,     // 1 hour
  });
};
