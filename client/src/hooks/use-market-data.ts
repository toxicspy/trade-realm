import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { format } from "date-fns";

// ============================================
// Market News Hooks
// ============================================

export function useMarketNews(region?: string, date?: Date) {
  const dateStr = date ? format(date, 'yyyy-MM-dd') : undefined;
  
  // Construct query parameters manually for the key to ensure uniqueness
  const queryParams = new URLSearchParams();
  if (region) queryParams.append('region', region);
  if (dateStr) queryParams.append('date', dateStr);

  return useQuery({
    queryKey: [api.news.list.path, region, dateStr],
    queryFn: async () => {
      // Use buildUrl properly with query string for GET requests if needed,
      // but standard fetch usually appends query params. 
      // api.news.list.path is '/api/news'
      const url = `${api.news.list.path}?${queryParams.toString()}`;
      
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch market news");
      return api.news.list.responses[200].parse(await res.json());
    },
  });
}

// ============================================
// Market Indices Hooks
// ============================================

export function useMarketIndices(region?: string) {
  const queryParams = new URLSearchParams();
  if (region) queryParams.append('region', region);

  return useQuery({
    queryKey: [api.indices.list.path, region],
    queryFn: async () => {
      const url = `${api.indices.list.path}?${queryParams.toString()}`;
      
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch market indices");
      return api.indices.list.responses[200].parse(await res.json());
    },
  });
}

// ============================================
// Crypto Prices Hooks
// ============================================

export function useCryptoPrices() {
  return useQuery({
    queryKey: [api.crypto.list.path],
    queryFn: async () => {
      const res = await fetch(api.crypto.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch crypto prices");
      return api.crypto.list.responses[200].parse(await res.json());
    },
    // Refresh crypto prices more frequently
    refetchInterval: 30000, 
  });
}
