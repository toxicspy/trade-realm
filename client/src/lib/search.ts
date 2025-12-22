import { type MarketNews, type MarketIndex, type CryptoPrice } from "@shared/schema";

// Mock search data structure
export interface SearchResult {
  id: string;
  title: string;
  summary: string;
  type: "news" | "index" | "crypto" | "region";
  region?: string;
  date?: string;
  link: string;
  metadata?: {
    value?: string;
    change?: string;
    price?: string;
    sentiment?: string;
  };
}

// Mock search data
const mockSearchDatabase: SearchResult[] = [
  // USA Region
  {
    id: "region-usa",
    title: "USA Market",
    summary: "United States market data and news",
    type: "region",
    region: "USA",
    link: "/market/USA",
  },
  // India Region
  {
    id: "region-india",
    title: "India Market",
    summary: "Indian market data and news",
    type: "region",
    region: "India",
    link: "/market/India",
  },
  // Japan Region
  {
    id: "region-japan",
    title: "Japan Market",
    summary: "Japanese market data and news",
    type: "region",
    region: "Japan",
    link: "/market/Japan",
  },
  // Crypto Region
  {
    id: "region-crypto",
    title: "Crypto Market",
    summary: "Cryptocurrency prices and trends",
    type: "region",
    region: "Crypto",
    link: "/market/Crypto",
  },

  // Indices
  {
    id: "index-sp500",
    title: "S&P 500",
    summary: "US stock market index",
    type: "index",
    region: "USA",
    metadata: { value: "4,783.45", change: "+23.12" },
    link: "/market/USA",
  },
  {
    id: "index-nasdaq",
    title: "NASDAQ",
    summary: "Tech-heavy US stock market",
    type: "index",
    region: "USA",
    metadata: { value: "15,678.90", change: "+145.32" },
    link: "/market/USA",
  },
  {
    id: "index-dow",
    title: "DOW JONES",
    summary: "US industrial stocks index",
    type: "index",
    region: "USA",
    metadata: { value: "37,890.12", change: "-45.67" },
    link: "/market/USA",
  },
  {
    id: "index-nifty",
    title: "NIFTY 50",
    summary: "Indian stock market index",
    type: "index",
    region: "India",
    metadata: { value: "21,456.70", change: "+123.45" },
    link: "/market/India",
  },
  {
    id: "index-sensex",
    title: "SENSEX",
    summary: "BSE main stock index",
    type: "index",
    region: "India",
    metadata: { value: "71,234.56", change: "+345.67" },
    link: "/market/India",
  },
  {
    id: "index-nikkei",
    title: "NIKKEI 225",
    summary: "Japanese stock market",
    type: "index",
    region: "Japan",
    metadata: { value: "33,456.78", change: "+567.89" },
    link: "/market/Japan",
  },

  // Cryptocurrencies
  {
    id: "crypto-btc",
    title: "Bitcoin",
    summary: "Leading cryptocurrency",
    type: "crypto",
    region: "Crypto",
    metadata: { price: "$43,567.89", change: "+2.34%" },
    link: "/market/Crypto",
  },
  {
    id: "crypto-eth",
    title: "Ethereum",
    summary: "Smart contract blockchain",
    type: "crypto",
    region: "Crypto",
    metadata: { price: "$2,345.67", change: "+1.56%" },
    link: "/market/Crypto",
  },
  {
    id: "crypto-sol",
    title: "Solana",
    summary: "High-speed blockchain",
    type: "crypto",
    region: "Crypto",
    metadata: { price: "$98.76", change: "+5.67%" },
    link: "/market/Crypto",
  },

  // News Articles (Mock)
  {
    id: "news-1",
    title: "Tech Titans Fortify Their Strongholds",
    summary: "Silicon Valley giants continue their upward march with AI developments",
    type: "news",
    region: "USA",
    date: new Date().toISOString().split("T")[0],
    metadata: { sentiment: "bullish" },
    link: "/market/USA",
  },
  {
    id: "news-2",
    title: "The Eastern Tiger Roars",
    summary: "India\'s infrastructure spending hits new highs",
    type: "news",
    region: "India",
    date: new Date().toISOString().split("T")[0],
    metadata: { sentiment: "bullish" },
    link: "/market/India",
  },
  {
    id: "news-3",
    title: "Sunrise Over Tokyo: Tech Sector Rebounds",
    summary: "Japanese tech stocks awakened with vigor",
    type: "news",
    region: "Japan",
    date: new Date().toISOString().split("T")[0],
    metadata: { sentiment: "neutral" },
    link: "/market/Japan",
  },
  {
    id: "news-4",
    title: "Digital Gold Shines Brighter",
    summary: "Bitcoin reclaims key territories as institutional interest grows",
    type: "news",
    region: "Crypto",
    date: new Date().toISOString().split("T")[0],
    metadata: { sentiment: "bullish" },
    link: "/market/Crypto",
  },
];

export function searchContent(query: string): SearchResult[] {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const lowerQuery = query.toLowerCase();

  return mockSearchDatabase.filter((item) => {
    const titleMatch = item.title.toLowerCase().includes(lowerQuery);
    const summaryMatch = item.summary.toLowerCase().includes(lowerQuery);
    const regionMatch = item.region?.toLowerCase().includes(lowerQuery);

    return titleMatch || summaryMatch || regionMatch;
  });
}

export function getTypeColor(
  type: "news" | "index" | "crypto" | "region"
): string {
  switch (type) {
    case "news":
      return "bg-blue-500/20 text-blue-300";
    case "index":
      return "bg-green-500/20 text-green-300";
    case "crypto":
      return "bg-orange-500/20 text-orange-300";
    case "region":
      return "bg-purple-500/20 text-purple-300";
    default:
      return "bg-primary/20 text-primary";
  }
}

export function getTypeLabel(
  type: "news" | "index" | "crypto" | "region"
): string {
  switch (type) {
    case "news":
      return "News";
    case "index":
      return "Index";
    case "crypto":
      return "Crypto";
    case "region":
      return "Region";
    default:
      return "Item";
  }
}
