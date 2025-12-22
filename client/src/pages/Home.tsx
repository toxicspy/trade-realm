import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearch } from "wouter";
import { ArrowRight, Globe, TrendingUp, Zap, TrendingDown } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { NewsFeed } from "@/components/NewsFeed";
import { MarketIndexCard } from "@/components/MarketCards";
import { useMarketNews, useMarketIndices } from "@/hooks/use-market-data";
import { BullBearSelector } from "@/components/BullBearSelector";
import { useState, useMemo } from "react";

export default function Home() {
  const { data: news, isLoading: isNewsLoading } = useMarketNews("Global");
  const { data: indices, isLoading: isIndicesLoading } = useMarketIndices("Global");
  
  const search = useSearch();
  const params = new URLSearchParams(search);
  const initialMode = (params.get("mode") as "bull" | "bear" | "normal") || "normal";
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

  const filteredIndices = useMemo(() => {
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
  }, [indices, mode]);

  // Entrance animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="container relative z-10 px-4 text-center"
        >
          <motion.div variants={itemVariants} className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">System Online</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-9xl font-heading font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-b from-[#FFD700] to-[#B8860B] drop-shadow-lg">
            WELCOME,<br />YOUR MAJESTY
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            The global markets await your command. Real-time intelligence from the USA, India, Japan, and the Cryptosphere.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/market/USA">
              <Button size="lg" variant="royal" className="min-w-[200px] h-14 text-lg group relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Enter The Realm <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0" />
                <span className="absolute inset-0 z-10 flex items-center justify-center gap-2 text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Enter The Realm <ArrowRight className="w-5 h-5" />
                </span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 2, duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-widest">Scroll to Command</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent" />
        </motion.div>
      </section>

      {/* Global Indices Section */}
      <section className="py-24 bg-black/50 relative">
        <div className="container mx-auto px-4 md:px-6">
           <BullBearSelector mode={mode} onChange={handleModeChange} />
           
           <div className="flex items-center justify-between mb-12">
             <div className="flex items-center gap-4">
               <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                 {mode === "bear" ? <TrendingDown className="w-6 h-6 text-red-500" /> : <Globe className="w-6 h-6 text-primary" />}
               </div>
               <div>
                 <h2 className="text-3xl font-heading text-white">
                   {mode === "bull" ? "Bull Market View" : mode === "bear" ? "Bear Market View" : "Global Indices"}
                 </h2>
                 <p className="text-muted-foreground text-sm">
                   {mode === "bull" ? "Markets leading the charge..." : mode === "bear" ? "Markets bleeding the most today..." : "Key performance metrics across realms"}
                 </p>
               </div>
             </div>
           </div>

           {isIndicesLoading ? (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[1,2,3].map(i => <div key={i} className="h-40 bg-white/5 animate-pulse rounded-xl" />)}
             </div>
           ) : (
             <motion.div 
               layout
               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
             >
               <AnimatePresence mode="popLayout">
                 {filteredIndices.map((index, i) => (
                   <motion.div
                     key={index.id}
                     layout
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.9 }}
                     transition={{ duration: 0.3 }}
                   >
                     <MarketIndexCard data={index} index={i} />
                   </motion.div>
                 ))}
               </AnimatePresence>
             </motion.div>
           )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gradient-to-b from-black to-[#0a0a0f]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<TrendingUp className="w-8 h-8 text-primary" />}
              title="Elite Analysis"
              desc="Proprietary algorithms dissecting market movements instantly."
            />
            <FeatureCard 
              icon={<Globe className="w-8 h-8 text-primary" />}
              title="Global Reach"
              desc="Unified data streams from East to West, giving you total oversight."
            />
            <FeatureCard 
              icon={<Zap className="w-8 h-8 text-primary" />}
              title="Instant Execution"
              desc="Latency-free updates ensuring you never miss a golden opportunity."
            />
          </div>
        </div>
      </section>

      {/* Latest Briefing */}
      <section className="py-24 relative overflow-hidden">
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-4xl">
          <NewsFeed news={news || []} isLoading={isNewsLoading} title="Royal Market Briefing" />
          
          <div className="mt-12 text-center">
             <Link href="/market/USA">
               <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                 View Full Archives
               </Button>
             </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-white/10 transition-all duration-300 text-center group"
    >
      <div className="mb-6 inline-flex p-4 rounded-full bg-black border border-primary/20 shadow-[0_0_15px_rgba(255,215,0,0.1)] group-hover:shadow-[0_0_25px_rgba(255,215,0,0.3)] transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-heading text-white mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </motion.div>
  );
}
