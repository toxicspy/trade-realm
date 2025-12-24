import { useParams, Link, useSearch } from "wouter";
import { useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, parseISO, isValid } from "date-fns";
import { blogDatabase } from "../../../data/blogs";

// Map lowercase country names to display names
const countryMap: { [key: string]: string } = {
  usa: "USA",
  india: "India",
  japan: "Japan",
  crypto: "Crypto",
};

// Helper function to get a random blog from latest entries for a country
function getRandomLatestBlog(country: string, blogs: typeof blogDatabase) {
  // Filter blogs by country
  const countryBlogs = blogs.filter((b) => b.country === country);

  if (countryBlogs.length === 0) return null;

  // Sort by date descending (newest first)
  const sorted = [...countryBlogs].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Pick a random blog from the sorted list
  return sorted[Math.floor(Math.random() * sorted.length)];
}

export default function BlogPostPage() {
  const { country } = useParams();
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const dateStr = searchParams.get("date");
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Aggressive date picker trigger for all devices/browsers
  const triggerDatePicker = (e: React.MouseEvent | React.TouchEvent | any) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!dateInputRef.current) return;
    
    const input = dateInputRef.current;
    
    // Ensure input is not readonly
    if (input.hasAttribute("readonly")) {
      input.removeAttribute("readonly");
    }
    
    // Aggressive focus and show picker sequence
    input.focus();
    input.click();
    
    // Try showPicker for modern browsers
    if ("showPicker" in HTMLInputElement.prototype && typeof (input as any).showPicker === "function") {
      try {
        setTimeout(() => {
          (input as any).showPicker();
        }, 50);
      } catch (err) {
        console.warn("showPicker failed:", err);
      }
    }
  };

  // Get display name for country
  const displayCountry = country
    ? countryMap[country.toLowerCase()] || country
    : "";

  // Determine if we're using fallback mode (no date selected)
  const isUsingFallback = !dateStr;

  // Parse date - use today if not provided
  let displayDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (dateStr && isValid(parseISO(dateStr))) {
    const parsedDate = parseISO(dateStr);
    displayDate = format(parsedDate, "MMMM dd, yyyy");
  }

  // Find matching blog from test data
  let blog: (typeof blogDatabase)[0] | null | undefined = blogDatabase.find(
    (b) => b.country === displayCountry && b.date === dateStr,
  );

  // If no date selected, show random latest blog for the country
  if (isUsingFallback && displayCountry) {
    blog = getRandomLatestBlog(displayCountry, blogDatabase) || undefined;
    // Update displayDate to show the blog's actual date
    if (blog && blog.date && isValid(parseISO(blog.date))) {
      displayDate = format(parseISO(blog.date), "MMMM dd, yyyy");
    }
  }

  // Handle date picker change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value && country) {
      const url = new URL(window.location.href);
      url.searchParams.set("date", e.target.value);
      window.history.pushState(null, "", url.toString());
    }
  };

  const isLoading = false;

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navigation />

      <main className="container mx-auto px-3 sm:px-4 md:px-6 pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 sm:mb-8"
        >
          <Link href="/blogs">
            <div className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors cursor-pointer w-fit">
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-heading text-xs sm:text-sm uppercase tracking-wider">
                Back to Archives
              </span>
            </div>
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16 sm:py-20">
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3 sm:mb-4" />
              <p className="text-sm sm:text-base text-muted-foreground">
                Loading article...
              </p>
            </div>
          </div>
        ) : blog && displayCountry ? (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            {/* Fallback indicator */}
            {isUsingFallback && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-xs sm:text-sm text-muted-foreground italic">
                  Showing latest published market insight
                </p>
              </div>
            )}

            {/* Header */}
            <div className="mb-8 sm:mb-10 md:mb-12 pb-6 sm:pb-8 border-b border-white/10">
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-xs font-heading uppercase tracking-wider text-primary">
                  <Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  {displayCountry}
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-4 sm:mb-6 leading-tight">
                {blog.title}
              </h1>

              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-muted-foreground">
                <div
                  className="flex items-center gap-1.5 sm:gap-2 cursor-pointer hover:text-primary transition-colors text-xs sm:text-sm pointer-events-auto relative"
                  onClick={triggerDatePicker}
                  onTouchStart={(e) => {
                    (e as any).preventDefault?.();
                    triggerDatePicker(e);
                  }}
                >
                  <span className="break-words pointer-events-auto text-primary font-semibold">{displayDate}</span>
                  <input
                    ref={dateInputRef}
                    id="date-picker-input"
                    type="date"
                    onChange={handleDateChange}
                    onClick={triggerDatePicker}
                    onTouchStart={(e) => {
                      (e as any).preventDefault?.();
                      triggerDatePicker(e);
                    }}
                    className="absolute inset-0 w-full h-full cursor-pointer opacity-0 pointer-events-auto"
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                    aria-label="Select date"
                  />
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                  <span className="break-words">{blog.author}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-invert max-w-none mb-8 sm:mb-10 md:mb-12">
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 sm:mb-8">
                {blog.excerpt}
              </p>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
                <div
                  className="text-sm sm:text-base text-foreground leading-relaxed space-y-4 sm:space-y-6 break-words"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </div>
            </div>

            {/* Action */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-white/10"
            >
              <Link href="/blogs" className="w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto text-xs sm:text-sm"
                >
                  <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                  Back to Archives
                </Button>
              </Link>
            </motion.div>
          </motion.article>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center py-12 sm:py-16 md:py-20"
          >
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 md:p-8 rounded-full bg-primary/10 border border-primary/30 w-fit mx-auto">
              <Calendar className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-primary" />
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-white mb-3 sm:mb-4 px-2">
              Content Not Yet Published
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-xl mx-auto mb-6 sm:mb-8 px-3">
              There is no trading analysis available for {displayCountry} on{" "}
              {displayDate}. Visit the archives to explore other dates and
              markets.
            </p>

            <Link href="/blogs">
              <Button className="flex items-center justify-center gap-2 mx-auto text-xs sm:text-sm">
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                Return to Archives
              </Button>
            </Link>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
