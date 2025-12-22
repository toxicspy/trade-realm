import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MarketIndex, CryptoPrice } from "@shared/schema";

interface MarketIndexCardProps {
  data: MarketIndex;
  index: number;
}

export function MarketIndexCard({ data, index }: MarketIndexCardProps) {
  const isPositive = data.changePercent.startsWith("+");
  const isNegative = data.changePercent.startsWith("-");
  const isNeutral = !isPositive && !isNegative;

  const changeVal = Math.abs(parseFloat(data.changePercent.replace(/[+%]/g, "")));
  const scale = 1 + Math.min(changeVal / 2, 0.4);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative p-6 rounded-xl royal-card overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        {isPositive ? <TrendingUp size={64} className="text-green-500" /> : <TrendingDown size={64} className="text-red-500" />}
      </div>
      
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
          isPositive ? "bg-green-500/10 text-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]" : isNeutral ? "bg-gray-500/10 text-gray-400" : "bg-red-500/10 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]"
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
          <motion.span 
            animate={{ scale: isNeutral ? 1 : scale }}
            className="flex items-center font-bold"
          >
            {data.changePercent}
            {isPositive ? <ArrowUpRight size={16} className="ml-1" /> : isNeutral ? null : <ArrowDownRight size={16} className="ml-1" />}
          </motion.span>
          <span className="text-xs opacity-70">{data.change} pts</span>
        </div>
      </div>
      
      {/* Decorative Glow Line */}
      <div className={cn(
        "absolute bottom-0 left-0 h-[2px] w-full transition-all duration-500 opacity-0 group-hover:opacity-100",
        isPositive ? "bg-gradient-to-r from-green-500/50 via-green-500 to-transparent" : "bg-gradient-to-r from-red-500/50 via-red-500 to-transparent"
      )} />
    </motion.div>
  );
}

interface CryptoCardProps {
  data: CryptoPrice;
  index: number;
}

export function CryptoCard({ data, index }: CryptoCardProps) {
  const isPositive = data.change24h.startsWith("+");
  const isNegative = data.change24h.startsWith("-");
  
  const changeVal = Math.abs(parseFloat(data.change24h.replace(/[+%]/g, "")));
  const scale = 1 + Math.min(changeVal / 5, 0.4);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5, borderColor: isPositive ? "rgba(34, 197, 94, 0.4)" : "rgba(239, 68, 68, 0.4)" }}
      className="royal-card rounded-2xl p-6 relative overflow-hidden border border-white/5 bg-black/40 backdrop-blur-sm group"
    >
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center border border-primary/20">
            <span className="font-bold text-primary text-xs">{data.symbol.substring(0, 1)}</span>
          </div>
          <div>
            <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{data.name}</h4>
            <span className="text-xs text-muted-foreground font-mono">{data.symbol}</span>
          </div>
        </div>
        <motion.div 
          animate={{ scale: isPositive || isNegative ? scale : 1 }}
          className={cn(
            "px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1",
            isPositive 
              ? "bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]" 
              : "bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
          )}
        >
          {isPositive ? <ArrowUpRight size={12} /> : isNegative ? <ArrowDownRight size={12} /> : null}
          {data.change24h}
        </motion.div>
      </div>

      <div className="mt-2 relative z-10">
        <span className="text-2xl font-mono text-white block">{data.price}</span>
      </div>

      {/* Decorative Glow Line */}
      <div className={cn(
        "absolute bottom-0 left-0 h-[2px] w-full transition-all duration-500 opacity-0 group-hover:opacity-100",
        isPositive ? "bg-gradient-to-r from-green-500/50 via-green-500 to-transparent" : "bg-gradient-to-r from-red-500/50 via-red-500 to-transparent"
      )} />
      
      {/* Futuristic Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(to right, ${isPositive ? '#22c55e' : '#ef4444'} 1px, transparent 1px), linear-gradient(to bottom, ${isPositive ? '#22c55e' : '#ef4444'} 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }} 
      />
    </motion.div>
  );
}
