import { Link } from "wouter";
import shrineIconPath from "@assets/Icon_White_1758953368901.png";

export default function Footer() {
  return (
    <footer className="bg-muted border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Logo and Tagline */}
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-3 mb-3 sm:mb-4">
              <img 
                src={shrineIconPath} 
                alt="Peptide Dojo logo" 
                className="h-8 w-8 object-contain"
                width="32"
                height="32"
              />
              <div className="font-bold text-lg">
                <span className="text-foreground">PEPTIDE</span>
                <span className="text-primary ml-1">DOJO</span>
              </div>
            </div>
            <p className="text-primary font-bold text-sm tracking-wider mb-4" data-testid="text-tagline">
              MASTER. LEARN. EXCEL.
            </p>
            <p className="font-light text-muted-foreground text-sm" data-testid="text-footer-description">
              Master the art and science of peptide research.
            </p>
          </div>

          {/* Research Categories */}
          <div>
            <h3 className="font-bold mb-3 sm:mb-4 text-foreground text-base">Research</h3>
            <div className="space-y-2">
              {[
                { href: "/peptides", label: "Peptides" },
                { href: "/research", label: "Research Guides" }
              ].map((link) => (
                <Link key={link.href} href={link.href}>
                  <div className="text-muted-foreground hover:text-primary transition-colors cursor-pointer py-3 sm:py-1 text-sm min-h-[44px] sm:min-h-0 flex items-center justify-center sm:justify-start" data-testid={`link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}>
                    {link.label}
                  </div>
                </Link>
              ))}
            </div>
          </div>


          {/* Connect */}
          <div>
            <h3 className="font-bold mb-3 sm:mb-4 text-foreground text-base">Connect</h3>
            <p className="font-light text-muted-foreground mb-4 text-sm">
              Access comprehensive peptide research and evidence-based insights.
            </p>
            <div className="space-y-3">
              <Link href="https://shrine-peptides.com">
                <div 
                  className="text-primary hover:text-primary/80 transition-colors cursor-pointer text-sm font-medium py-3 sm:py-0 min-h-[44px] sm:min-h-0 flex items-center justify-center sm:justify-start"
                  data-testid="link-shrine-peptides"
                >
                  Visit Shrine Peptides →
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 text-center">
          <p className="font-light text-muted-foreground text-xs sm:text-sm px-2 sm:px-0" data-testid="text-footer-copyright">
            © 2024 Peptide Dojo. All rights reserved. This information is for educational purposes only and is not intended to diagnose, treat, cure, or prevent any disease.
          </p>
        </div>
      </div>
    </footer>
  );
}