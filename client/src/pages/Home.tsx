import HeroSection from "@/components/HeroSection";
import BeltCard from "@/components/BeltCard";
import ModuleCard from "@/components/ModuleCard";
import SacredScrolls from "@/components/SacredScrolls";
import NewsletterSignup from "@/components/NewsletterSignup";

export default function Home() {
  // todo: remove mock functionality - replace with real progression data
  const beltData = [
    {
      beltLevel: "white" as const,
      title: "White Belt",
      description: "Master the fundamentals of peptide science and basic terminology.",
      progress: 8,
      totalModules: 10,
      isUnlocked: true
    },
    {
      beltLevel: "red" as const,
      title: "Red Belt", 
      description: "Dive deeper into peptide mechanisms and advanced applications.",
      progress: 3,
      totalModules: 12,
      isUnlocked: true
    },
    {
      beltLevel: "black" as const,
      title: "Black Belt",
      description: "Master complex peptide protocols and clinical applications.",
      progress: 0,
      totalModules: 15,
      isUnlocked: false
    },
    {
      beltLevel: "gold" as const,
      title: "Gold Belt",
      description: "Achieve mastery in cutting-edge peptide research and innovation.",
      progress: 0,
      totalModules: 20,
      isUnlocked: false
    }
  ];

  // todo: remove mock functionality - replace with real module data
  const featuredModules = [
    {
      title: "Introduction to Peptides",
      description: "Learn the foundational concepts of peptide science, structure, and biological functions.",
      category: "best-sellers" as const,
      duration: "30 min",
      difficulty: "Beginner" as const,
      isCompleted: true,
      isLocked: false
    },
    {
      title: "BPC-157 Deep Dive",
      description: "Comprehensive study of Body Protection Compound-157, its mechanisms and applications.",
      category: "recovery" as const,
      duration: "45 min", 
      difficulty: "Intermediate" as const,
      isCompleted: false,
      isLocked: false
    },
    {
      title: "Performance Peptide Protocols",
      description: "Advanced protocols for athletic enhancement and muscle development optimization.",
      category: "performance" as const,
      duration: "60 min",
      difficulty: "Advanced" as const,
      isCompleted: false,
      isLocked: false
    }
  ];

  return (
    <div className="min-h-screen">
      <HeroSection />

      {/* Belt Progression Section */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Your Path to Mastery</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Progress through the ancient belt system. Each belt unlocks deeper knowledge 
              and more advanced peptide wisdom.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {beltData.map((belt) => (
              <BeltCard
                key={belt.beltLevel}
                {...belt}
                onAdvance={() => console.log(`${belt.title} advance clicked`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Modules Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Teachings</h2>
            <p className="text-muted-foreground text-lg">
              Begin your journey with these essential modules handpicked by our sensei.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredModules.map((module) => (
              <ModuleCard
                key={module.title}
                {...module}
                onStart={() => console.log(`${module.title} started`)}
              />
            ))}
          </div>
        </div>
      </section>

      <SacredScrolls />
      <NewsletterSignup />
    </div>
  );
}