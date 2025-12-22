import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MarketIndex, CryptoPrice } from "@shared/schema";

interface MarketIndexCardProps {
  data: MarketIndex;
  index: number;
}

export function MarketIndexCard({ data, index }: MarketIndexCardProps) {
  const isPositive = data.change.startsWith("+");
  const isNeutral = data.change === "0.00";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="group relative p-6 rounded-xl royal-card overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4 transition-all group-hover:bg-primary/10" />
      
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h3 className="text-xl font-heading font-bold text-foreground group-hover:text-primary transition-colors">
            {data.name}
          </h3>
          <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
            {data.region} Index
          </p>
        </div>
        <div className={cn(
          "p-2 rounded-full",
          isPositive ? "bg-green-500/10 text-green-500" : isNeutral ? "bg-gray-500/10 text-gray-400" : "bg-red-500/10 text-red-500"
        )}>
          {isPositive ? <TrendingUp size={20} /> : isNeutral ? <Minus size={20} /> : <TrendingDown size={20} />}
        </div>
      </div>

      <div className="flex items-end justify-between relative z-10">
        <span className="text-3xl font-mono font-medium text-white tracking-tight">
          {data.value}
        </span>
        <div className={cn(
          "flex flex-col items-end text-sm font-medium",
          isPositive ? "text-green-500" : isNeutral ? "text-gray-400" : "text-red-500"
        )}>
          <span className="flex items-center">
            {data.changePercent}
            {isPositive ? <ArrowUpRight size={14} className="ml-1" /> : isNeutral ? null : <ArrowDownRight size={14} className="ml-1" />}
          </span>
          <span className="text-xs opacity-70">{data.change} pts</span>
        </div>
      </div>
      
      {/* Decorative Glow */}
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-500" />
    </motion.div>
  );
}

interface CryptoCardProps {
  data: CryptoPrice;
  index: number;
}

export function CryptoCard({ data, index }: CryptoCardProps) {
  const isPositive = parseFloat(data.change24h) >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, borderColor: "rgba(255, 215, 0, 0.4)" }}
      className="royal-card rounded-2xl p-6 relative overflow-hidden border border-white/5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center border border-primary/20">
            <span className="font-bold text-primary text-xs">{data.symbol.substring(0, 1)}</span>
          </div>
          <div>
            <h4 className="font-bold text-lg">{data.name}</h4>
            <span className="text-xs text-muted-foreground font-mono">{data.symbol}</span>
          </div>
        </div>
        <div className={cn(
          "px-3 py-1 rounded-full text-xs font-bold border",
          isPositive 
            ? "bg-green-500/10 text-green-400 border-green-500/20" 
            : "bg-red-500/10 text-red-400 border-red-500/20"
        )}>
          {isPositive ? "+" : ""}{data.change24h}%
        </div>
      </div>

      <div className="mt-2">
        <span className="text-2xl font-mono text-white block">{data.price}</span>
      </div>

      {/* Futuristic Grid Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(to right, #FFD700 1px, transparent 1px), linear-gradient(to bottom, #FFD700 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }} 
      />
    </motion.div>
  );
}
