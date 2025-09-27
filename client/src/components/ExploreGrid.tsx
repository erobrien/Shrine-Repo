import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ExploreSection {
  title: string;
  description: string;
  items: Array<{
    name: string;
    path: string;
    description?: string;
  }>;
  viewAllPath: string;
}

export default function ExploreGrid() {
  // todo: remove mock functionality - replace with real data
  const sections: ExploreSection[] = [
    {
      title: "Peptides",
      description: "Research-backed information on individual peptides and their effects.",
      items: [
        { name: "BPC-157", path: "/peptides/bpc-157", description: "Body protection and healing" },
        { name: "GLP-1", path: "/peptides/glp-1", description: "Glucose regulation and weight management" },
        { name: "TB-500", path: "/peptides/tb-500", description: "Tissue repair and recovery" },
        { name: "IGF-1 LR3", path: "/peptides/igf-1-lr3", description: "Growth factor signaling" },
        { name: "Melanotan II", path: "/peptides/melanotan-ii", description: "Melanogenesis regulation" }
      ],
      viewAllPath: "/peptides"
    },
    {
      title: "Conditions",
      description: "Health conditions that may benefit from peptide interventions.",
      items: [
        { name: "Muscle Recovery", path: "/conditions/muscle-recovery" },
        { name: "Weight Management", path: "/conditions/weight-management" },
        { name: "Sleep Disorders", path: "/conditions/sleep-disorders" },
        { name: "Cognitive Function", path: "/conditions/cognitive-function" },
        { name: "Joint Health", path: "/conditions/joint-health" }
      ],
      viewAllPath: "/conditions"
    },
    {
      title: "Guides",
      description: "Evidence-based guides on peptide protocols and best practices.",
      items: [
        { name: "Beginner's Guide to Peptides", path: "/guides/beginners-guide" },
        { name: "Peptide Cycling Protocols", path: "/guides/cycling-protocols" },
        { name: "Dosage and Administration", path: "/guides/dosage-administration" },
        { name: "Safety and Side Effects", path: "/guides/safety-side-effects" },
        { name: "Research Methodology", path: "/guides/research-methodology" }
      ],
      viewAllPath: "/guides"
    },
    {
      title: "Categories",
      description: "Browse peptides by therapeutic category and application.",
      items: [
        { name: "Performance Enhancement", path: "/categories/performance" },
        { name: "Recovery & Healing", path: "/categories/recovery" },
        { name: "Metabolic Health", path: "/categories/metabolic" },
        { name: "Cognitive Enhancement", path: "/categories/cognitive" },
        { name: "Anti-Aging", path: "/categories/anti-aging" }
      ],
      viewAllPath: "/categories"
    }
  ];

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Explore Peptide Dojo</h2>
          <p className="text-base sm:text-lg font-medium text-muted-foreground max-w-3xl mx-auto px-2 sm:px-0">
            See what the evidence shows. Information is organized into comprehensive categories 
            covering peptides, conditions, and evidence-based protocols.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {sections.map((section) => (
            <Card key={section.title} className="h-full">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg font-bold text-primary">
                  {section.title}
                </CardTitle>
                <p className="text-xs sm:text-sm font-light text-muted-foreground mt-1">
                  {section.description}
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  {section.items.map((item) => (
                    <div key={item.name}>
                      <a 
                        href={item.path}
                        className="text-sm font-medium hover:text-primary transition-colors cursor-pointer block py-3 sm:py-1 -mx-2 px-2 sm:mx-0 sm:px-0 min-h-[44px] sm:min-h-0 flex items-center"
                        data-testid={`link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={(e) => {
                          e.preventDefault();
                          console.log(`Navigate to ${item.path}`);
                        }}
                      >
                        {item.name}
                      </a>
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full min-h-[44px]"
                  data-testid={`button-view-all-${section.title.toLowerCase()}`}
                  onClick={() => console.log(`View all ${section.title}`)}
                >
                  View All
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}