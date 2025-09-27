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
  const evidenceColors = {
    "A": "bg-green-100 text-green-800 border-green-300",
    "B": "bg-blue-100 text-blue-800 border-blue-300", 
    "C": "bg-yellow-100 text-yellow-800 border-yellow-300",
    "D": "bg-orange-100 text-orange-800 border-orange-300",
    "Insufficient": "bg-gray-100 text-gray-800 border-gray-300"
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
            className={`text-xs font-medium border ${evidenceColors[evidenceGrade]}`}
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