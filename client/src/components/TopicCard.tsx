import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface TopicCardProps {
  title: string;
  summary: string;
  category: "peptide" | "condition" | "guide" | "research";
  evidenceGrade: "A" | "B" | "C" | "D" | "Insufficient";
  lastUpdated: string;
  studyCount?: number;
  href: string;
  onView?: () => void;
}

export default function TopicCard({
  title,
  summary,
  category,
  evidenceGrade,
  lastUpdated,
  studyCount,
  href,
  onView
}: TopicCardProps) {
  // Use semantic classes that adapt to dark mode
  const getEvidenceClass = (grade: string) => {
    switch(grade) {
      case "A": 
        // Strong evidence - use primary/success colors
        return "bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary-foreground dark:border-primary/30";
      case "B":
        // Good evidence - use secondary colors  
        return "bg-secondary/80 text-secondary-foreground border-secondary/20 dark:bg-secondary/60 dark:text-secondary-foreground dark:border-secondary/30";
      case "C":
        // Moderate evidence - use accent colors
        return "bg-accent text-accent-foreground border-accent/20 dark:bg-accent/80 dark:text-accent-foreground dark:border-accent/30";
      case "D":
        // Weak evidence - use muted colors
        return "bg-muted text-muted-foreground border-muted dark:bg-muted/80 dark:text-muted-foreground dark:border-muted";
      case "Insufficient":
        // No evidence - use very muted colors
        return "bg-muted/50 text-muted-foreground border-muted/50 dark:bg-muted/30 dark:text-muted-foreground dark:border-muted/50";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  const categoryLabels = {
    "peptide": "Peptide",
    "condition": "Condition",
    "guide": "Guide",
    "research": "Research"
  };

  return (
    <Card className="h-full hover-elevate transition-all duration-200">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
          <Badge variant="outline" className="text-xs sm:text-xs">
            {categoryLabels[category]}
          </Badge>
          <Badge 
            variant="outline"
            className={`text-xs font-medium ${getEvidenceClass(evidenceGrade)}`}
            data-testid={`badge-evidence-${evidenceGrade.toLowerCase()}`}
          >
            Grade {evidenceGrade}
          </Badge>
        </div>
        <CardTitle className="text-base sm:text-lg font-bold leading-tight" data-testid={`title-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 leading-relaxed min-h-[3rem] sm:min-h-[60px] line-clamp-3">
          {summary}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground mb-3 sm:mb-4">
          <span data-testid={`text-updated-${lastUpdated.replace(/\s+/g, '-')}`}>
            Updated {lastUpdated}
          </span>
          {studyCount && (
            <span data-testid={`text-studies-${studyCount}`}>
              {studyCount} studies
            </span>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full font-medium min-h-[44px]"
          onClick={onView}
          data-testid={`button-view-${title.toLowerCase().replace(/\s+/g, '-')}`}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}