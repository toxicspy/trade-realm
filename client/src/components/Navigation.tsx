import { Link, useLocation } from "wouter";
import { Crown, Calendar, Search, Globe, ChevronDown, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Simple Calendar Modal (Mockup for navigation integration)
function CalendarDropdown({ 
  selectedDate, 
  onSelect 
}: { 
  selectedDate: Date | undefined, 
  onSelect: (d: Date | undefined) => void 
}) {
  return (
    <div className="absolute top-full right-0 mt-2 p-4 bg-black/95 border border-primary/20 rounded-lg shadow-2xl z-50 w-64">
       <div className="text-center text-primary mb-2 font-heading">Time Travel</div>
       {/* Simplified for demo - in real app integrate react-day-picker here */}
       <div className="grid grid-cols-7 gap-1 text-xs text-center text-muted-foreground">
         {Array.from({length: 30}).map((_, i) => (
           <button 
             key={i}
             onClick={() => onSelect(new Date(2024, 4, i+1))}
             className="p-2 hover:bg-primary/20 hover:text-primary rounded transition-colors"
           >
             {i+1}
           </button>
         ))}
       </div>
    </div>
  );
}

export function Navigation() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  
  // Detect scroll for navbar background
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "USA", href: "/market/USA" },
    { name: "India", href: "/market/India" },
    { name: "Japan", href: "/market/Japan" },
    { name: "Crypto", href: "/market/Crypto" },
  ];

  const currentDate = new Date();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "circOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
        isScrolled ? "bg-black/80 backdrop-blur-md border-primary/10 py-3" : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full group-hover:bg-primary/40 transition-all duration-500" />
              <Crown className="w-8 h-8 text-primary relative z-10" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-lg tracking-widest text-foreground group-hover:text-primary transition-colors">
                TRADING REALM
              </span>
              <span className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                Est. 2024
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/">
            <div className={cn("nav-link cursor-pointer", location === "/" && "text-primary after:w-full")}>
              Home
            </div>
          </Link>
          
          <div 
            className="relative group"
            onMouseEnter={() => setIsMarketOpen(true)}
            onMouseLeave={() => setIsMarketOpen(false)}
          >
            <button className={cn("nav-link flex items-center gap-1", location.startsWith("/market") && "text-primary")}>
              Markets <ChevronDown className="w-3 h-3" />
            </button>
            
            <AnimatePresence>
              {isMarketOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-48"
                >
                  <div className="bg-[#0f0f13] border border-primary/20 rounded-lg shadow-2xl overflow-hidden p-1">
                    {navLinks.map((link) => (
                      <Link key={link.name} href={link.href}>
                        <div className="block px-4 py-3 text-sm text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors rounded-md cursor-pointer font-medium">
                          {link.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-4 w-[1px] bg-white/10" />

          <div className="flex items-center gap-4 text-primary">
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
              <Calendar className="w-3 h-3 text-primary" />
              <span>{format(currentDate, "MMM dd, yyyy")}</span>
            </div>
            
            <button className="hover:bg-primary/20 p-2 rounded-full transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-foreground p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-xl border-b border-primary/20 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              <Link href="/">
                <div 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-heading text-primary py-2 border-b border-white/5"
                >
                  Home
                </div>
              </Link>
              {navLinks.map(link => (
                <Link key={link.name} href={link.href}>
                  <div 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-muted-foreground hover:text-primary py-2 pl-4 border-l border-white/10 hover:border-primary transition-all"
                  >
                    {link.name} Markets
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
