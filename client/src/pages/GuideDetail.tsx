import { useState, useEffect, useRef } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  ExternalLink, 
  Clock, 
  Calendar,
  User,
  BookOpen,
  ChevronRight,
  List
} from "lucide-react";
import PageMeta from "@/components/PageMeta";
import GuideCard from "@/components/GuideCard";
import type { Guide, Peptide } from "@shared/schema";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function GuideDetail() {
  const [, params] = useRoute("/guide/:slug");
  const slug = params?.slug;
  const [tocItems, setTocItems] = useState<TOCItem[]>([]);
  const [activeSection, setActiveSection] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);

  // Fetch guide by slug
  const { data: guide, isLoading: guideLoading } = useQuery<Guide>({
    queryKey: ['/api/guides', slug],
    queryFn: async () => {
      const response = await fetch(`/api/guides/${slug}`);
      if (!response.ok) throw new Error('Failed to fetch guide');
      return response.json();
    },
    enabled: !!slug,
  });

  // Fetch related peptides
  const { data: relatedPeptides = [] } = useQuery<Peptide[]>({
    queryKey: ['/api/peptides', guide?.relatedPeptides],
    queryFn: async () => {
      if (!guide?.relatedPeptides?.length) return [];
      
      // Fetch all peptides and filter by IDs
      const response = await fetch('/api/peptides');
      if (!response.ok) throw new Error('Failed to fetch peptides');
      const allPeptides: Peptide[] = await response.json();
      
      return allPeptides.filter(p => 
        guide.relatedPeptides?.includes(p.id)
      );
    },
    enabled: !!guide?.relatedPeptides?.length,
  });

  // Fetch related guides (same category, excluding current)
  const { data: relatedGuides = [] } = useQuery<Guide[]>({
    queryKey: ['/api/guides/category', guide?.category],
    queryFn: async () => {
      if (!guide?.category) return [];
      
      const response = await fetch(`/api/guides/category/${encodeURIComponent(guide.category)}`);
      if (!response.ok) throw new Error('Failed to fetch related guides');
      const guides: Guide[] = await response.json();
      
      // Filter out current guide and limit to 3
      return guides
        .filter(g => g.id !== guide.id)
        .slice(0, 3);
    },
    enabled: !!guide?.category,
  });

  // Parse HTML content and extract TOC
  useEffect(() => {
    if (!guide?.content || !contentRef.current) return;

    // Set the sanitized content directly
    contentRef.current.innerHTML = guide.content;
    
    // Extract headings for TOC from the rendered content
    const headings = contentRef.current.querySelectorAll('h1, h2, h3, h4');
    const items: TOCItem[] = [];
    
    headings.forEach((heading, index) => {
      // Check if heading already has an ID (from server), otherwise create one
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }
      
      items.push({
        id: heading.id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName[1])
      });
    });
    
    setTocItems(items);
  }, [guide?.content]);

  // Handle TOC navigation
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (const item of tocItems) {
        const element = document.getElementById(item.id);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          const elementTop = top + window.scrollY;
          const elementBottom = bottom + window.scrollY;
          
          if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems]);

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (guideLoading) {
    return (
      <div className="min-h-screen py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-32 mb-6" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-6 w-48 mb-8" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Guide Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The guide you're looking for could not be found.
          </p>
          <Link href="/research">
            <Button data-testid="button-back-guides">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Research
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Schema.org structured data for individual guide/article
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": guide.title,
    "description": guide.metaDescription || guide.excerpt,
    "author": {
      "@type": "Person",
      "name": guide.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Peptide Dojo",
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/shrine-icon.svg`
      }
    },
    "datePublished": new Date(guide.publishDate).toISOString(),
    "dateModified": new Date(guide.publishDate).toISOString(),
    "url": `${window.location.origin}/guide/${guide.slug}`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${window.location.origin}/guide/${guide.slug}`
    },
    "articleSection": guide.category,
    "keywords": guide.tags,
    "wordCount": guide.content?.replace(/<[^>]*>/g, '').split(' ').length || 0,
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
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": guide.title,
          "item": `${window.location.origin}/guide/${guide.slug}`
        }
      ]
    }
  };

  return (
    <>
      <PageMeta 
        title={guide.metaTitle}
        description={guide.metaDescription}
        url={`${window.location.origin}/guide/${guide.slug}`}
        type="article"
        author={guide.author}
        publishedTime={new Date(guide.publishDate).toISOString()}
        modifiedTime={new Date(guide.publishDate).toISOString()}
        keywords={guide.tags || [guide.category, 'peptide research', 'clinical protocols']}
        schema={articleSchema}
      />
      
      <div className="min-h-screen py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Navigation */}
          <div className="max-w-4xl mx-auto mb-6">
            <Link href="/research">
              <Button variant="ghost" data-testid="button-back">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Research
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <article className="max-w-none">
                {/* Header */}
                <header className="mb-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" data-testid="badge-category">
                      {guide.category}
                    </Badge>
                    {guide.featured && (
                      <Badge className="bg-primary/10 text-primary" data-testid="badge-featured">
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  <h1 className="text-3xl sm:text-4xl font-bold mb-4" data-testid="text-title">
                    {guide.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1" data-testid="text-author">
                      <User className="w-4 h-4" />
                      {guide.author}
                    </span>
                    <span className="flex items-center gap-1" data-testid="text-date">
                      <Calendar className="w-4 h-4" />
                      {formatDate(guide.publishDate)}
                    </span>
                    <span className="flex items-center gap-1" data-testid="text-readtime">
                      <Clock className="w-4 h-4" />
                      {guide.readTime} min read
                    </span>
                  </div>
                  
                  {guide.excerpt && (
                    <p className="mt-4 text-lg text-muted-foreground leading-relaxed" data-testid="text-excerpt">
                      {guide.excerpt}
                    </p>
                  )}
                </header>

                {/* Article Content */}
                <div 
                  ref={contentRef}
                  className="prose prose-lg max-w-none"
                  data-testid="article-content"
                  dangerouslySetInnerHTML={{ __html: guide.content }}
                />

                {/* Tags */}
                {guide.tags && guide.tags.length > 0 && (
                  <div className="mt-8 pt-8 border-t">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm font-medium text-muted-foreground">Tags:</span>
                      {guide.tags.map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary"
                          className="text-xs"
                          data-testid={`badge-tag-${tag.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </article>

              {/* Related Peptides */}
              {relatedPeptides.length > 0 && (
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ChevronRight className="w-5 h-5 text-primary" />
                      Related Peptide Products
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {relatedPeptides.map((peptide) => (
                        <div 
                          key={peptide.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover-elevate transition-all"
                          data-testid={`card-peptide-${peptide.sku}`}
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm mb-1" data-testid={`text-peptide-name-${peptide.sku}`}>
                              {peptide.name}
                            </h4>
                            <p className="text-xs text-muted-foreground truncate" data-testid={`text-peptide-desc-${peptide.sku}`}>
                              {peptide.shortDescription}
                            </p>
                            <p className="text-lg font-bold text-primary mt-2" data-testid={`text-peptide-price-${peptide.sku}`}>
                              ${peptide.price}
                            </p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Link href={`/peptide/${peptide.id}`}>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                data-testid={`button-view-${peptide.sku}`}
                              >
                                View
                              </Button>
                            </Link>
                            <a
                              href={`https://shrinepeptides.com/product/${peptide.sku}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button 
                                size="sm"
                                data-testid={`button-shop-${peptide.sku}`}
                              >
                                Shop
                                <ExternalLink className="w-3 h-3 ml-1" />
                              </Button>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Related Guides */}
              {relatedGuides.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Related Guides
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {relatedGuides.map((relatedGuide) => (
                      <GuideCard key={relatedGuide.id} guide={relatedGuide} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Table of Contents */}
            <aside className="lg:col-span-1">
              {tocItems.length > 0 && (
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <List className="w-4 h-4" />
                      Table of Contents
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[400px]">
                      <div className="px-6 pb-6">
                        {tocItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className={`
                              block w-full text-left py-2 text-sm transition-colors
                              hover:text-primary
                              ${activeSection === item.id ? 'text-primary font-medium' : 'text-muted-foreground'}
                              ${item.level > 2 ? `pl-${(item.level - 2) * 4}` : ''}
                            `}
                            style={{ paddingLeft: item.level > 1 ? `${(item.level - 1) * 1}rem` : '0' }}
                            data-testid={`toc-item-${item.id}`}
                          >
                            {item.text}
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}