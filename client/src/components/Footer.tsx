import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-muted border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Tagline */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
              <div className="w-6 h-6 text-primary">
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
            </div>
            <p className="text-primary font-bold text-sm tracking-wider mb-4">
              PURITY. POWER. PROVEN.
            </p>
            <p className="font-light text-muted-foreground text-sm">
              Evidence-based peptide research and information.
            </p>
          </div>

          {/* Research Categories */}
          <div>
            <h3 className="font-bold mb-4 text-foreground">Research</h3>
            <div className="space-y-2">
              {[
                { href: "/peptides", label: "Peptides" },
                { href: "/conditions", label: "Conditions" },
                { href: "/guides", label: "Guides" },
                { href: "/research", label: "Latest Research" }
              ].map((link) => (
                <Link key={link.href} href={link.href}>
                  <div className="text-muted-foreground hover:text-primary transition-colors cursor-pointer py-1 text-sm">
                    {link.label}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="font-bold mb-4 text-foreground">About</h3>
            <div className="space-y-2">
              {[
                { href: "/methodology", label: "Our Methodology" },
                { href: "/team", label: "Research Team" },
                { href: "/contact", label: "Contact Us" },
                { href: "/disclaimer", label: "Medical Disclaimer" }
              ].map((link) => (
                <Link key={link.href} href={link.href}>
                  <div className="text-muted-foreground hover:text-primary transition-colors cursor-pointer py-1 text-sm">
                    {link.label}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4 text-foreground">Connect</h3>
            <p className="font-light text-muted-foreground mb-4 text-sm">
              Access comprehensive peptide research and evidence-based insights.
            </p>
            <div className="space-y-3">
              <Link href="https://shrine-peptides.com">
                <div 
                  className="text-primary hover:text-primary/80 transition-colors cursor-pointer text-sm font-medium"
                  data-testid="link-shrine-peptides"
                >
                  Visit Shrine Peptides →
                </div>
              </Link>
              <Link href="/contact">
                <div 
                  className="text-muted-foreground hover:text-primary transition-colors cursor-pointer text-sm"
                  data-testid="link-contact"
                >
                  Contact Us
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center">
          <p className="font-light text-muted-foreground text-sm">
            © 2024 Shrine Peptides. All rights reserved. This information is for educational purposes only and is not intended to diagnose, treat, cure, or prevent any disease.
          </p>
        </div>
      </div>
    </footer>
  );
}