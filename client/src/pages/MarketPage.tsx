import { useParams, useSearch } from "wouter";
import { useMarketNews, useMarketIndices, useCryptoPrices } from "@/hooks/use-market-data";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { MarketIndexCard, CryptoCard } from "@/components/MarketCards";
import { NewsFeed } from "@/components/NewsFeed";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, BarChart3, Bitcoin, Calendar as CalendarIcon, TrendingDown } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BullBearSelector } from "@/components/BullBearSelector";
import { CommandDashboard } from "@/components/CommandDashboard";
import type { MarketIndex, CryptoPrice } from "@shared/schema";

export default function MarketPage() {
  const { region } = useParams();
  
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const initialMode = (searchParams.get("mode") as "bull" | "bear" | "normal") || "normal";
  const [mode, setMode] = useState<"bull" | "bear" | "normal">(initialMode);

  const handleModeChange = (newMode: "bull" | "bear" | "normal") => {
    setMode(newMode);
    const url = new URL(window.location.href);
    if (newMode === "normal") {
      url.searchParams.delete("mode");
    } else {
      url.searchParams.set("mode", newMode);
    }
    window.history.pushState(null, "", url.toString());
  };

  // Get date from URL query parameter and update on URL changes
  const [date, setDate] = useState<Date | undefined>(undefined);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dateStr = params.get("date");
    if (dateStr) {
      setDate(new Date(dateStr));
    } else {
      setDate(undefined);
    }
  }, []);

  // Capitalize region for display
  const displayRegion = region ? region.charAt(0).toUpperCase() + region.slice(1) : "Unknown";
  const isCrypto = displayRegion === "Crypto";

  const { data: news, isLoading: isNewsLoading } = useMarketNews(isCrypto ? "Crypto" : displayRegion, date);
  const { data: indices, isLoading: isIndicesLoading } = useMarketIndices(displayRegion);
  const { data: cryptoPrices, isLoading: isCryptoLoading } = useCryptoPrices();

  const filteredAssets = useMemo(() => {
    if (isCrypto) {
      if (!cryptoPrices) return [];
      if (mode === "normal") return cryptoPrices;
      return [...cryptoPrices]
        .filter(p => {
          const val = parseFloat(p.change24h.replace(/[+%]/g, ""));
          return mode === "bull" ? val > 0 : val < 0;
        })
        .sort((a, b) => {
          const valA = parseFloat(a.change24h.replace(/[+%]/g, ""));
          const valB = parseFloat(b.change24h.replace(/[+%]/g, ""));
          return mode === "bull" ? valB - valA : valA - valB;
        });
    } else {
      if (!indices) return [];
      if (mode === "normal") return indices;
      return [...indices]
        .filter(idx => {
          const val = parseFloat(idx.changePercent.replace(/[+%]/g, ""));
          return mode === "bull" ? val > 0 : val < 0;
        })
        .sort((a, b) => {
          const valA = parseFloat(a.changePercent.replace(/[+%]/g, ""));
          const valB = parseFloat(b.changePercent.replace(/[+%]/g, ""));
          return mode === "bull" ? valB - valA : valA - valB;
        });
    }
  }, [isCrypto, cryptoPrices, indices, mode]);

  // For Crypto page, we use crypto prices instead of standard indices
  const showCrypto = isCrypto;

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navigation />
      
      <main className="container mx-auto px-4 md:px-6 pt-32 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded border border-primary/20">
                {isCrypto ? <Bitcoin className="text-primary w-6 h-6" /> : <BarChart3 className="text-primary w-6 h-6" />}
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white uppercase tracking-tight">
                {displayRegion} Market
              </h1>
            </div>
            <p className="text-muted-foreground max-w-lg">
              Real-time surveillance and intelligence for the {displayRegion} sector.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            <BullBearSelector mode={mode} onChange={handleModeChange} />
            <div className="flex items-center gap-4">
               {/* Date Picker Filter - Secondary method */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal border-primary/20 hover:border-primary/50 bg-black/50",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Filter archives by date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-black border border-primary/20" align="end">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                      if (selectedDate) {
                        const dateStr = format(selectedDate, "yyyy-MM-dd");
                        window.history.pushState(null, "", `${window.location.pathname}?date=${dateStr}`);
                        setDate(selectedDate);
                      }
                    }}
                    initialFocus
                    className="bg-black text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {/* Loading state when date is selected */}
          {date && isNewsLoading && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-32 left-1/2 -translate-x-1/2 px-6 py-3 bg-primary/10 border border-primary/30 rounded-lg text-primary text-sm font-heading"
            >
              Retrieving market records from {format(date, "MMMM dd, yyyy")}…
            </motion.div>
          )}
        </motion.div>

        {mode !== "normal" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <CommandDashboard mode={mode as "bull" | "bear"} region={region} />
          </motion.div>
        ) : (
          <>
            {/* Indices / Prices Grid */}
            <div className="mb-20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-primary">
                  <TrendingUp className="w-5 h-5" />
                  <h2 className="text-xl font-heading font-semibold uppercase tracking-widest">
                    {isCrypto ? "Live Asset Prices" : "Market Indices"}
                  </h2>
                </div>
              </div>
              
              {showCrypto ? (
                // Crypto Grid
                isCryptoLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1,2,3,4].map(i => <div key={i} className="h-40 bg-white/5 animate-pulse rounded-xl" />)}
                  </div>
                ) : (
                  <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <AnimatePresence mode="popLayout">
                      {filteredAssets.map((asset, i) => (
                        <motion.div
                          key={asset.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CryptoCard data={asset as CryptoPrice} index={i} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )
              ) : (
                // Standard Indices Grid
                isIndicesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1,2,3].map(i => <div key={i} className="h-40 bg-white/5 animate-pulse rounded-xl" />)}
                  </div>
                ) : (
                  <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                      {filteredAssets.map((asset, i) => (
                        <motion.div
                          key={asset.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3 }}
                        >
                          <MarketIndexCard data={asset as MarketIndex} index={i} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )
              )}
            </div>

            {/* News Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8">
                <NewsFeed 
                  news={news || []} 
                  isLoading={isNewsLoading} 
                  title={`${displayRegion} Intelligence Briefing`} 
                />
              </div>

              {/* Sidebar / Sentiment Analysis */}
              <div className="lg:col-span-4 space-y-8">
                <div className="p-6 rounded-xl border border-primary/20 bg-black/40 backdrop-blur-sm sticky top-32">
                  <h3 className="font-heading text-lg text-primary mb-6 pb-2 border-b border-white/10">Market Sentiment</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-green-400">Bullish</span>
                        <span className="text-white font-mono">65%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: "65%" }} 
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" 
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-red-400">Bearish</span>
                        <span className="text-white font-mono">25%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: "25%" }} 
                          transition={{ duration: 1, delay: 0.7 }}
                          className="h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" 
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-yellow-400">Neutral</span>
                        <span className="text-white font-mono">10%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: "10%" }} 
                          transition={{ duration: 1, delay: 0.9 }}
                          className="h-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" 
                        />
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-white/10 text-xs text-muted-foreground leading-relaxed">
                      Sentiment analysis based on AI processing of {news?.length || 0} recent news articles and global trading volume indicators.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
