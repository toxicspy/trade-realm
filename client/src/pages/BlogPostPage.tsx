import { useParams, Link, useSearch } from "wouter";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useBlog } from "@/hooks/use-blogs";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogPostPage() {
  const { country } = useParams();
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const date = searchParams.get("date") || "";
  
  const { data: blog, isLoading } = useBlog(country || "", date);

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navigation />
      
      <main className="container mx-auto px-4 md:px-6 pt-32 pb-20">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link href="/blogs">
            <div className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors cursor-pointer w-fit">
              <ArrowLeft className="w-4 h-4" />
              <span className="font-heading text-sm uppercase tracking-wider">Back to Archives</span>
            </div>
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading article...</p>
            </div>
          </div>
        ) : blog ? (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            {/* Header */}
            <div className="mb-12 pb-8 border-b border-white/10">
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-xs font-heading uppercase tracking-wider text-primary">
                  <Globe className="w-3 h-3" />
                  {blog.country}
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
                {blog.title}
              </h1>

              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  {new Date(blog.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  {blog.author}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-invert max-w-none mb-12">
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {blog.excerpt}
              </p>
              
              <div className="bg-white/5 border border-white/10 rounded-lg p-8 mb-8">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {blog.content}
                </p>
              </div>
            </div>

            {/* Action */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex gap-4 pt-8 border-t border-white/10"
            >
              <Link href="/blogs">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Archives
                </Button>
              </Link>
            </motion.div>
          </motion.article>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center py-20"
          >
            <div className="mb-8 p-8 rounded-full bg-primary/10 border border-primary/30 w-fit mx-auto">
              <Calendar className="w-16 h-16 text-primary opacity-50" />
            </div>
            
            <h2 className="text-3xl font-heading font-bold text-white mb-4">
              Content Not Yet Published
            </h2>
            
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              There is no trading analysis available for {country} on {date}. 
              Visit the archives to explore other dates and markets.
            </p>

            <Link href="/blogs">
              <Button className="flex items-center gap-2 mx-auto">
                <ArrowLeft className="w-4 h-4" />
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
