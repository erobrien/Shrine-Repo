import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useSearch } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, BookOpen } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import GuideCard from "@/components/GuideCard";
import type { Guide } from "@shared/schema";

interface GuideResponse {
  data: Guide[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function Guides() {
  const [, navigate] = useLocation();
  const searchParams = useSearch();
  const urlSearchQuery = new URLSearchParams(searchParams).get('search') || '';
  const urlCategory = new URLSearchParams(searchParams).get('category') || null;
  const urlPage = parseInt(new URLSearchParams(searchParams).get('page') || '1');
  
  const [searchQuery, setSearchQuery] = useState(urlSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(urlCategory);
  const [currentPage, setCurrentPage] = useState(urlPage);
  const [localSearch, setLocalSearch] = useState(urlSearchQuery);

  const ITEMS_PER_PAGE = 12;

  // Update local state when URL changes
  useEffect(() => {
    setSearchQuery(urlSearchQuery);
    setLocalSearch(urlSearchQuery);
  }, [urlSearchQuery]);

  useEffect(() => {
    setSelectedCategory(urlCategory);
  }, [urlCategory]);

  useEffect(() => {
    setCurrentPage(urlPage);
  }, [urlPage]);

  // Update URL parameters
  const updateUrl = (search?: string, category?: string | null, page?: number) => {
    const params = new URLSearchParams();
    const finalSearch = search !== undefined ? search : searchQuery;
    const finalCategory = category !== undefined ? category : selectedCategory;
    const finalPage = page !== undefined ? page : currentPage;
    
    if (finalSearch) params.set('search', finalSearch);
    if (finalCategory) params.set('category', finalCategory);
    if (finalPage > 1) params.set('page', String(finalPage));
    
    const queryString = params.toString();
    navigate(`/research${queryString ? `?${queryString}` : ''}`);
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchQuery) {
        setSearchQuery(localSearch);
        setCurrentPage(1); 
        updateUrl(localSearch, selectedCategory, 1);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch]);

  // Update category
  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    updateUrl(searchQuery, category, 1);
  };

  // Update page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrl(searchQuery, selectedCategory, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch all guides (no pagination on API side - we'll handle it client side)
  const { data: guidesResponse, isLoading } = useQuery<GuideResponse>({
    queryKey: ['/api/guides'],
    queryFn: async () => {
      const response = await fetch(`/api/guides?limit=1000`); // Fetch all guides
      if (!response.ok) throw new Error('Failed to fetch guides');
      return response.json();
    },
  });

  // Filter guides locally based on search and category
  const filteredGuides = useMemo(() => {
    if (!guidesResponse?.data) return [];
    
    let filtered = guidesResponse.data;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (guide) =>
          guide.title.toLowerCase().includes(query) ||
          (guide.excerpt && guide.excerpt.toLowerCase().includes(query)) ||
          (guide.metaDescription && guide.metaDescription.toLowerCase().includes(query)) ||
          (guide.tags && guide.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(
        (guide) => guide.category === selectedCategory
      );
    }

    return filtered;
  }, [guidesResponse?.data, searchQuery, selectedCategory]);

  // Get unique categories from guides
  const categories = useMemo(() => {
    if (!guidesResponse?.data) return [];
    const uniqueCategories = new Set(guidesResponse.data.map(guide => guide.category));
    return Array.from(uniqueCategories).sort();
  }, [guidesResponse?.data]);

  // Category counts
  const categoryCounts = useMemo(() => {
    if (!guidesResponse?.data) return new Map();
    const counts = new Map<string, number>();
    guidesResponse.data.forEach(guide => {
      counts.set(guide.category, (counts.get(guide.category) || 0) + 1);
    });
    return counts;
  }, [guidesResponse?.data]);

  // Calculate total pages for filtered results
  const totalFilteredPages = Math.ceil(filteredGuides.length / ITEMS_PER_PAGE);
  const paginatedGuides = filteredGuides.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  // Create a proper response object for filtered results
  const finalGuidesResponse = {
    data: paginatedGuides,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    total: filteredGuides.length,
    totalPages: totalFilteredPages
  };

  // Generate dynamic SEO meta
  const totalGuides = guidesResponse?.total || 0;
  const title = `Peptide Research - ${totalGuides} Research Articles | Peptide Dojo`;
  const description = `Explore ${totalGuides} comprehensive research articles covering peptide studies, protocols, and therapeutic applications. Expert-written content with scientific references and clinical insights.`;
  
  // Schema.org structured data for research articles listing
  const researchPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Peptide Research Articles",
    "description": description,
    "url": `${window.location.origin}/research`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": totalGuides,
      "name": "Research Articles",
      "description": "Evidence-based peptide research articles and clinical protocols"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": window.location.origin
        },
        {
          "@type": "ListItem", 
          "position": 2,
          "name": "Research",
          "item": `${window.location.origin}/research`
        }
      ]
    }
  };

  return (
    <>
      <PageMeta 
        title={title}
        description={description}
        url={`${window.location.origin}/research${searchQuery || selectedCategory ? '?' + new URLSearchParams(window.location.search).toString() : ''}`}
        type="website"
        keywords={['peptide research', 'clinical protocols', 'dosing guides', 'evidence-based', 'therapeutic peptides', 'research articles', 'peptide studies']}
        schema={researchPageSchema}
      />
      <div className="min-h-screen py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
              <h1 className="text-3xl sm:text-4xl font-bold">Dosing Guides</h1>
            </div>
            <p className="text-base sm:text-lg font-medium text-muted-foreground max-w-3xl mx-auto px-2 sm:px-0">
              Evidence-based dosing protocols and administration guides for peptides, with detailed safety information and research-backed recommendations.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6 sm:mb-8">
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search guides by title, content, or tags..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="pl-10 h-12"
                data-testid="input-search-guides"
              />
            </div>
          </div>

          {/* Category Filters */}
          {categories.length > 0 && (
            <div className="mb-8 sm:mb-10">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChange(null)}
                  data-testid="button-filter-all"
                >
                  All Guides ({guidesResponse?.total || 0})
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategoryChange(category)}
                    data-testid={`button-filter-${category.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {category} ({categoryCounts.get(category) || 0})
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Guides Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
              {[...Array(12)].map((_, i) => (
                <Card key={i} className="h-full">
                  <div className="p-6">
                    <Skeleton className="h-5 w-20 mb-3" />
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-5/6 mb-4" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </Card>
              ))}
            </div>
          ) : paginatedGuides.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">
                {searchQuery || selectedCategory
                  ? "No guides found matching your criteria."
                  : "No guides available yet."}
              </p>
              {(searchQuery || selectedCategory) && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setLocalSearch('');
                    setSearchQuery('');
                    setSelectedCategory(null);
                    setCurrentPage(1);
                    updateUrl('', null, 1);
                  }}
                  data-testid="button-clear-filters"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Pagination Summary */}
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground" data-testid="pagination-summary">
                  Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredGuides.length)} of {filteredGuides.length} guides
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mb-8">
                {paginatedGuides.map((guide) => (
                  <GuideCard key={guide.id} guide={guide} />
                ))}
              </div>

              {/* Pagination */}
              {totalFilteredPages > 1 && (
                <div className="flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          data-testid="button-page-previous"
                        />
                      </PaginationItem>
                      
                      {/* Page numbers */}
                      {[...Array(totalFilteredPages)].map((_, i) => {
                        const pageNum = i + 1;
                        // Show first, last, and pages around current
                        if (
                          pageNum === 1 ||
                          pageNum === totalFilteredPages ||
                          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                        ) {
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink
                                onClick={() => handlePageChange(pageNum)}
                                isActive={currentPage === pageNum}
                                className="cursor-pointer"
                                data-testid={`button-page-${pageNum}`}
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        } else if (
                          pageNum === currentPage - 2 ||
                          pageNum === currentPage + 2
                        ) {
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationEllipsis />
                            </PaginationItem>
                          );
                        }
                        return null;
                      })}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => currentPage < totalFilteredPages && handlePageChange(currentPage + 1)}
                          className={currentPage === totalFilteredPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          data-testid="button-page-next"
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}