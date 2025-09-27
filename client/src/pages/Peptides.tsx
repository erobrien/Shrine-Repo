import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useSearch } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import type { Peptide, Category } from "@shared/schema";

export default function Peptides() {
  const [, navigate] = useLocation();
  const searchParams = useSearch();
  const urlSearchQuery = new URLSearchParams(searchParams).get('search') || '';
  const urlCategory = new URLSearchParams(searchParams).get('category') || null;
  
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(urlCategory);

  // Update local state when URL changes
  useEffect(() => {
    setSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);

  useEffect(() => {
    setSelectedCategory(urlCategory);
  }, [urlCategory]);

  // Update URL when search changes
  const updateSearch = (query: string) => {
    setSearchQuery(query);
    const params = new URLSearchParams();
    if (query) {
      params.set('search', query);
    }
    if (selectedCategory) {
      params.set('category', selectedCategory);
    }
    const queryString = params.toString();
    navigate(`/peptides${queryString ? `?${queryString}` : ''}`);
  };

  // Update category and URL
  const updateCategory = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    const params = new URLSearchParams();
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    if (categoryId) {
      params.set('category', categoryId);
    }
    const queryString = params.toString();
    navigate(`/peptides${queryString ? `?${queryString}` : ''}`);
  };

  // Fetch all peptides
  const { data: peptides = [], isLoading: peptideLoading } = useQuery<Peptide[]>({
    queryKey: ['/api/peptides'],
  });

  // Fetch all categories
  const { data: categories = [], isLoading: categoryLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Filter peptides based on search and category
  const filteredPeptides = useMemo(() => {
    let filtered = peptides;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (peptide) =>
          peptide.name.toLowerCase().includes(query) ||
          (peptide.shortDescription && peptide.shortDescription.toLowerCase().includes(query)) ||
          (peptide.description && peptide.description.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(
        (peptide) => peptide.categoryId === selectedCategory
      );
    }

    return filtered;
  }, [peptides, searchQuery, selectedCategory]);

  // Get peptide counts per category
  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    peptides.forEach((peptide) => {
      if (peptide.categoryId) {
        counts.set(peptide.categoryId, (counts.get(peptide.categoryId) || 0) + 1);
      }
    });
    return counts;
  }, [peptides]);

  const isLoading = peptideLoading || categoryLoading;

  return (
    <div className="min-h-screen py-8 sm:py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">Peptide Library</h1>
          <p className="text-base sm:text-lg font-medium text-muted-foreground max-w-3xl mx-auto px-2 sm:px-0">
            Explore our comprehensive collection of research peptides with detailed information and scientific data.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search peptides by name or description..."
              value={searchQuery}
              onChange={(e) => updateSearch(e.target.value)}
              className="pl-10 h-12"
              data-testid="input-search-peptides"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8 sm:mb-10">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => updateCategory(null)}
              data-testid="button-filter-all"
            >
              All Peptides ({peptides.length})
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => updateCategory(category.id)}
                data-testid={`button-filter-${category.slug}`}
              >
                {category.name} ({categoryCounts.get(category.id) || 0})
              </Button>
            ))}
          </div>
        </div>

        {/* Peptides Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="h-full">
                <CardHeader className="pb-3 sm:pb-4">
                  <Skeleton className="h-5 w-20 mb-2" />
                  <Skeleton className="h-6 w-full" />
                </CardHeader>
                <CardContent className="pt-0">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPeptides.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">
              {searchQuery || selectedCategory
                ? "No peptides found matching your criteria."
                : "No peptides available."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {filteredPeptides.map((peptide) => {
              const category = categories.find((c) => c.id === peptide.categoryId);
              return (
                <Card key={peptide.id} className="h-full hover-elevate transition-all duration-200" data-testid={`card-peptide-${peptide.id}`}>
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      {category && (
                        <Badge variant="outline" className="text-xs" data-testid={`badge-category-${peptide.id}`}>
                          {category.name}
                        </Badge>
                      )}
                      {peptide.isBlend && (
                        <Badge className="text-xs bg-primary/10 text-primary" data-testid={`badge-blend-${peptide.id}`}>
                          Blend
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-base sm:text-lg font-bold leading-tight" data-testid={`text-peptide-name-${peptide.id}`}>
                      {peptide.name}
                    </CardTitle>
                    {peptide.alternateNames && peptide.alternateNames.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1" data-testid={`text-alternate-names-${peptide.id}`}>
                        Also known as: {peptide.alternateNames.join(", ")}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-3" data-testid={`text-description-${peptide.id}`}>
                      {peptide.shortDescription || peptide.description || "Research peptide"}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold text-primary" data-testid={`text-price-${peptide.id}`}>
                        ${peptide.price}
                      </span>
                      <span className="text-xs text-muted-foreground" data-testid={`text-sku-${peptide.id}`}>
                        SKU: {peptide.sku}
                      </span>
                    </div>
                    <Link href={`/peptide/${peptide.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full font-medium min-h-[44px]"
                        data-testid={`button-view-${peptide.sku.toLowerCase()}`}
                      >
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}