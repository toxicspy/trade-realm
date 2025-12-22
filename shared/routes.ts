import { z } from 'zod';
import { marketNews, marketIndices, cryptoPrices } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  news: {
    list: {
      method: 'GET' as const,
      path: '/api/news',
      input: z.object({
        region: z.string().optional(),
        date: z.string().optional(), // YYYY-MM-DD
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof marketNews.$inferSelect>()),
      },
    },
  },
  indices: {
    list: {
      method: 'GET' as const,
      path: '/api/indices',
      input: z.object({
        region: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof marketIndices.$inferSelect>()),
      },
    },
  },
  crypto: {
    list: {
      method: 'GET' as const,
      path: '/api/crypto',
      responses: {
        200: z.array(z.custom<typeof cryptoPrices.$inferSelect>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
