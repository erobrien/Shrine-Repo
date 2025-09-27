import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import shrineLogoPath from "@assets/LogoV_Black_v2_1758948960878.jpg";
import shrineIconPath from "@assets/Icon_Black_1758948905275.jpg";

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
            <img 
              src={shrineIconPath} 
              alt="Peptide Dojo Icon" 
              className="h-8 w-8 object-contain"
              width="32"
              height="32"
              data-testid="logo-shrine-icon"
            />
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