import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', searchQuery);
  };

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
          Peptide information you can trust
        </h1>
        <p className="text-xl font-medium text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          Shrine Peptides analyzes and summarizes research to determine which peptides 
          and protocols work for optimal health and performance.
        </p>
        
        {/* Large Search Box */}
        <div className="max-w-2xl mx-auto mb-16">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="search"
              placeholder="Search peptides, conditions, research..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-16 text-lg px-6 pr-24 rounded-lg border-2 border-border focus:border-primary"
              data-testid="input-hero-search"
            />
            <Button 
              type="submit"
              className="absolute right-2 top-2 h-12 px-6 font-medium"
              data-testid="button-search"
            >
              Search
            </Button>
          </form>
          <p className="text-sm font-light text-muted-foreground mt-4">
            Search our database of peptides, health conditions, and research summaries
          </p>
        </div>
        
        {/* Trust indicators */}
        <div className="text-sm font-light text-muted-foreground mb-8">
          Trusted by researchers, clinicians, and health professionals worldwide
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60 grayscale">
          <div className="text-center text-sm font-light">
            Research<br/>Universities
          </div>
          <div className="text-center text-sm font-light">
            Medical<br/>Practices
          </div>
          <div className="text-center text-sm font-light">
            Professional<br/>Athletes
          </div>
          <div className="text-center text-sm font-light">
            Health<br/>Practitioners
          </div>
        </div>
      </div>
    </section>
  );
}