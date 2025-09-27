import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
          Peptide information you can trust
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
          Shrine Peptides analyzes and summarizes research to determine which peptides 
          and protocols work for optimal health and performance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            size="lg" 
            className="font-medium px-8 py-4"
            data-testid="button-explore-research"
            onClick={() => console.log('Explore Research clicked')}
          >
            Explore Research
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="font-medium px-8 py-4"
            data-testid="button-try-pro"
            onClick={() => console.log('Try Pro clicked')}
          >
            Try Pro
          </Button>
        </div>
        
        {/* Trust indicators */}
        <div className="text-sm text-muted-foreground mb-8">
          Trusted by researchers, clinicians, and health professionals worldwide
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60 grayscale">
          <div className="text-center text-sm font-medium">
            Research<br/>Universities
          </div>
          <div className="text-center text-sm font-medium">
            Medical<br/>Practices
          </div>
          <div className="text-center text-sm font-medium">
            Professional<br/>Athletes
          </div>
          <div className="text-center text-sm font-medium">
            Health<br/>Practitioners
          </div>
        </div>
      </div>
    </section>
  );
}