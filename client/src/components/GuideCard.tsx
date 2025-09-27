import { Link } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar } from "lucide-react";
import type { Guide } from "@shared/schema";

export interface GuideCardProps {
  guide: Guide;
}

export default function GuideCard({ guide }: GuideCardProps) {
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Generate category badge color based on category
  const getCategoryVariant = (category: string) => {
    switch(category.toLowerCase()) {
      case 'peptide deep dives':
        return 'default';
      case 'beginner guides':
        return 'secondary';
      case 'condition-specific':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <Link href={`/guide/${guide.slug}`}>
      <Card 
        className="h-full hover-elevate transition-all duration-200 cursor-pointer"
        data-testid={`card-guide-${guide.slug}`}
      >
        <CardHeader className="pb-3 sm:pb-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <Badge 
              variant={getCategoryVariant(guide.category)} 
              className="text-xs"
              data-testid={`badge-category-${guide.slug}`}
            >
              {guide.category}
            </Badge>
            {guide.featured && (
              <Badge 
                className="text-xs bg-primary/10 text-primary"
                data-testid={`badge-featured-${guide.slug}`}
              >
                Featured
              </Badge>
            )}
          </div>
          <h3 
            className="text-base sm:text-lg font-bold leading-tight line-clamp-2"
            data-testid={`text-title-${guide.slug}`}
          >
            {guide.title}
          </h3>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p 
            className="text-xs sm:text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-3"
            data-testid={`text-excerpt-${guide.slug}`}
          >
            {guide.excerpt || guide.metaDescription}
          </p>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span 
                className="flex items-center gap-1"
                data-testid={`text-readtime-${guide.slug}`}
              >
                <Clock className="w-3 h-3" />
                {guide.readTime} min read
              </span>
              <span 
                className="flex items-center gap-1"
                data-testid={`text-date-${guide.slug}`}
              >
                <Calendar className="w-3 h-3" />
                {formatDate(guide.publishDate)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}