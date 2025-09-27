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
    <section className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] flex items-center overflow-hidden bg-white">
      {/* Clean white background */}
      <div className="absolute inset-0 bg-white" />

      {/* Main content with responsive white space */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          
          {/* Clean, simple header - mobile optimized */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 sm:mb-6">
              Welcome to Peptide Dojo
            </p>
            
            {/* Main title - responsive scaling */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 text-foreground leading-tight">
              Master Peptide Science
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light text-muted-foreground max-w-3xl mx-auto px-4 sm:px-0">
              Train your knowledge, elevate your understanding, achieve optimal health
            </p>
          </div>

          {/* Traditional search box */}
          <div className="max-w-2xl mx-auto mb-12 sm:mb-16 px-2 sm:px-0">
            <form onSubmit={handleSearch}>
              {/* Traditional inline search layout */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    type="search"
                    placeholder="Search peptides, research, conditions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 sm:h-14 text-base pl-10 sm:pl-12 pr-4 rounded-lg border
                               bg-background/95 backdrop-blur-sm
                               focus:ring-2 focus:ring-primary/20 focus:border-primary/50
                               placeholder:text-muted-foreground/60 transition-all"
                    data-testid="input-hero-search"
                  />
                  
                  {/* Search icon */}
                  <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-muted-foreground/50" />
                </div>
                
                {/* Traditional separate search button */}
                <Button 
                  type="submit"
                  className="h-12 sm:h-14 px-6 sm:px-8"
                  data-testid="button-search"
                >
                  Search
                </Button>
              </div>
            </form>
            
            {/* Simple helper text */}
            <p className="text-xs sm:text-sm text-muted-foreground/70 mt-3 text-center px-4 sm:px-0">
              Explore our comprehensive peptide research and education resources
            </p>
          </div>

          {/* Clean trust indicators - responsive grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 md:gap-12 text-center px-4 sm:px-0">
            <div className="space-y-1">
              <div className="font-semibold text-xl sm:text-2xl text-foreground">50+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Research Partners</div>
            </div>
            <div className="space-y-1">
              <div className="font-semibold text-xl sm:text-2xl text-foreground">10K+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Active Members</div>
            </div>
            <div className="space-y-1">
              <div className="font-semibold text-xl sm:text-2xl text-foreground">100%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Science-Based</div>
            </div>
            <div className="space-y-1">
              <div className="font-semibold text-xl sm:text-2xl text-foreground">24/7</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Expert Support</div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}