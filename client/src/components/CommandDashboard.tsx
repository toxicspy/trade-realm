import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown, BarChart3, Activity, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip,
  BarChart,
  Bar,
  Cell
} from "recharts";

interface CompanyData {
  id: string;
  name: string;
  market: string;
  value: number; // percentage change
}

const MOCK_COMPANIES: CompanyData[] = [
  { id: "1", name: "Tesla", market: "USA", value: 4.8 },
  { id: "2", name: "Apple", market: "USA", value: 2.3 },
  { id: "3", name: "Reliance", market: "India", value: 3.1 },
  { id: "4", name: "Sony", market: "Japan", value: -1.2 },
  { id: "5", name: "Bitcoin", market: "Crypto", value: 8.5 },
  { id: "6", name: "Ethereum", market: "Crypto", value: 5.2 },
  { id: "7", name: "Google", market: "USA", value: -0.8 },
  { id: "8", name: "Microsoft", market: "USA", value: 1.5 },
  { id: "9", name: "Toyota", market: "Japan", value: 2.1 },
  { id: "10", name: "TCS", market: "India", value: -2.5 },
];

const MOCK_CHART_DATA = [
  { time: "09:00", value: 40, vol: 2400 },
  { time: "10:00", value: 45, vol: 3200 },
  { time: "11:00", value: 42, vol: 2800 },
  { time: "12:00", value: 50, vol: 4500 },
  { time: "13:00", value: 55, vol: 5000 },
  { time: "14:00", value: 52, vol: 4200 },
  { time: "15:00", value: 60, vol: 6000 },
];

interface CommandDashboardProps {
  mode: "bull" | "bear";
  region?: string;
}

export function CommandDashboard({ mode, region }: CommandDashboardProps) {
  const isBull = mode === "bull";

  const filteredData = useMemo(() => {
    return MOCK_COMPANIES
      .filter(c => {
        const matchesRegion = !region || region === "Global" || c.market === region;
        const matchesMode = isBull ? c.value > 0 : c.value < 0;
        return matchesRegion && matchesMode;
      })
      .sort((a, b) => isBull ? b.value - a.value : a.value - b.value);
  }, [mode, region]);

  const totalChange = useMemo(() => {
    if (filteredData.length === 0) return 0;
    const sum = filteredData.reduce((acc, curr) => acc + curr.value, 0);
    return sum / filteredData.length;
  }, [filteredData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full max-w-[1600px] mx-auto pb-20">
      {/* LEFT COLUMN - PORTFOLIO SUMMARY */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-3 space-y-8"
      >
        <Card className="p-8 bg-black/40 border-white/10 backdrop-blur-md relative overflow-hidden group h-full flex flex-col items-center justify-center text-center">
          <div className={cn(
            "absolute inset-0 opacity-5 pointer-events-none transition-colors duration-1000",
            isBull ? "bg-green-500" : "bg-red-500"
          )} />
          
          <h2 className="text-sm font-heading font-bold uppercase tracking-[0.3em] text-muted-foreground mb-12">
            {isBull ? "TOTAL MARKET GAIN" : "TOTAL MARKET LOSS"}
          </h2>

          <div className="relative w-48 h-48 mb-8">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="4"
                className="text-white/5"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray="552.92"
                initial={{ strokeDashoffset: 552.92 }}
                animate={{ strokeDashoffset: 552.92 - (552.92 * Math.min(Math.abs(totalChange) / 10, 1)) }}
                transition={{ duration: 2, ease: "easeOut" }}
                className={isBull ? "text-primary shadow-[0_0_20px_rgba(255,215,0,0.5)]" : "text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]"}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={cn(
                  "flex items-center gap-2 text-4xl font-mono font-bold",
                  isBull ? "text-primary" : "text-red-500"
                )}
              >
                {isBull ? <ArrowUp className="w-8 h-8" /> : <ArrowDown className="w-8 h-8" />}
                {Math.abs(totalChange).toFixed(2)}%
              </motion.div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground max-w-[200px] leading-relaxed">
            Aggregated intelligence from across the {region || "Global"} sector. 
            The markets reflect your {isBull ? "ascendancy" : "strategic consolidation"}.
          </p>
        </Card>
      </motion.div>

      {/* CENTER COLUMN - RANKED COMPANIES LIST */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-5 flex flex-col"
      >
        <div className="flex items-center justify-between mb-6 px-4">
          <h2 className="text-xl font-heading font-bold uppercase tracking-widest text-white">
            {isBull ? "PEAK MARKET GAIN" : "PEAK MARKET LOSS"}
          </h2>
          <Zap className={cn("w-5 h-5", isBull ? "text-primary" : "text-red-500")} />
        </div>

        <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence mode="popLayout">
            {filteredData.map((company, i) => {
              const absVal = Math.abs(company.value);
              const glowIntensity = Math.min(absVal / 5, 1);
              const scale = 1 + (absVal / 20);

              return (
                <motion.div
                  key={company.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className={cn(
                    "p-5 rounded-xl border flex items-center justify-between group cursor-pointer transition-all duration-300",
                    isBull 
                      ? "bg-green-500/5 border-green-500/10 hover:border-green-500/40 hover:bg-green-500/10" 
                      : "bg-red-500/5 border-red-500/10 hover:border-red-500/40 hover:bg-red-500/10"
                  )}
                  style={{
                    boxShadow: isBull 
                      ? `0 0 ${glowIntensity * 20}px rgba(34, 197, 94, ${glowIntensity * 0.2})`
                      : `0 0 ${glowIntensity * 20}px rgba(239, 68, 68, ${glowIntensity * 0.2})`
                  }}
                >
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <motion.span 
                        animate={{ scale }}
                        className="text-4xl block filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                      >
                        {isBull ? "🐂" : "🐻"}
                      </motion.span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                        {company.name}
                      </h3>
                      <span className="text-xs text-muted-foreground uppercase tracking-tighter">
                        {company.market} MARKET
                      </span>
                    </div>
                  </div>
                  <div className={cn(
                    "text-2xl font-mono font-bold",
                    isBull ? "text-green-400" : "text-red-400"
                  )}>
                    {isBull ? "+" : ""}{company.value}%
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* RIGHT COLUMN - MARKET PERFORMANCE GRAPHS */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-4 space-y-6"
      >
        {/* Trend Chart */}
        <Card className="p-6 bg-black/40 border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-heading font-bold uppercase tracking-widest text-muted-foreground">
              Market Momentum
            </span>
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_CHART_DATA}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isBull ? "#FFD700" : "#ef4444"} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={isBull ? "#FFD700" : "#ef4444"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,215,0,0.2)' }}
                  itemStyle={{ color: '#FFD700' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={isBull ? "#FFD700" : "#ef4444"} 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Volume Chart */}
        <Card className="p-6 bg-black/40 border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-heading font-bold uppercase tracking-widest text-muted-foreground">
              Command Volume
            </span>
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_CHART_DATA}>
                <Bar dataKey="vol" radius={[4, 4, 0, 0]}>
                  {MOCK_CHART_DATA.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={isBull ? "#FFD700" : "#ef4444"} 
                      opacity={0.4 + (index / MOCK_CHART_DATA.length) * 0.6}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
