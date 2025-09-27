import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search } from "lucide-react";
import { useLocation } from "wouter";
import patternBg from "@assets/LRG_Pattern_On White_Ghost_1758953070309.jpg";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, navigate] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/peptides?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/peptides');
    }
  };

  return (
    <section className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] flex items-center overflow-hidden">
      {/* Pattern background */}
      <div 
        className="absolute inset-0 bg-repeat" 
        style={{ 
          backgroundImage: `url(${patternBg})`,
          backgroundSize: '400px 400px',
          opacity: 1
        }}
      />

      {/* Dark gradient overlay - ensures text readability in both themes */}
      <div 
        className="absolute inset-0" 
        style={{ 
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.6))'
        }}
      />

      {/* Main content with responsive white space */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          
          {/* Clean, simple header - mobile optimized */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            {/* Main title - responsive scaling */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 text-white leading-tight">
              Master Peptide Science
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light text-white/80 max-w-3xl mx-auto px-4 sm:px-0">
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
                    className="w-full h-12 sm:h-14 text-base pl-10 sm:pl-12 pr-4 rounded-lg border border-white/20
                               bg-white/90 backdrop-blur-sm text-black
                               focus:ring-2 focus:ring-white/30 focus:border-white/40
                               placeholder:text-gray-600 transition-all"
                    data-testid="input-hero-search"
                  />
                  
                  {/* Search icon */}
                  <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-500" />
                </div>
                
                {/* Traditional separate search button */}
                <Button 
                  type="submit"
                  size="lg"
                  data-testid="button-search"
                >
                  Search
                </Button>
              </div>
            </form>
            
            {/* Simple helper text */}
            <p className="text-xs sm:text-sm text-white/70 mt-3 text-center px-4 sm:px-0">
              Explore our comprehensive peptide research and education resources
            </p>
          </div>

          {/* Clean trust indicators - responsive grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 md:gap-12 text-center px-4 sm:px-0">
            <div className="space-y-1">
              <div className="font-semibold text-xl sm:text-2xl text-white">50+</div>
              <div className="text-xs sm:text-sm text-white/70">Research Partners</div>
            </div>
            <div className="space-y-1">
              <div className="font-semibold text-xl sm:text-2xl text-white">10K+</div>
              <div className="text-xs sm:text-sm text-white/70">Active Members</div>
            </div>
            <div className="space-y-1">
              <div className="font-semibold text-xl sm:text-2xl text-white">100%</div>
              <div className="text-xs sm:text-sm text-white/70">Science-Based</div>
            </div>
            <div className="space-y-1">
              <div className="font-semibold text-xl sm:text-2xl text-white">24/7</div>
              <div className="text-xs sm:text-sm text-white/70">Expert Support</div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}