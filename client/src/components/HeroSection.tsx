import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search } from "lucide-react";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', searchQuery);
  };

  return (
    <section className="relative min-h-[80vh] flex items-center">
      {/* Simple, subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/5" />
      
      {/* Subtle torii accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      {/* Main content with plenty of white space */}
      <div className="relative z-10 w-full px-6 py-20">
        <div className="max-w-5xl mx-auto">
          
          {/* Clean, simple header */}
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-6">
              Peptide Knowledge Hub
            </p>
            
            {/* Main title - clean and prominent */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">
              Peptide Wisdom
            </h1>
            
            <p className="text-xl md:text-2xl font-light text-muted-foreground max-w-3xl mx-auto">
              Expert guidance for optimal health and performance through peptide science
            </p>
          </div>

          {/* Clean search box - prominent and functional */}
          <div className="max-w-2xl mx-auto mb-16">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search peptides, research, or health topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-14 text-base px-12 pr-32 rounded-lg border 
                             bg-background/95 backdrop-blur-sm
                             focus:ring-2 focus:ring-primary/20 focus:border-primary/50
                             placeholder:text-muted-foreground/60 transition-all"
                  data-testid="input-hero-search"
                />
                
                {/* Search icon */}
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                
                {/* Clean search button */}
                <Button 
                  type="submit"
                  className="absolute right-2 top-2 h-10 px-6"
                  data-testid="button-search"
                >
                  Search
                </Button>
              </div>
            </form>
            
            {/* Simple helper text */}
            <p className="text-sm text-muted-foreground/70 mt-3 text-center">
              Explore our comprehensive peptide research and education resources
            </p>
          </div>

          {/* Clean trust indicators */}
          <div className="flex flex-wrap justify-center gap-12 text-sm text-muted-foreground">
            <div className="text-center">
              <div className="font-semibold text-2xl text-foreground mb-1">50+</div>
              <div>Research Partners</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-2xl text-foreground mb-1">10K+</div>
              <div>Active Members</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-2xl text-foreground mb-1">100%</div>
              <div>Science-Based</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-2xl text-foreground mb-1">24/7</div>
              <div>Expert Support</div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}