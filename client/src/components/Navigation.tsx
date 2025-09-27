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

  const handleNavClick = (path: string, label: string) => {
    // Only show coming soon for non-peptide routes
    if (path !== "/peptides") {
      console.log(`Navigation to ${label}: Coming soon`);
      toast({
        title: "Coming Soon",
        description: `The ${label} section is currently under development.`,
      });
    }
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
        "sticky top-0 z-[100] transition-all duration-300 ease-sacred bg-background dark:bg-black border-b border-border dark:border-white/10",
        isScrolled 
          ? "shadow-xl shadow-black/30" 
          : "shadow-lg shadow-black/20"
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 md:h-24 lg:h-28 flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center space-x-3 sm:space-x-4 hover-elevate py-2 px-3 rounded-md transition-sacred min-h-[56px] min-w-[56px]"
            aria-label="Peptide Dojo Home"
            data-testid="logo-home-link"
          >
            <img 
              src={shrineIconPath} 
              alt="" 
              className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 object-contain"
              width="64"
              height="64"
              data-testid="logo-shrine-icon"
              aria-hidden="true"
            />
            <div className="font-bold text-xl sm:text-2xl md:text-3xl tracking-tight">
              <span className="text-foreground dark:text-white">PEPTIDE</span>
              <span className="text-primary ml-1">DOJO</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
            {navItems.map((item) => (
              item.path === "/peptides" ? (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant="ghost"
                    className="font-medium text-base lg:text-lg min-h-[48px] px-5 lg:px-6 text-foreground dark:text-white hover:text-foreground dark:hover:text-white hover:bg-accent/10 dark:hover:bg-white/10"
                    data-testid={`nav-link-${item.label.toLowerCase()}`}
                  >
                    {item.label}
                  </Button>
                </Link>
              ) : (
                <Button
                  key={item.path}
                  variant="ghost"
                  className="font-medium text-base lg:text-lg min-h-[48px] px-5 lg:px-6 text-foreground dark:text-white hover:text-foreground dark:hover:text-white hover:bg-accent/10 dark:hover:bg-white/10"
                  data-testid={`nav-link-${item.label.toLowerCase()}`}
                  onClick={() => handleNavClick(item.path, item.label)}
                >
                  {item.label}
                </Button>
              )
            ))}
            {onLoginClick && (
              <Button 
                onClick={onLoginClick}
                className="ml-6 min-h-[52px] px-8 text-base lg:text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
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
                className="min-h-[48px] min-w-[48px] relative text-foreground dark:text-white hover:text-foreground dark:hover:text-white hover:bg-accent/10 dark:hover:bg-white/10"
                aria-label="Open navigation menu"
                data-testid="mobile-menu-button"
              >
                <Menu className={cn(
                  "h-6 w-6 transition-all duration-300 text-foreground dark:text-white",
                  isMobileMenuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                )} />
                <X className={cn(
                  "h-6 w-6 absolute transition-all duration-300 text-foreground dark:text-white",
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
                      className="h-12 w-12 object-contain"
                      width="48"
                      height="48"
                      aria-hidden="true"
                    />
                    <div className="font-bold text-2xl tracking-tight">
                      <span className="text-foreground">PEPTIDE</span>
                      <span className="text-primary ml-1">DOJO</span>
                    </div>
                  </div>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col p-6 pt-4" aria-label="Mobile navigation">
                <div className="flex flex-col space-y-2">
                  {navItems.map((item) => (
                    item.path === "/peptides" ? (
                      <Link key={item.path} href={item.path}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start font-medium text-base min-h-[48px] px-4"
                          onClick={() => setIsMobileMenuOpen(false)}
                          data-testid={`mobile-nav-link-${item.label.toLowerCase()}`}
                        >
                          {item.label}
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        key={item.path}
                        variant="ghost"
                        className="w-full justify-start font-medium text-base min-h-[48px] px-4"
                        onClick={() => {
                          handleNavClick(item.path, item.label);
                          setIsMobileMenuOpen(false);
                        }}
                        data-testid={`mobile-nav-link-${item.label.toLowerCase()}`}
                      >
                        {item.label}
                      </Button>
                    )
                  ))}
                </div>
                {onLoginClick && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <Button 
                      onClick={() => {
                        onLoginClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full min-h-[52px] text-base font-semibold shadow-lg hover:shadow-xl transition-all"
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