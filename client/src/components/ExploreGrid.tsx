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
    <section className="py-16 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Explore Shrine Peptides</h2>
          <p className="text-lg font-medium text-muted-foreground max-w-3xl mx-auto">
            See what the evidence shows. Information is organized into comprehensive categories 
            covering peptides, conditions, and evidence-based protocols.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sections.map((section) => (
            <Card key={section.title} className="h-full">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-primary">
                  {section.title}
                </CardTitle>
                <p className="text-sm font-light text-muted-foreground">
                  {section.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  {section.items.map((item) => (
                    <div key={item.name}>
                      <a 
                        href={item.path}
                        className="text-sm font-medium hover:text-primary transition-colors cursor-pointer"
                        data-testid={`link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={(e) => {
                          e.preventDefault();
                          console.log(`Navigate to ${item.path}`);
                        }}
                      >
                        {item.name}
                      </a>
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
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