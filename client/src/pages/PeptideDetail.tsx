import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ExternalLink } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import type { Peptide, Category } from "@shared/schema";

export default function PeptideDetail() {
  const [, params] = useRoute("/peptide/:id");
  const peptideId = params?.id;

  // Fetch single peptide
  const { data: peptide, isLoading: peptideLoading } = useQuery<Peptide>({
    queryKey: ['/api/peptides', peptideId],
    enabled: !!peptideId,
  });

  // Fetch categories for category display
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const category = categories.find((c) => c.id === peptide?.categoryId);
  const isLoading = peptideLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48 mb-4" />
              <Skeleton className="h-6 w-24 mb-2" />
              <Skeleton className="h-10 w-32" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!peptide) {
    return (
      <div className="min-h-screen py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Peptide Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The peptide you're looking for could not be found.
          </p>
          <Link href="/peptides">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Peptides
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Generate dynamic SEO meta tags
  const pageTitle = `${peptide.name} - Research Peptide | Peptide Dojo`;
  const pageDescription = peptide.shortDescription 
    ? peptide.shortDescription.substring(0, 155) + '...' 
    : `${peptide.name} research peptide. ${peptide.description ? peptide.description.substring(0, 120) + '...' : 'Detailed information, dosing, and research applications.'}`;

  return (
    <>
      <PageMeta 
        title={pageTitle}
        description={pageDescription}
      />
      <div className="min-h-screen py-8 sm:py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <Link href="/peptides">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Peptides
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-2xl sm:text-3xl font-bold mb-2" data-testid="text-peptide-name">
                  {peptide.name}
                </CardTitle>
                {peptide.alternateNames && peptide.alternateNames.length > 0 && (
                  <p className="text-sm text-muted-foreground mb-3" data-testid="text-alternate-names">
                    Also known as: {peptide.alternateNames.join(", ")}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {category && (
                    <Badge variant="outline" data-testid="badge-category">
                      {category.name}
                    </Badge>
                  )}
                  {peptide.isBlend && (
                    <Badge className="bg-primary/10 text-primary" data-testid="badge-blend">
                      Peptide Blend
                    </Badge>
                  )}
                  <Badge variant="secondary" data-testid="text-sku">
                    SKU: {peptide.sku}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary" data-testid="text-price">
                  ${peptide.price}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Short Description */}
            {peptide.shortDescription && (
              <div>
                <h3 className="text-lg font-semibold mb-2" data-testid="heading-overview">Overview</h3>
                <p className="text-muted-foreground leading-relaxed" data-testid="text-overview">
                  {peptide.shortDescription}
                </p>
              </div>
            )}

            {/* Full Description */}
            {peptide.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2" data-testid="heading-description">Detailed Description</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap" data-testid="text-description">
                  {peptide.description}
                </p>
              </div>
            )}

            {/* Dosage Information */}
            {peptide.dosage && (
              <div>
                <h3 className="text-lg font-semibold mb-2" data-testid="heading-dosage">Dosage Information</h3>
                <p className="text-muted-foreground leading-relaxed" data-testid="text-dosage">
                  {peptide.dosage}
                </p>
              </div>
            )}

            {/* Ingredients (for blends) */}
            {peptide.isBlend && peptide.ingredients && peptide.ingredients.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2" data-testid="heading-ingredients">Blend Ingredients</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1" data-testid="list-ingredients">
                  {peptide.ingredients.map((ingredient, index) => (
                    <li key={index} data-testid={`text-ingredient-${index}`}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Research Applications */}
            {peptide.researchApplications && (
              <div>
                <h3 className="text-lg font-semibold mb-2" data-testid="heading-research">Research Applications</h3>
                <p className="text-muted-foreground leading-relaxed" data-testid="text-research">
                  {peptide.researchApplications}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-6 border-t">
              <a
                href={`https://shrinepeptides.com/product/${peptide.sku.toLowerCase()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button data-testid="button-view-shrine">
                  View on Shrine Peptides
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </>
  );
}