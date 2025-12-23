import {
  marketNews,
  marketIndices,
  cryptoPrices,
  type InsertMarketNews,
  type InsertMarketIndex,
  type InsertCryptoPrice,
  type MarketNews,
  type MarketIndex,
  type CryptoPrice,
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import { fetchUSAIndices, fetchIndiaIndices, fetchJapanIndices, fetchIndiaMarketIndices } from "./api-service";

// In-memory cache for API data
const apiCache: Record<string, { data: MarketIndex[]; timestamp: number }> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export interface IStorage {
  getMarketNews(region?: string, date?: string): Promise<MarketNews[]>;
  getMarketIndices(region?: string): Promise<MarketIndex[]>;
  getIndiaMarketIndices(): Promise<MarketIndex[]>;
  getCryptoPrices(): Promise<CryptoPrice[]>;
  seedData(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getMarketNews(region?: string, date?: string): Promise<MarketNews[]> {
    let query = db.select().from(marketNews);
    
    // We can filter in memory or extend the query builder dynamically
    // For simplicity with drizzle query builder:
    const conditions = [];
    if (region) conditions.push(eq(marketNews.region, region));
    if (date) conditions.push(eq(marketNews.date, date));

    if (conditions.length > 0) {
      // @ts-ignore - straightforward stacking of where clauses or 'and'
      return await db.select().from(marketNews).where(and(...conditions));
    }
    
    return await db.select().from(marketNews);
  }

  async getMarketIndices(region?: string): Promise<MarketIndex[]> {
    // Fetch from real APIs for USA, India, and Japan
    if (region && ["USA", "India", "Japan"].includes(region)) {
      const cacheKey = `indices_${region}`;
      const now = Date.now();
      
      // Check cache
      if (apiCache[cacheKey] && now - apiCache[cacheKey].timestamp < CACHE_TTL) {
        return apiCache[cacheKey].data;
      }

      try {
        let data: MarketIndex[] = [];
        if (region === "USA") {
          data = await fetchUSAIndices();
        } else if (region === "India") {
          data = await fetchIndiaIndices();
        } else if (region === "Japan") {
          data = await fetchJapanIndices();
        }
        
        // Cache the results
        apiCache[cacheKey] = { data, timestamp: now };
        return data;
      } catch (error) {
        console.error(`Failed to fetch ${region} indices:`, error);
        // Fall back to empty array instead of DB data
        return [];
      }
    }

    // For Crypto and other regions, use database
    if (region) {
      return await db.select().from(marketIndices).where(eq(marketIndices.region, region));
    }
    return await db.select().from(marketIndices);
  }

  async getIndiaMarketIndices(): Promise<MarketIndex[]> {
    const cacheKey = "india_market_indices";
    const now = Date.now();
    
    // Check cache
    if (apiCache[cacheKey] && now - apiCache[cacheKey].timestamp < CACHE_TTL) {
      return apiCache[cacheKey].data;
    }

    try {
      const data = await fetchIndiaMarketIndices();
      
      // Cache the results
      apiCache[cacheKey] = { data, timestamp: now };
      return data;
    } catch (error) {
      console.error("Failed to fetch India market indices:", error);
      return [];
    }
  }

  async getCryptoPrices(): Promise<CryptoPrice[]> {
    return await db.select().from(cryptoPrices);
  }

  async seedData(): Promise<void> {
    const existingNews = await db.select().from(marketNews).limit(1);
    if (existingNews.length === 0) {
      console.log("Seeding data...");
      const today = new Date().toISOString().split('T')[0];

      // SEED INDICES
      await db.insert(marketIndices).values([
        { region: 'USA', name: 'S&P 500', value: '4,783.45', change: '+23.12', changePercent: '+0.48%' },
        { region: 'USA', name: 'NASDAQ', value: '15,678.90', change: '+145.32', changePercent: '+0.93%' },
        { region: 'USA', name: 'DOW JONES', value: '37,890.12', change: '-45.67', changePercent: '-0.12%' },
        { region: 'India', name: 'NIFTY 50', value: '21,456.70', change: '+123.45', changePercent: '+0.58%' },
        { region: 'India', name: 'SENSEX', value: '71,234.56', change: '+345.67', changePercent: '+0.49%' },
        { region: 'Japan', name: 'NIKKEI 225', value: '33,456.78', change: '+567.89', changePercent: '+1.73%' },
      ]);

      // SEED CRYPTO
      await db.insert(cryptoPrices).values([
        { symbol: 'BTC', name: 'Bitcoin', price: '$43,567.89', change24h: '+2.34%' },
        { symbol: 'ETH', name: 'Ethereum', price: '$2,345.67', change24h: '+1.56%' },
        { symbol: 'SOL', name: 'Solana', price: '$98.76', change24h: '+5.67%' },
      ]);

      // SEED NEWS
      await db.insert(marketNews).values([
        // GLOBAL / USA
        { region: 'Global', date: today, title: 'The Crown Jewel of Markets: Global Liquidity Surges', content: 'In a stunning display of economic resilience, global markets have rallied as central banks signal a potential shift in monetary policy. The Kingdom of Commerce rejoices.', type: 'briefing', sentiment: 'bullish' },
        { region: 'USA', date: today, title: 'Tech Titans Fortify Their Strongholds', content: 'Silicon Valley giants continue their upward march, with AI developments leading the charge. The sector remains the golden goose of the American empire.', type: 'news', sentiment: 'bullish' },
        
        // INDIA
        { region: 'India', date: today, title: 'The Eastern Tiger Roars', content: 'India\'s infrastructure spending hits new highs, promising a golden era of development. Investors flock to the subcontinent seeking royal returns.', type: 'news', sentiment: 'bullish' },
        
        // JAPAN
        { region: 'Japan', date: today, title: 'Sunrise Over Tokyo: Tech Sector Rebounds', content: 'After a brief slumber, Japanese tech stocks have awakened with vigor, driven by export demands and currency fluctuations favorable to the Emperor\'s merchants.', type: 'news', sentiment: 'neutral' },

        // CRYPTO
        { region: 'Crypto', date: today, title: 'Digital Gold Shines Brighter', content: 'Bitcoin reclaims key territories as institutional interest grows. The digital realm is buzzing with activity as new protocols emerge from the shadows.', type: 'news', sentiment: 'bullish' },
      ]);
      console.log("Data seeded.");
    }
  }
}

export const storage = new DatabaseStorage();
