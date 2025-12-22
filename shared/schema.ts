import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const marketNews = pgTable("market_news", {
  id: serial("id").primaryKey(),
  region: text("region").notNull(), // 'USA', 'India', 'Japan', 'Crypto', 'Global'
  date: text("date").notNull(), // YYYY-MM-DD
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(), // 'news', 'event', 'briefing'
  sentiment: text("sentiment").notNull(), // 'bullish', 'bearish', 'neutral'
  createdAt: timestamp("created_at").defaultNow(),
});

export const marketIndices = pgTable("market_indices", {
  id: serial("id").primaryKey(),
  region: text("region").notNull(),
  name: text("name").notNull(), // e.g. 'S&P 500'
  value: text("value").notNull(),
  change: text("change").notNull(),
  changePercent: text("change_percent").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cryptoPrices = pgTable("crypto_prices", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  price: text("price").notNull(),
  change24h: text("change_24h").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertMarketNewsSchema = createInsertSchema(marketNews).omit({ id: true, createdAt: true });
export const insertMarketIndicesSchema = createInsertSchema(marketIndices).omit({ id: true, updatedAt: true });
export const insertCryptoPricesSchema = createInsertSchema(cryptoPrices).omit({ id: true, updatedAt: true });

export type MarketNews = typeof marketNews.$inferSelect;
export type InsertMarketNews = z.infer<typeof insertMarketNewsSchema>;
export type MarketIndex = typeof marketIndices.$inferSelect;
export type InsertMarketIndex = z.infer<typeof insertMarketIndicesSchema>;
export type CryptoPrice = typeof cryptoPrices.$inferSelect;
export type InsertCryptoPrice = z.infer<typeof insertCryptoPricesSchema>;
