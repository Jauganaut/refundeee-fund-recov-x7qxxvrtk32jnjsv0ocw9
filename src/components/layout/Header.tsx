import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
export function Header() {
  const user = useAuth(s => s.user);
  const logout = useAuth(s => s.logout);
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/#testimonials", label: "Testimonials" },
    { to: "/#process", label: "Our Process" },
    { to: "/#faq", label: "FAQ" },
  ];
  const renderNavLinks = (isMobile = false) => (
    navLinks.map(link => (
      <NavLink
        key={link.to}
        to={link.to}
        className={({ isActive }) =>
          `transition-colors hover:text-primary ${
            isActive && !link.to.includes("#") ? "text-primary font-semibold" : "text-muted-foreground"
          } ${isMobile ? "block py-2 text-lg" : "text-sm font-medium"}`
        }
      >
        {link.label}
      </NavLink>
    ))
  );
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold font-display text-foreground">Refundeee</span>
          </Link>
          <nav className="hidden md:flex md:items-center md:gap-6">
            {renderNavLinks()}
          </nav>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Button asChild variant="ghost">
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button onClick={logout}>Log Out</Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link to="/login">Log In</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Get Started</Link>
                </Button>
              </>
            )}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <nav className="grid gap-6 text-lg font-medium mt-8">
                    {renderNavLinks(true)}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}