import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
export function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold font-display text-foreground">Refundeee</span>
            </Link>
            <p className="text-sm text-muted-foreground">Your Trusted Partner in Fund Recovery.</p>
            <p className="text-xs text-muted-foreground/80">Built with ❤�� at Cloudflare</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Services</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-base text-muted-foreground hover:text-primary">Crypto Scams</a></li>
              <li><a href="#" className="text-base text-muted-foreground hover:text-primary">Investment Scams</a></li>
              <li><a href="#" className="text-base text-muted-foreground hover:text-primary">Bank Transfer Fraud</a></li>
              <li><a href="#" className="text-base text-muted-foreground hover:text-primary">Purchase Scams</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Company</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-base text-muted-foreground hover:text-primary">About Us</a></li>
              <li><a href="#" className="text-base text-muted-foreground hover:text-primary">Contact</a></li>
              <li><a href="#" className="text-base text-muted-foreground hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="text-base text-muted-foreground hover:text-primary">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-base text-muted-foreground hover:text-primary">Refund Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8">
          <p className="text-xs text-muted-foreground text-center">
            Disclaimer: Refundeee operates as an independent recovery facilitator. We are not affiliated with banks, brokers, or government agencies. Results may vary per case.
          </p>
          <p className="text-xs text-muted-foreground text-center mt-2">
            © {new Date().getFullYear()} Refundeee. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}