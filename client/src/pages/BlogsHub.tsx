import { Link, useSearch } from "wouter";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Calendar, BookOpen, Globe } from "lucide-react";
import { useState, useMemo } from "react";
import { format, parseISO, isValid } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const countries = [
  { name: "USA", slug: "usa", icon: "🇺🇸" },
  { name: "India", slug: "india", icon: "🇮🇳" },
  { name: "Japan", slug: "japan", icon: "🇯🇵" },
  { name: "Crypto", slug: "crypto", icon: "₿" },
];

export default function BlogsHub() {
  const [selectedCountry, setSelectedCountry] = useState("usa");
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  
  // Read date from URL, use today if not provided
  const selectedDateStr = searchParams.get("date");
  const selectedDate = useMemo(() => {
    if (selectedDateStr && isValid(parseISO(selectedDateStr))) {
      return parseISO(selectedDateStr);
    }
    return new Date(); // Use today by default for BlogsHub
  }, [selectedDateStr]);

  const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navigation />
      
      <main className="container mx-auto px-4 md:px-6 pt-32 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded border border-primary/20">
                <BookOpen className="text-primary w-6 h-6" />
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white uppercase tracking-tight">
                Trading Archives
              </h1>
            </div>
            <p className="text-muted-foreground max-w-lg">
              Explore market insights and trading wisdom across the kingdoms.
            </p>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
            <Calendar className="w-4 h-4 text-primary" />
            <input
              type="date"
              value={dateStr || ""}
              onChange={(e) => {
                if (e.target.value) {
                  const url = new URL(window.location.href);
                  url.searchParams.set("date", e.target.value);
                  window.history.pushState(null, "", url.toString());
                }
              }}
              className="bg-transparent text-white text-sm font-mono focus:outline-none"
            />
          </div>
        </motion.div>

        {/* Country Selector */}
        <div className="mb-16">
          <h2 className="text-lg font-heading font-semibold uppercase tracking-widest text-primary mb-6">
            Select Kingdom
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {countries.map((country) => (
              <Link key={country.slug} href={`/blogs/${country.slug}?date=${dateStr}`}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "p-6 rounded-lg border-2 transition-all duration-300 text-center cursor-pointer",
                    selectedCountry === country.slug
                      ? "bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(255,215,0,0.1)]"
                      : "bg-white/5 border-white/10 text-muted-foreground hover:border-primary/50 hover:text-primary"
                  )}
                >
                  <div className="text-3xl mb-2">{country.icon}</div>
                  <div className="font-heading font-semibold text-sm">{country.name}</div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>

        {/* Blog Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link href={`/blogs/${selectedCountry}?date=${dateStr}`}>
            <div className="p-8 rounded-xl border border-primary/20 bg-black/40 backdrop-blur-sm hover:bg-primary/10 transition-all duration-300 cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-sm font-heading uppercase tracking-wider text-primary mb-2">
                    {countries.find(c => c.slug === selectedCountry)?.name} Market
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-white group-hover:text-primary transition-colors">
                    {format(selectedDate, "MMMM dd, yyyy")}
                  </h3>
                </div>
                <div className="text-primary/50 group-hover:text-primary transition-colors">
                  <Globe className="w-6 h-6" />
                </div>
              </div>
              <p className="text-muted-foreground mb-6">
                View market analysis and trading insights for {countries.find(c => c.slug === selectedCountry)?.name}.
              </p>
              <Button variant="outline" className="group-hover:bg-primary/20 transition-colors">
                Read Article →
              </Button>
            </div>
          </Link>
        </motion.div>

        {/* Archive Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 p-8 rounded-lg border border-primary/10 bg-primary/5 text-center"
        >
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore market analysis for any date and country. Select a kingdom and calendar date above to view detailed trading insights and market intelligence.
          </p>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
