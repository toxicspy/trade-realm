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

async function fetchAlphaVantageData(symbol: string, region: string): Promise<MarketIndex | null> {
  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    if (!apiKey) {
      console.error("Alpha Vantage API key not set");
      return null;
    }

    const response = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`
    );
    
    if (!response.ok) {
      console.error(`Alpha Vantage error for ${symbol}: ${response.status}`);
      return null;
    }

    const data: any = await response.json();
    
    if (!data["Time Series (Daily)"]) {
      console.error(`No time series data for ${symbol}`);
      return null;
    }

    const timeSeries = data["Time Series (Daily)"];
    const dates = Object.keys(timeSeries).sort().reverse();
    
    if (dates.length < 2) {
      console.error(`Not enough data for ${symbol}`);
      return null;
    }

    const today = parseFloat(timeSeries[dates[0]]["4. close"]);
    const yesterday = parseFloat(timeSeries[dates[1]]["4. close"]);
    
    const change = today - yesterday;
    const changePercent = ((change / yesterday) * 100);

    return {
      id: Math.random(),
      region,
      name: COMPANY_NAMES[symbol] || symbol,
      value: today.toFixed(2),
      change: change.toFixed(2),
      changePercent: (changePercent >= 0 ? "+" : "") + changePercent.toFixed(2) + "%",
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error(`Failed to fetch Alpha Vantage data for ${symbol}:`, error);
    return null;
  }
}

export async function fetchUSAIndices(): Promise<MarketIndex[]> {
  const symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "NVDA"];
  const results = await Promise.all(symbols.map(symbol => fetchFinnhubData(symbol)));
  return results.filter((item): item is MarketIndex => item !== null);
}

export async function fetchIndiaIndices(): Promise<MarketIndex[]> {
  const symbols = ["RELIANCE.NSE", "TCS.NSE", "INFY.NSE", "HDFCBANK.NSE"];
  const results = await Promise.all(
    symbols.map(symbol => fetchAlphaVantageData(symbol, "India"))
  );
  return results.filter((item): item is MarketIndex => item !== null);
}

export async function fetchJapanIndices(): Promise<MarketIndex[]> {
  const symbols = ["7203.T", "6758.T", "7974.T", "9984.T"];
  const results = await Promise.all(
    symbols.map(symbol => fetchAlphaVantageData(symbol, "Japan"))
  );
  return results.filter((item): item is MarketIndex => item !== null);
}
