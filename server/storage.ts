import {
  marketNews,
  marketIndices,
  cryptoPrices,
  blogs,
  type InsertMarketNews,
  type InsertMarketIndex,
  type InsertCryptoPrice,
  type InsertBlog,
  type MarketNews,
  type MarketIndex,
  type CryptoPrice,
  type Blog,
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import { fetchUSAIndices, fetchIndiaIndices, fetchJapanIndices, fetchIndiaMarketIndices, fetchCoinGeckoCryptos } from "./api-service";

// In-memory cache for API data
const apiCache: Record<string, { data: any[]; timestamp: number }> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export interface IStorage {
  getMarketNews(region?: string, date?: string): Promise<MarketNews[]>;
  getMarketIndices(region?: string): Promise<MarketIndex[]>;
  getIndiaMarketIndices(): Promise<MarketIndex[]>;
  getCryptoPrices(): Promise<any[]>;
  getBlog(country: string, date: string): Promise<Blog | null>;
  seedData(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getMarketNews(region?: string, date?: string): Promise<MarketNews[]> {
    let query = db.select().from(marketNews);

    if (region) {
      query = query.where(eq(marketNews.region, region)) as any;
    }

    if (date) {
      query = query.where(and(eq(marketNews.region, region || ''), eq(marketNews.date, date))) as any;
    }
    
    return await query;
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

  async getCryptoPrices(): Promise<any[]> {
    const cacheKey = "crypto_prices";
    const now = Date.now();
    
    // Check cache
    if (apiCache[cacheKey] && now - apiCache[cacheKey].timestamp < CACHE_TTL) {
      return apiCache[cacheKey].data;
    }

    try {
      const data = await fetchCoinGeckoCryptos();
      
      // Cache the results
      apiCache[cacheKey] = { data, timestamp: now };
      return data;
    } catch (error) {
      console.error("Failed to fetch crypto prices:", error);
      return [];
    }
  }

  async getBlog(country: string, date: string): Promise<Blog | null> {
    const result = await db.select().from(blogs).where(
      and(eq(blogs.country, country), eq(blogs.date, date))
    ).limit(1);
    
    return result.length > 0 ? result[0] : null;
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

      // SEED BLOGS - Sample blog posts
      await db.insert(blogs).values([
        {
          country: 'USA',
          date: today,
          title: 'Wall Street\'s Golden Hour: Tech Stocks Surge',
          excerpt: 'A comprehensive analysis of today\'s market movements across the technology sector.',
          author: 'Chief Market Analyst',
          content: 'American markets show remarkable resilience as technology stocks continue their upward trajectory. Today\'s session saw significant gains across major indices...'
        },
        {
          country: 'India',
          date: today,
          title: 'The Eastern Tiger Roars: NSE Reaches New Heights',
          excerpt: 'Indian markets break records as economic growth accelerates.',
          author: 'Senior Investment Strategist',
          content: 'India\'s stock markets have reached unprecedented levels today, with both NIFTY and SENSEX showing strong bullish momentum. The market sentiment reflects the nation\'s robust economic growth...'
        },
        {
          country: 'Japan',
          date: today,
          title: 'Tokyo\'s Rising Sun: Nikkei Index Breaks Records',
          excerpt: 'Japanese markets experience a historic rally.',
          author: 'Asia-Pacific Market Specialist',
          content: 'Japan\'s financial markets are experiencing a remarkable turnaround as international investors return to the Tokyo exchange. The Nikkei index has reached new heights...'
        },
        {
          country: 'Crypto',
          date: today,
          title: 'Digital Gold Shines: Bitcoin Reaches New Milestone',
          excerpt: 'Cryptocurrency markets surge as institutional adoption accelerates.',
          author: 'Blockchain Analyst',
          content: 'The cryptocurrency market has entered a new phase of maturity today, with Bitcoin achieving significant price appreciation and showing strong institutional demand...'
        }
      ]);

      console.log("Data seeded.");
    }
  }
}

export const storage = new DatabaseStorage();
