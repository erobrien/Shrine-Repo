import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, X } from "lucide-react";
import shrineLogoPath from "@assets/LogoV_Black_v2_1758948960878.jpg";
import shrineIconPath from "@assets/Icon_White_1758953368901.png";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Navigation({ onLoginClick }: { onLoginClick?: () => void }) {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const navItems = [
    { path: "/peptides", label: "Peptides" },
    { path: "/conditions", label: "Conditions" },
    { path: "/guides", label: "Guides" },
    { path: "/research", label: "Research" }
  ];

  const handleNavClick = (label: string) => {
    console.log(`Navigation to ${label}: Coming soon`);
    toast({
      title: "Coming Soon",
      description: `The ${label} section is currently under development.`,
    });
  };

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial scroll position

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <nav 
      className={cn(
        "sticky top-0 z-[100] transition-all duration-300 ease-sacred bg-black",
        isScrolled 
          ? "shadow-lg" 
          : ""
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 md:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 sm:space-x-3 hover-elevate p-2 rounded-md transition-sacred min-h-[44px] min-w-[44px]"
            aria-label="Peptide Dojo Home"
            data-testid="logo-home-link"
          >
            <img 
              src={shrineIconPath} 
              alt="" 
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
              width="48"
              height="48"
              data-testid="logo-shrine-icon"
              aria-hidden="true"
            />
            <div className="font-bold text-sm sm:text-lg">
              <span className="text-white">PEPTIDE</span>
              <span className="text-primary ml-0.5 sm:ml-1">DOJO</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className="font-medium min-h-[44px] px-4 text-white hover:text-white hover:bg-white/10"
                data-testid={`nav-link-${item.label.toLowerCase()}`}
                onClick={() => handleNavClick(item.label)}
              >
                {item.label}
              </Button>
            ))}
            {onLoginClick && (
              <Button 
                onClick={onLoginClick}
                className="ml-4 min-h-[44px] px-6"
                variant="default"
                data-testid="nav-login-button"
              >
                Begin Your Training
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="min-h-[44px] min-w-[44px] relative text-white hover:text-white hover:bg-white/10"
                aria-label="Open navigation menu"
                data-testid="mobile-menu-button"
              >
                <Menu className={cn(
                  "h-6 w-6 transition-all duration-300 text-white",
                  isMobileMenuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                )} />
                <X className={cn(
                  "h-6 w-6 absolute transition-all duration-300 text-white",
                  isMobileMenuOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
                )} />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-[300px] sm:w-[400px] p-0"
              aria-label="Navigation menu"
            >
              <SheetHeader className="p-6 pb-0">
                <SheetTitle className="text-left">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={shrineIconPath} 
                      alt="" 
                      className="h-10 w-10 object-contain"
                      width="40"
                      height="40"
                      aria-hidden="true"
                    />
                    <div className="font-bold text-lg">
                      <span className="text-foreground">PEPTIDE</span>
                      <span className="text-primary ml-1">DOJO</span>
                    </div>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col p-6 pt-4" aria-label="Mobile navigation">
                <div className="flex flex-col space-y-2">
                  {navItems.map((item) => (
                    <Button
                      key={item.path}
                      variant="ghost"
                      className="w-full justify-start font-medium text-base min-h-[48px] px-4"
                      onClick={() => {
                        handleNavClick(item.label);
                        setIsMobileMenuOpen(false);
                      }}
                      data-testid={`mobile-nav-link-${item.label.toLowerCase()}`}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
                {onLoginClick && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <Button 
                      onClick={() => {
                        onLoginClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full min-h-[48px]"
                      variant="default"
                      data-testid="mobile-login-button"
                    >
                      Begin Your Training
                    </Button>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}