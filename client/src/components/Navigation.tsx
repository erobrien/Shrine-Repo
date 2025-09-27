import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface NavigationProps {
  onLoginClick?: () => void;
}

export default function Navigation({ onLoginClick }: NavigationProps) {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const navItems = [
    { path: "/peptides", label: "Peptides" },
    { path: "/conditions", label: "Conditions" },
    { path: "/guides", label: "Guides" },
    { path: "/research", label: "Research" }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', searchQuery);
  };

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

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <Input
                type="search"
                placeholder="Search peptides, conditions, research..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                data-testid="input-search"
              />
            </form>
          </div>

          {/* Navigation Items */}
          <div className="hidden lg:flex items-center space-x-1">
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

          {/* Pro Access Button */}
          <Button 
            variant="default"
            onClick={onLoginClick}
            data-testid="button-login"
            className="font-medium ml-4"
          >
            Try Pro
          </Button>
        </div>
      </div>
    </nav>
  );
}