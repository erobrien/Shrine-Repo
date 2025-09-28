import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import type { Peptide, Category } from "@shared/schema";

interface ExploreSection {
  title: string;
  description: string;
  items: Array<{
    name: string;
    path: string;
    description?: string;
  }>;
  viewAllPath: string;
  itemCount?: number;
  isLoading?: boolean;
}

export default function ExploreGrid() {
  // Fetch real peptides from the database
  const { data: peptides = [], isLoading: peptidesLoading } = useQuery<Peptide[]>({
    queryKey: ['/api/peptides'],
  });

  // Fetch categories from the database
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Create sections with real data where applicable
  const sections: ExploreSection[] = [
    {
      title: "Peptides",
      description: "Research-backed information on individual peptides and their effects.",
      items: peptides.slice(0, 5).map(peptide => ({
        name: peptide.name,
        path: `/peptide/${peptide.id}`,
        description: peptide.shortDescription || peptide.description?.substring(0, 100) || undefined
      })),
      viewAllPath: "/peptides",
      itemCount: peptides.length,
      isLoading: peptidesLoading
    },
    {
      title: "Categories",
      description: "Browse peptides by therapeutic category and application.",
      items: categories.slice(0, 5).map(category => {
        const categoryPeptides = peptides.filter(p => p.categoryId === category.id);
        return {
          name: category.name,
          path: `/peptides`,
          description: category.description || `${categoryPeptides.length} peptides`
        };
      }),
      viewAllPath: "/peptides",
      itemCount: categories.length,
      isLoading: categoriesLoading
    },
    {
      title: "Research",
      description: "Evidence-based guides on peptide protocols and best practices.",
      items: [
        { name: "Beginner's Guide to Peptides", path: "/research/beginners-guide" },
        { name: "Peptide Cycling Protocols", path: "/research/cycling-protocols" },
        { name: "Dosage and Administration", path: "/research/dosage-administration" },
        { name: "Safety and Side Effects", path: "/research/safety-side-effects" },
        { name: "Research Methodology", path: "/research/research-methodology" }
      ],
      viewAllPath: "/research"
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
            <Card key={section.title} className="h-full" data-testid={`card-section-${section.title.toLowerCase().replace(/\s+/g, '-')}`}>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg font-bold text-primary" data-testid={`text-section-title-${section.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  {section.title}
                  {section.itemCount !== undefined && !section.isLoading && (
                    <span className="text-sm font-normal text-muted-foreground ml-2" data-testid={`text-section-count-${section.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      ({section.itemCount})
                    </span>
                  )}
                </CardTitle>
                <p className="text-xs sm:text-sm font-light text-muted-foreground mt-1" data-testid={`text-section-description-${section.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  {section.description}
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  {section.isLoading ? (
                    // Show skeleton loading state
                    [...Array(5)].map((_, i) => (
                      <div key={i}>
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-3 w-3/4" />
                      </div>
                    ))
                  ) : section.items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No items available yet</p>
                  ) : (
                    section.items.map((item) => (
                      <div key={item.name} data-testid={`item-${section.title.toLowerCase().replace(/\s+/g, '-')}-${item.name.toLowerCase().replace(/\s+/g, '-')}`}>
                        <Link 
                          href={item.path}
                          className="text-sm font-medium hover:text-primary transition-colors cursor-pointer block py-3 sm:py-1 -mx-2 px-2 sm:mx-0 sm:px-0 min-h-[44px] sm:min-h-0 flex items-center"
                          data-testid={`link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {item.name}
                        </Link>
                        {item.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2" data-testid={`text-item-description-${item.name.toLowerCase().replace(/\s+/g, '-')}`}>
                            {item.description}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
                <Link href={section.viewAllPath}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full min-h-[44px]"
                    data-testid={`button-view-all-${section.title.toLowerCase()}`}
                  >
                    View All {section.title}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}