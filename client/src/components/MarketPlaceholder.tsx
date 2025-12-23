import { motion } from "framer-motion";
import { Clock, Zap } from "lucide-react";

interface MarketPlaceholderProps {
  region: string;
  message?: string;
}

export function MarketPlaceholder({ region, message }: MarketPlaceholderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-32 text-center"
    >
      <div className="mb-8 p-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 animate-pulse">
        <Clock size={64} className="text-primary" />
      </div>
      
      <h2 className="text-3xl font-heading font-bold text-white mb-4">
        {region} Market Data Coming Soon
      </h2>
      
      <p className="text-muted-foreground max-w-lg mx-auto mb-8 text-lg leading-relaxed">
        {message || `Live ${region} market intelligence is being prepared by the Imperial Archives. Return soon to command the ${region} markets.`}
      </p>

      <div className="flex items-center justify-center gap-3 text-primary/70 text-sm font-heading uppercase tracking-widest">
        <Zap size={16} />
        <span>Launching Soon...</span>
        <Zap size={16} />
      </div>
    </motion.div>
  );
}
