import { motion, AnimatePresence } from "framer-motion";
import { SearchResult, getTypeColor, getTypeLabel } from "@/lib/search";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { Search as SearchIcon } from "lucide-react";

interface SearchModalProps {
  results: SearchResult[];
  isOpen: boolean;
  isLoading: boolean;
  onResultClick: (result: SearchResult) => void;
}

export function SearchModal({
  results,
  isOpen,
  isLoading,
  onResultClick,
}: SearchModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 right-0 mt-2 bg-black/95 border border-primary/20 rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto"
        >
          {isLoading && (
            <div className="p-6 text-center text-muted-foreground">
              <div className="inline-block animate-spin">
                <SearchIcon className="w-5 h-5" />
              </div>
              <p className="mt-2 text-sm">Searching the realm...</p>
            </div>
          )}

          {!isLoading && results.length === 0 && (
            <div className="p-6 text-center">
              <p className="text-muted-foreground text-sm">
                No records found in the Trading Realm.
              </p>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="divide-y divide-white/5">
              {results.map((result) => (
                <Link key={result.id} href={result.link}>
                  <motion.div
                    whileHover={{ backgroundColor: "rgba(255, 215, 0, 0.05)" }}
                    onClick={() => onResultClick(result)}
                    className="p-4 cursor-pointer transition-colors group hover:bg-primary/5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-heading text-white group-hover:text-primary transition-colors truncate">
                          {result.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {result.summary}
                        </p>
                        {result.date && (
                          <p className="text-xs text-primary/60 mt-2">
                            {result.date}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={cn(
                            "text-xs font-mono px-2 py-1 rounded",
                            getTypeColor(result.type)
                          )}
                        >
                          {getTypeLabel(result.type)}
                        </span>
                        {result.region && (
                          <span className="text-xs text-primary/60 whitespace-nowrap">
                            {result.region}
                          </span>
                        )}
                      </div>
                    </div>

                    {result.metadata && (
                      <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                        {result.metadata.value && (
                          <span>Value: {result.metadata.value}</span>
                        )}
                        {result.metadata.change && (
                          <span
                            className={
                              result.metadata.change.startsWith("+")
                                ? "text-green-400"
                                : "text-red-400"
                            }
                          >
                            {result.metadata.change}
                          </span>
                        )}
                        {result.metadata.price && (
                          <span>Price: {result.metadata.price}</span>
                        )}
                        {result.metadata.sentiment && (
                          <span
                            className={cn(
                              result.metadata.sentiment === "bullish"
                                ? "text-green-400"
                                : result.metadata.sentiment === "bearish"
                                  ? "text-red-400"
                                  : "text-yellow-400"
                            )}
                          >
                            {result.metadata.sentiment}
                          </span>
                        )}
                      </div>
                    )}
                  </motion.div>
                </Link>
              ))}
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="sticky bottom-0 p-3 bg-black/50 border-t border-white/5 text-center text-xs text-muted-foreground">
              {results.length} result{results.length !== 1 ? "s" : ""} found
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
