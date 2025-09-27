import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

interface NavigationProps {
  onLoginClick?: () => void;
}

export default function Navigation({ onLoginClick }: NavigationProps) {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Dojo", icon: "⛩️" },
    { path: "/curriculum", label: "Curriculum", icon: "🥋" },
    { path: "/scrolls", label: "Sacred Scrolls", icon: "📜" },
    { path: "/teachings", label: "Teachings", icon: "📚" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      {/* Torii-inspired beam design */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative h-16 flex items-center justify-between">
          {/* Main beam */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20"></div>
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover-elevate p-2 rounded-md">
            <div className="w-8 h-8 text-primary">
              {/* Simplified Torii icon */}
              <svg viewBox="0 0 32 32" className="w-full h-full text-primary fill-current">
                <rect x="4" y="8" width="2" height="20" />
                <rect x="26" y="8" width="2" height="20" />
                <rect x="0" y="6" width="32" height="2" rx="1" />
                <rect x="3" y="12" width="26" height="1.5" rx="0.75" />
                <circle cx="16" cy="4" r="2" className="text-primary fill-current" />
              </svg>
            </div>
            <div className="font-bold text-lg">
              <span className="text-foreground">PEPTIDE</span>
              <span className="text-primary ml-1">DOJO</span>
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
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Login Button */}
          <Button 
            variant="outline"
            onClick={onLoginClick}
            data-testid="button-login"
            className="font-medium"
          >
            Begin Your Training
          </Button>
        </div>
      </div>
    </nav>
  );
}