import { useQuery } from "@tanstack/react-query";

export function useBlog(country: string, date: string) {
  return useQuery({
    queryKey: ["/api/blogs", country, date],
    queryFn: async () => {
      const res = await fetch(`/api/blogs/${country}/${date}`, { credentials: "include" });
      if (!res.ok) {
        if (res.status === 404) {
          return null;
        }
        throw new Error("Failed to fetch blog");
      }
      return await res.json();
    },
  });
}
