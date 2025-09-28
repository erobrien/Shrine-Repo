import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FlaskConical, 
  Clock, 
  Users, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Activity
} from "lucide-react";

interface ProtocolStep {
  id: string;
  step: number;
  title: string;
  description: string;
  duration?: string;
  notes?: string;
}

interface ResearchProtocolProps {
  protocol: {
    id: string;
    title: string;
    objective: string;
    duration: string;
    sampleSize?: string;
    methodology: string;
    inclusion?: string[];
    exclusion?: string[];
    steps: ProtocolStep[];
    safetyNotes?: string[];
    expectedOutcomes?: string[];
  };
}

export default function ResearchProtocol({ protocol }: ResearchProtocolProps) {
  return (
    <Card className="w-full" data-testid={`protocol-card-${protocol.id}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FlaskConical className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl mb-2" data-testid="text-protocol-title">
              {protocol.title}
            </CardTitle>
            <p className="text-muted-foreground text-sm leading-relaxed" data-testid="text-protocol-objective">
              {protocol.objective}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Protocol Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium text-muted-foreground">Duration</p>
              <p className="text-sm font-semibold" data-testid="text-protocol-duration">
                {protocol.duration}
              </p>
            </div>
          </div>

          {protocol.sampleSize && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
              <Users className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">Sample Size</p>
                <p className="text-sm font-semibold" data-testid="text-protocol-sample-size">
                  {protocol.sampleSize}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Target className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="text-xs font-medium text-muted-foreground">Study Type</p>
              <p className="text-sm font-semibold" data-testid="text-protocol-methodology">
                {protocol.methodology}
              </p>
            </div>
          </div>
        </div>

        {/* Inclusion/Exclusion Criteria */}
        {(protocol.inclusion || protocol.exclusion) && (
          <>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {protocol.inclusion && (
                <div>
                  <h4 className="flex items-center gap-2 font-semibold text-sm mb-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Inclusion Criteria
                  </h4>
                  <ul className="space-y-2" data-testid="list-protocol-inclusion">
                    {protocol.inclusion.map((criteria, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-600 mt-2 shrink-0" />
                        {criteria}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {protocol.exclusion && (
                <div>
                  <h4 className="flex items-center gap-2 font-semibold text-sm mb-3">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    Exclusion Criteria
                  </h4>
                  <ul className="space-y-2" data-testid="list-protocol-exclusion">
                    {protocol.exclusion.map((criteria, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2 shrink-0" />
                        {criteria}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        )}

        {/* Protocol Steps */}
        <Separator />
        <div>
          <h4 className="flex items-center gap-2 font-semibold text-sm mb-4">
            <Activity className="w-4 h-4 text-primary" />
            Protocol Steps
          </h4>
          <div className="space-y-4" data-testid="list-protocol-steps">
            {protocol.steps.map((step, index) => (
              <div key={step.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                    {step.step}
                  </div>
                  {index < protocol.steps.length - 1 && (
                    <div className="w-0.5 h-12 bg-border mt-2" />
                  )}
                </div>
                
                <div className="flex-1 pb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h5 className="font-semibold text-sm" data-testid={`text-step-title-${step.id}`}>
                      {step.title}
                    </h5>
                    {step.duration && (
                      <Badge variant="outline" className="text-xs">
                        {step.duration}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-2" data-testid={`text-step-description-${step.id}`}>
                    {step.description}
                  </p>
                  {step.notes && (
                    <p className="text-xs text-muted-foreground italic p-2 bg-muted/30 rounded">
                      Note: {step.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Notes */}
        {protocol.safetyNotes && protocol.safetyNotes.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="flex items-center gap-2 font-semibold text-sm mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Safety Considerations
              </h4>
              <ul className="space-y-2" data-testid="list-protocol-safety">
                {protocol.safetyNotes.map((note, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0" />
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* Expected Outcomes */}
        {protocol.expectedOutcomes && protocol.expectedOutcomes.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="flex items-center gap-2 font-semibold text-sm mb-3">
                <Target className="w-4 h-4 text-primary" />
                Expected Outcomes
              </h4>
              <ul className="space-y-2" data-testid="list-protocol-outcomes">
                {protocol.expectedOutcomes.map((outcome, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    {outcome}
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