import { Crown } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-black/40 backdrop-blur-md pt-16 pb-8 mt-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-primary" />
              <span className="font-heading font-bold text-lg tracking-widest">THE TRADING REALM</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Providing elite market intelligence for the modern sovereign investor. 
              Data accuracy and speed fit for royalty.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-heading text-primary text-sm uppercase tracking-widest">Markets</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary cursor-pointer transition-colors">United States</li>
              <li className="hover:text-primary cursor-pointer transition-colors">India</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Japan</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Crypto Assets</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-heading text-primary text-sm uppercase tracking-widest">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary cursor-pointer transition-colors">Terms of Service</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Privacy Policy</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Disclaimer</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} The Trading Realm. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer">Twitter</span>
            <span className="hover:text-white cursor-pointer">LinkedIn</span>
            <span className="hover:text-white cursor-pointer">Discord</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
