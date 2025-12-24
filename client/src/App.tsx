import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GlobalCalendarProvider } from "@/components/GlobalCalendarProvider";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import MarketPage from "@/pages/MarketPage";
import BlogsHub from "@/pages/BlogsHub";
import BlogPostPage from "@/pages/BlogPostPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      {/* Route handles :region param (usa, india, japan, crypto) */}
      <Route path="/market/:region/:date?" component={MarketPage} />
      <Route path="/blogs" component={BlogsHub} />
      <Route path="/blogs/:country" component={BlogPostPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GlobalCalendarProvider>
          <Toaster />
          <Router />
        </GlobalCalendarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
