import type { MarketIndex } from "@shared/schema";

interface FinnhubQuote {
  c: number; // current price
  d: number; // change
  dp: number; // percent change
  h: number; // high
  l: number; // low
  o: number; // open
  pc: number; // previous close
  t: number; // timestamp
}

interface AlphaVantageTimeSeries {
  "Time Series (Daily)": Record<string, {
    "1. open": string;
    "2. high": string;
    "3. low": string;
    "4. close": string;
    "5. volume": string;
  }>;
}

const COMPANY_NAMES: Record<string, string> = {
  AAPL: "Apple",
  MSFT: "Microsoft",
  GOOGL: "Google",
  AMZN: "Amazon",
  TSLA: "Tesla",
  NVDA: "NVIDIA",
  "RELIANCE.NSE": "Reliance Industries",
  "TCS.NSE": "Tata Consultancy Services",
  "INFY.NSE": "Infosys",
  "HDFCBANK.NSE": "HDFC Bank",
  "7203.T": "Toyota Motor",
  "6758.T": "Sony Group",
  "7974.T": "Nintendo",
  "9984.T": "SoftBank Group",
};

async function fetchFinnhubData(symbol: string): Promise<MarketIndex | null> {
  try {
    const apiKey = process.env.FINNHUB_API_KEY;
    if (!apiKey) {
      console.error("Finnhub API key not set");
      return null;
    }

    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
    );
    
    if (!response.ok) {
      console.error(`Finnhub error for ${symbol}: ${response.status}`);
      return null;
    }

    const data: FinnhubQuote = await response.json();
    
    if (!data.c) {
      console.error(`No price data for ${symbol}`);
      return null;
    }

    return {
      id: Math.random(),
      region: "USA",
      name: COMPANY_NAMES[symbol] || symbol,
      value: data.c.toFixed(2),
      change: data.d.toFixed(2),
      changePercent: (data.dp >= 0 ? "+" : "") + data.dp.toFixed(2) + "%",
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error(`Failed to fetch Finnhub data for ${symbol}:`, error);
    return null;
  }
}

interface NSEStockData {
  symbol: string;
  company_name: string;
  last_price: number;
  change: number;
  percent_change: number;
}

async function fetchIndiaStockData(): Promise<MarketIndex[]> {
  try {
    const symbols = "RELIANCE.NS,TCS.NS,INFY.NS,HDFCBANK.NS";
    const response = await fetch(
      `https://nse-api-sand.vercel.app/stock/list?symbols=${symbols}&res=num`
    );
    
    if (!response.ok) {
      console.error(`NSE API error: ${response.status}`);
      return [];
    }

    const data = await response.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      console.error("Invalid NSE API response format");
      return [];
    }

    return data.data.map((stock: NSEStockData) => ({
      id: Math.random(),
      region: "India",
      name: stock.company_name || COMPANY_NAMES[stock.symbol] || stock.symbol,
      value: stock.last_price.toFixed(2),
      change: stock.change.toFixed(2),
      changePercent: (stock.percent_change >= 0 ? "+" : "") + stock.percent_change.toFixed(2) + "%",
      updatedAt: new Date(),
    }));
  } catch (error) {
    console.error("Failed to fetch India stock data from NSE API:", error);
    return [];
  }
}

export async function fetchUSAIndices(): Promise<MarketIndex[]> {
  const symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA"];
  const results = await Promise.all(symbols.map(symbol => fetchFinnhubData(symbol)));
  return results.filter((item): item is MarketIndex => item !== null);
}

export async function fetchIndiaIndices(): Promise<MarketIndex[]> {
  return fetchIndiaStockData();
}

export async function fetchJapanIndices(): Promise<MarketIndex[]> {
  // Japan market data placeholder - live data coming soon
  return [];
}
