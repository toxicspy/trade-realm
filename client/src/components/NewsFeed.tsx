import { motion } from "framer-motion";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import type { MarketNews } from "@shared/schema";
import { Calendar, Globe, AlertCircle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsFeedProps {
  news: MarketNews[];
  isLoading: boolean;
  title?: string;
}

export function NewsFeed({ news, isLoading, title = "Royal Briefing" }: NewsFeedProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-white/5 rounded animate-pulse mb-6" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-white/5 rounded-xl animate-pulse border border-white/5" />
        ))}
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-white/10 rounded-xl">
        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
        <p className="text-muted-foreground">No records found in the archives.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <h2 className="text-2xl font-heading text-primary text-center uppercase tracking-widest px-4 border border-primary/30 py-2 rounded">
          {title}
        </h2>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </div>

      <div className="space-y-6">
        {news.map((item, index) => (
          <NewsCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}

function NewsCard({ item, index }: { item: MarketNews, index: number }) {
  const getSentimentColor = (sentiment: string) => {
    switch(sentiment.toLowerCase()) {
      case 'bullish': return "text-green-400 border-green-400/30 bg-green-400/5";
      case 'bearish': return "text-red-400 border-red-400/30 bg-red-400/5";
      default: return "text-yellow-400 border-yellow-400/30 bg-yellow-400/5";
    }
  };

  const getIcon = (type: string) => {
    switch(type.toLowerCase()) {
      case 'event': return <Calendar className="w-4 h-4" />;
      case 'briefing': return <AlertCircle className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.01, backgroundColor: "rgba(255, 255, 255, 0.03)" }}
      className="group relative p-6 rounded-xl border border-white/5 hover:border-primary/30 bg-black/20 backdrop-blur-sm transition-all duration-300"
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/0 via-primary/50 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 uppercase tracking-wider text-primary/70">
            {getIcon(item.type)} {item.region}
          </span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span className="font-mono opacity-60">{item.date}</span>
        </div>
        
        <Badge variant="outline" className={cn("uppercase text-[10px] tracking-widest w-fit", getSentimentColor(item.sentiment))}>
          {item.sentiment}
        </Badge>
      </div>

      <h3 className="text-xl font-serif font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
        {item.title}
      </h3>
      
      <p className="text-muted-foreground text-sm leading-relaxed border-l-2 border-white/5 pl-4 group-hover:border-primary/20 transition-colors">
        {item.content}
      </p>

      {/* Interactive element */}
      <div className="mt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
        <button className="text-xs text-primary uppercase tracking-widest hover:underline underline-offset-4">
          Read Full Briefing &rarr;
        </button>
      </div>
    </motion.div>
  );
}
