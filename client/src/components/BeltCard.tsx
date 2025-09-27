import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface BeltCardProps {
  beltLevel: "white" | "red" | "black" | "gold";
  title: string;
  description: string;
  progress: number;
  totalModules: number;
  isUnlocked: boolean;
  onAdvance?: () => void;
}

export default function BeltCard({
  beltLevel,
  title,
  description,
  progress,
  totalModules,
  isUnlocked,
  onAdvance
}: BeltCardProps) {
  const beltColors = {
    white: "bg-card text-card-foreground border-2 border-border",
    red: "bg-primary text-primary-foreground",
    black: "bg-foreground text-background dark:bg-white dark:text-black",
    gold: "bg-gradient-to-r from-[hsl(var(--gold-enlightenment))] to-[hsl(var(--warm-amber))] text-background"
  };

  const beltEmoji = {
    white: "🤍",
    red: "❤️", 
    black: "🖤",
    gold: "💛"
  };

  return (
    <Card className="relative overflow-hidden hover-elevate transition-all duration-300" data-testid={`card-belt-${beltLevel}`}>
      {/* Ema plaque background pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url('/src/assets/patterns/LRG_Pattern_On White_Ghost_1758946478158.png')`,
          backgroundSize: '100px 100px',
          backgroundRepeat: 'repeat'
        }}
      ></div>
      
      {/* Ema plaque shape styling */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-3 bg-muted rounded-b-full"></div>
      
      <CardContent className="relative p-6 text-center">
        {/* Belt Badge */}
        <div className="flex justify-center mb-4">
          <Badge 
            className={`${beltColors[beltLevel]} px-4 py-2 text-lg font-bold`}
            data-testid={`badge-belt-${beltLevel}`}
          >
            {beltEmoji[beltLevel]} {title}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-muted-foreground mb-6 min-h-[48px]" data-testid={`text-belt-description-${beltLevel}`}>{description}</p>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span data-testid={`label-progress-${beltLevel}`}>Progress</span>
            <span data-testid={`text-progress-${beltLevel}`}>
              {progress}/{totalModules} modules
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2" data-testid={`progress-bar-${beltLevel}`}>
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(progress / totalModules) * 100}%` }}
              data-testid={`progress-fill-${beltLevel}`}
            ></div>
          </div>
        </div>

        {/* Action Button */}
        <Button
          variant={isUnlocked ? "default" : "secondary"}
          disabled={!isUnlocked}
          onClick={onAdvance}
          className="w-full font-medium"
          data-testid={`button-advance-${beltLevel}`}
        >
          {isUnlocked 
            ? progress === totalModules 
              ? "Claim Your Belt" 
              : "Continue Training"
            : "Locked"
          }
        </Button>
      </CardContent>
    </Card>
  );
}