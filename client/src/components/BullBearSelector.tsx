import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BullBearSelectorProps {
  mode: "normal" | "bull" | "bear";
  onChange: (mode: "normal" | "bull" | "bear") => void;
}

export function BullBearSelector({ mode, onChange }: BullBearSelectorProps) {
  return (
    <div className="flex items-center gap-8 justify-center mb-12">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onChange(mode === "bull" ? "normal" : "bull")}
        className={cn(
          "relative p-6 rounded-full border transition-all duration-500",
          mode === "bull" 
            ? "bg-green-500/20 border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.4)]" 
            : "bg-black/40 border-white/10 hover:border-green-500/50"
        )}
      >
        <span className="text-4xl md:text-5xl block">🐂</span>
        {mode === "bull" && (
          <motion.div 
            layoutId="glow-bull"
            className="absolute inset-0 rounded-full bg-green-500/10 blur-xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest text-green-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
          Bull Mode
        </span>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onChange(mode === "bear" ? "normal" : "bear")}
        className={cn(
          "relative p-6 rounded-full border transition-all duration-500",
          mode === "bear" 
            ? "bg-red-500/20 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)]" 
            : "bg-black/40 border-white/10 hover:border-red-500/50"
        )}
      >
        <span className="text-4xl md:text-5xl block">🐻</span>
        {mode === "bear" && (
          <motion.div 
            layoutId="glow-bear"
            className="absolute inset-0 rounded-full bg-red-500/10 blur-xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest text-red-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
          Bear Mode
        </span>
      </motion.button>
    </div>
  );
}
