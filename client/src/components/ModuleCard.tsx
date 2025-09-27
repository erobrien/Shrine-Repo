import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface ModuleCardProps {
  title: string;
  description: string;
  category: "performance" | "recovery" | "wellness" | "longevity" | "weight-loss" | "blends" | "best-sellers" | "drive";
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  isCompleted: boolean;
  isLocked: boolean;
  onStart?: () => void;
}

export default function ModuleCard({
  title,
  description,
  category,
  duration,
  difficulty,
  isCompleted,
  isLocked,
  onStart
}: ModuleCardProps) {
  // Map categories to their corresponding icons from brand assets
  const categoryIcons = {
    "performance": "⚡",
    "recovery": "🔄", 
    "wellness": "🛡️",
    "longevity": "⏳",
    "weight-loss": "⚖️",
    "blends": "🧪",
    "best-sellers": "🏆",
    "drive": "❤️"
  };

  // Use semantic classes for difficulty levels
  const getDifficultyClass = (difficulty: string) => {
    switch(difficulty) {
      case "Beginner":
        return "bg-primary/10 text-primary border-primary/20";
      case "Intermediate":
        return "bg-accent text-accent-foreground border-accent/20";
      case "Advanced":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  return (
    <Card className="relative overflow-hidden hover-elevate transition-all duration-300 h-full" data-testid={`card-module-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      {/* Ghost pattern background texture */}
      <div 
        className="absolute inset-0 opacity-3"
        style={{
          backgroundImage: `url('/src/assets/patterns/LRG_Pattern_On White_Ghost_1758946478158.png')`,
          backgroundSize: '150px 150px',
          backgroundRepeat: 'repeat'
        }}
      ></div>

      {/* Lock overlay for locked modules */}
      {isLocked && (
        <div className="absolute inset-0 bg-background/80 z-10 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">🔒</div>
            <p className="text-muted-foreground font-medium">Complete previous modules</p>
          </div>
        </div>
      )}

      <CardHeader className="relative pb-4">
        <div className="flex items-center justify-between mb-2">
          <Badge 
            variant="outline" 
            className={`${getDifficultyClass(difficulty)} font-medium`}
            data-testid={`badge-difficulty-${difficulty.toLowerCase()}`}
          >
            {difficulty}
          </Badge>
          <div className="text-2xl" data-testid={`icon-category-${category}`}>
            {categoryIcons[category]}
          </div>
        </div>
        <CardTitle className="text-lg font-bold leading-tight" data-testid={`title-module-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="relative">
        <p className="text-muted-foreground mb-4 text-sm leading-relaxed min-h-[60px]" data-testid={`text-description-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {description}
        </p>

        <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
          <span data-testid={`text-duration-${duration.replace(/\s+/g, '-')}`}>
            📚 {duration}
          </span>
          <span className="capitalize" data-testid={`text-category-${category}`}>
            🏷️ {category.replace('-', ' ')}
          </span>
        </div>

        <Button
          variant={isCompleted ? "secondary" : "default"}
          disabled={isLocked}
          onClick={onStart}
          className="w-full font-medium"
          data-testid={`button-start-${title.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {isCompleted ? "Review Module" : "Start Learning"}
        </Button>
      </CardContent>
    </Card>
  );
}