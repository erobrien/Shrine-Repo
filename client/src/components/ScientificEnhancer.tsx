import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Microscope, 
  BookOpen, 
  Award, 
  TrendingUp,
  Users,
  Calendar
} from "lucide-react";

interface StudyEvidence {
  level: "high" | "moderate" | "low";
  description: string;
  studyCount?: number;
}

interface ScientificEnhancerProps {
  topic: string;
  evidenceLevel: StudyEvidence;
  keyFindings: string[];
  researchDate?: string;
  participantCount?: string;
  confidenceLevel?: string;
  variant?: "full" | "compact";
}

export default function ScientificEnhancer({
  topic,
  evidenceLevel,
  keyFindings,
  researchDate,
  participantCount,
  confidenceLevel,
  variant = "compact"
}: ScientificEnhancerProps) {
  
  const getEvidenceColor = (level: StudyEvidence["level"]) => {
    switch (level) {
      case "high":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "moderate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getEvidenceIcon = (level: StudyEvidence["level"]) => {
    switch (level) {
      case "high":
        return <Award className="w-4 h-4" />;
      case "moderate":
        return <TrendingUp className="w-4 h-4" />;
      case "low":
        return <BookOpen className="w-4 h-4" />;
      default:
        return <Microscope className="w-4 h-4" />;
    }
  };

  if (variant === "compact") {
    return (
      <div className="p-4 border-l-4 border-l-primary bg-muted/30 rounded-r-lg" data-testid={`scientific-enhancer-compact-${topic.toLowerCase().replace(/\s+/g, '-')}`}>
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded bg-primary/10">
            <Microscope className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Badge className={`text-xs ${getEvidenceColor(evidenceLevel.level)}`}>
                {getEvidenceIcon(evidenceLevel.level)}
                <span className="ml-1">{evidenceLevel.level.toUpperCase()} EVIDENCE</span>
              </Badge>
              {evidenceLevel.studyCount && (
                <span className="text-xs text-muted-foreground">
                  {evidenceLevel.studyCount} studies
                </span>
              )}
            </div>
            
            <p className="text-sm font-medium" data-testid="text-evidence-description">
              {evidenceLevel.description}
            </p>
            
            {keyFindings.length > 0 && (
              <ul className="text-xs text-muted-foreground space-y-1" data-testid="list-key-findings">
                {keyFindings.slice(0, 2).map((finding, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-primary">•</span>
                    {finding}
                  </li>
                ))}
                {keyFindings.length > 2 && (
                  <li className="text-xs font-medium text-primary">
                    +{keyFindings.length - 2} more findings
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full" data-testid={`scientific-enhancer-full-${topic.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Microscope className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg" data-testid="text-scientific-topic">
              Scientific Evidence: {topic}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={getEvidenceColor(evidenceLevel.level)}>
                {getEvidenceIcon(evidenceLevel.level)}
                <span className="ml-1">{evidenceLevel.level.toUpperCase()} EVIDENCE</span>
              </Badge>
              {evidenceLevel.studyCount && (
                <span className="text-sm text-muted-foreground">
                  Based on {evidenceLevel.studyCount} studies
                </span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed" data-testid="text-evidence-description">
          {evidenceLevel.description}
        </p>

        {/* Study Metadata */}
        {(researchDate || participantCount || confidenceLevel) && (
          <>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {researchDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Research Period</p>
                    <p className="text-sm font-semibold" data-testid="text-research-date">
                      {researchDate}
                    </p>
                  </div>
                </div>
              )}

              {participantCount && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Participants</p>
                    <p className="text-sm font-semibold" data-testid="text-participant-count">
                      {participantCount}
                    </p>
                  </div>
                </div>
              )}

              {confidenceLevel && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Confidence</p>
                    <p className="text-sm font-semibold" data-testid="text-confidence-level">
                      {confidenceLevel}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Key Findings */}
        {keyFindings.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="font-semibold text-sm mb-3">Key Research Findings</h4>
              <ul className="space-y-2" data-testid="list-key-findings">
                {keyFindings.map((finding, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    {finding}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}