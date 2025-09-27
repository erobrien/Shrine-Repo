import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Rising Sun Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/10 to-background">
        <div className="absolute inset-0 bg-gradient-radial from-primary/30 via-primary/5 to-transparent"></div>
      </div>
      
      {/* Seigaiha Wave Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url('/src/assets/patterns/LRG_Pattern_On White_Ghost_1758946478158.png')`,
          backgroundSize: '200px 200px',
          backgroundRepeat: 'repeat'
        }}
      ></div>

      {/* Torii Gate Silhouette */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-96 h-64 opacity-10">
          {/* Simplified Torii Gate SVG */}
          <svg viewBox="0 0 200 120" className="w-full h-full text-primary fill-current">
            <rect x="20" y="30" width="6" height="80" />
            <rect x="174" y="30" width="6" height="80" />
            <rect x="0" y="25" width="200" height="8" rx="4" />
            <rect x="15" y="45" width="170" height="6" rx="3" />
            <circle cx="100" cy="15" r="12" className="text-primary fill-current" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-6xl font-bold mb-6 text-foreground">
          Welcome to the Peptide Dojo
        </h1>
        <p className="text-xl text-muted-foreground mb-8 font-medium">
          Discipline. Purity. Knowledge. Your Gateway to Mastery.
        </p>
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          PURITY. POWER. PROVEN. - Master the science of peptides through structured learning and belt progression.
        </p>
        <Button 
          size="lg" 
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 py-4 text-lg"
          data-testid="button-step-through-gate"
          onClick={() => console.log('Step Through the Gate clicked')}
        >
          Step Through the Gate
        </Button>
      </div>
    </section>
  );
}