import { Link, useLocation } from "wouter";
import { Crown, Calendar, Search, Globe, ChevronDown, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SearchModal } from "@/components/SearchModal";
import { searchContent, type SearchResult } from "@/lib/search";

// Full Interactive Calendar Modal
function CalendarModal({ 
  isOpen,
  onClose,
  onSelectDate
}: { 
  isOpen: boolean,
  onClose: () => void,
  onSelectDate: (date: Date) => void
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Pad with days from previous month
  const startingDayOfWeek = monthStart.getDay();
  const previousMonthDays = [];
  const prevMonthEnd = new Date(monthStart);
  prevMonthEnd.setDate(0);
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    previousMonthDays.unshift(new Date(prevMonthEnd.getFullYear(), prevMonthEnd.getMonth(), prevMonthEnd.getDate() - i));
  }

  const allDays = [...previousMonthDays, ...daysInMonth];

  const handleSelectDate = (date: Date) => {
    onSelectDate(date);
    onClose();
  };

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div 
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-96 p-8 bg-black border border-primary/30 rounded-2xl shadow-[0_0_40px_rgba(255,215,0,0.1)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-heading text-primary uppercase tracking-wider">
                Market Time Portal
              </h2>
              <button 
                onClick={onClose}
                className="p-1 hover:bg-primary/10 rounded transition-colors text-muted-foreground hover:text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Month/Year Navigation */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-primary/10">
              <button 
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-2 hover:bg-primary/10 rounded transition-colors text-primary"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <h3 className="text-lg font-heading text-white uppercase tracking-wide">
                {format(currentMonth, "MMMM yyyy")}
              </h3>
              
              <button 
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-2 hover:bg-primary/10 rounded transition-colors text-primary"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Day Labels */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {dayLabels.map(day => (
                <div key={day} className="text-center text-xs font-heading text-primary/70 py-2 uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {allDays.map((day, idx) => {
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isTodayDate = isToday(day);
                const isClickable = isCurrentMonth || true;
                
                return (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: isClickable ? 1.05 : 1 }}
                    onClick={() => handleSelectDate(day)}
                    disabled={!isClickable}
                    className={cn(
                      "aspect-square rounded-lg font-semibold text-sm transition-all duration-200 relative overflow-hidden",
                      isCurrentMonth ? "text-white cursor-pointer" : "text-muted-foreground/50 cursor-default",
                      isTodayDate && isCurrentMonth ? "bg-gradient-to-br from-primary/40 to-primary/20 border border-primary text-primary shadow-[0_0_15px_rgba(255,215,0,0.3)]" : "",
                      isCurrentMonth && !isTodayDate ? "hover:bg-primary/20" : "",
                      !isCurrentMonth ? "opacity-30" : ""
                    )}
                  >
                    {format(day, "d")}
                  </motion.button>
                );
              })}
            </div>

            {/* Footer Info */}
            <div className="mt-8 pt-4 border-t border-primary/10 text-center text-xs text-muted-foreground">
              <p>Press ESC or click outside to close</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function Navigation() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMarketOpen, setIsMarketOpen] = useState(false);
  const [isBlogsOpen, setIsBlogsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchDebounceRef = useRef<NodeJS.Timeout>();
  
  // Detect scroll for navbar background
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Debounced search
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    
    // Clear previous timeout
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    if (value.trim().length === 0) {
      setIsSearchOpen(false);
      setSearchResults([]);
      return;
    }

    setIsSearchLoading(true);
    setIsSearchOpen(true);

    // Debounce search by 300ms
    searchDebounceRef.current = setTimeout(() => {
      const results = searchContent(value);
      setSearchResults(results);
      setIsSearchLoading(false);
    }, 300);
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchInputRef.current && !searchInputRef.current.contains(e.target as Node)) {
        // Check if click is on search results
        const searchContainer = (e.target as Node).parentElement;
        if (!searchContainer?.className.includes("search-results")) {
          setIsSearchOpen(false);
        }
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isSearchOpen]);

  // Handle search result click
  const handleResultClick = (result: SearchResult) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const marketNavLinks = [
    { name: "USA", href: "/market/USA" },
    { name: "India", href: "/market/India" },
    { name: "Japan", href: "/market/Japan" },
    { name: "Crypto", href: "/market/Crypto" },
  ];

  const blogsNavLinks = [
    { name: "USA", href: "/blogs/usa" },
    { name: "India", href: "/blogs/india" },
    { name: "Japan", href: "/blogs/japan" },
    { name: "Crypto", href: "/blogs/crypto" },
  ];

  const mainNavLinks = [
    { name: "Home", href: "/" },
    { name: "Markets", href: "/market/USA", isDropdown: true },
    { name: "Blogs", href: "/blogs", isDropdown: true },
  ];

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
                    {marketNavLinks.map((link) => (
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

          <div 
            className="relative group"
            onMouseEnter={() => setIsBlogsOpen(true)}
            onMouseLeave={() => setIsBlogsOpen(false)}
          >
            <button className={cn("nav-link flex items-center gap-1", location.startsWith("/blogs") && "text-primary")}>
              Blogs <ChevronDown className="w-3 h-3" />
            </button>
            
            <AnimatePresence>
              {isBlogsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-48"
                >
                  <div className="bg-[#0f0f13] border border-primary/20 rounded-lg shadow-2xl overflow-hidden p-1">
                    {blogsNavLinks.map((link) => (
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
            {/* Search Bar */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                <Search className="w-4 h-4" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => searchQuery.length > 0 && setIsSearchOpen(true)}
                placeholder="Search markets, news..."
                className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/30 focus:border-primary/50 text-white placeholder:text-muted-foreground text-sm px-10 py-2 rounded-full w-48 transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
              <div className="search-results relative">
                <SearchModal
                  results={searchResults}
                  isOpen={isSearchOpen}
                  isLoading={isSearchLoading}
                  onResultClick={handleResultClick}
                />
              </div>
            </div>

            <button 
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="flex items-center gap-2 text-xs font-mono text-muted-foreground bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/5 hover:border-primary/30 transition-all duration-300 cursor-pointer group"
            >
              <Calendar className="w-3 h-3 text-primary group-hover:text-primary transition-colors" />
              <span className="group-hover:text-primary transition-colors">Select Date</span>
            </button>
          </div>

          {/* Calendar Modal */}
          <CalendarModal 
            isOpen={isCalendarOpen}
            onClose={() => setIsCalendarOpen(false)}
            onSelectDate={(date) => {
              const dateStr = format(date, "yyyy-MM-dd");
              if (location.startsWith("/blogs")) {
                // On blogs page - navigate to blogs with date param
                const match = location.match(/\/blogs\/([^/?]+)/);
                const country = match ? match[1] : "USA";
                window.history.pushState(null, "", `/blogs/${country}?date=${dateStr}`);
              } else if (location.includes("/market/")) {
                // On market page - navigate to market with date in path
                const match = location.match(/\/market\/([^/?]+)/);
                const region = match ? match[1] : "USA";
                window.history.pushState(null, "", `/market/${region}/${dateStr}`);
              } else {
                // Default to market
                window.history.pushState(null, "", `/market/USA/${dateStr}`);
              }
            }}
          />
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
              <div className="py-2">
                <div className="text-muted-foreground text-xs uppercase tracking-widest mb-2 px-4">Markets</div>
                {marketNavLinks.map(link => (
                  <Link key={link.name} href={link.href}>
                    <div 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-muted-foreground hover:text-primary py-2 pl-4 border-l border-white/10 hover:border-primary transition-all"
                    >
                      {link.name}
                    </div>
                  </Link>
                ))}
              </div>
              <div className="py-2">
                <div className="text-muted-foreground text-xs uppercase tracking-widest mb-2 px-4">Blogs</div>
                {blogsNavLinks.map(link => (
                  <Link key={link.name} href={link.href}>
                    <div 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-muted-foreground hover:text-primary py-2 pl-4 border-l border-white/10 hover:border-primary transition-all"
                    >
                      {link.name}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
