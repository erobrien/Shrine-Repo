import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/peptides", label: "Peptides" },
    { path: "/conditions", label: "Conditions" },
    { path: "/guides", label: "Guides" },
    { path: "/research", label: "Research" }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover-elevate p-2 rounded-md">
            <div className="w-6 h-6 text-primary">
              {/* Shrine Peptides simple icon */}
              <svg viewBox="0 0 24 24" className="w-full h-full text-primary fill-current">
                <circle cx="12" cy="12" r="10" className="stroke-current fill-none" strokeWidth="2"/>
                <circle cx="12" cy="8" r="3" className="fill-current"/>
                <path d="M8 16h8" className="stroke-current" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="font-bold text-lg">
              <span className="text-foreground">SHRINE</span>
              <span className="text-primary ml-1">PEPTIDES</span>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={location === item.path ? "secondary" : "ghost"}
                  className="font-medium"
                  data-testid={`nav-link-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}