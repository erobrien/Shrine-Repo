import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, FileText, Users } from "lucide-react";

interface Citation {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  pmid?: string;
  doi?: string;
  url?: string;
  type: "primary" | "secondary" | "meta-analysis" | "review";
}

interface CitationCardProps {
  citation: Citation;
  variant?: "full" | "compact";
}

export default function CitationCard({ citation, variant = "compact" }: CitationCardProps) {
  const getTypeColor = (type: Citation["type"]) => {
    switch (type) {
      case "primary":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "meta-analysis":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "review":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const formatAuthors = (authors: string[]) => {
    if (authors.length <= 3) {
      return authors.join(", ");
    }
    return `${authors.slice(0, 2).join(", ")} et al.`;
  };

  if (variant === "compact") {
    return (
      <div className="p-3 border rounded-lg bg-card" data-testid={`citation-compact-${citation.id}`}>
        <div className="flex items-start gap-2">
          <FileText className="w-4 h-4 mt-0.5 text-muted-foreground" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge className={`text-xs ${getTypeColor(citation.type)}`}>
                {citation.type.replace("-", " ")}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {citation.year}
              </span>
            </div>
            
            <h4 className="text-sm font-medium leading-snug mb-1" data-testid="text-citation-title">
              {citation.title}
            </h4>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
              <Users className="w-3 h-3" />
              <span data-testid="text-citation-authors">
                {formatAuthors(citation.authors)}
              </span>
            </div>
            
            <p className="text-xs text-muted-foreground italic" data-testid="text-citation-journal">
              {citation.journal}
            </p>
            
            {(citation.pmid || citation.doi || citation.url) && (
              <div className="flex gap-1 mt-2">
                {citation.pmid && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 text-xs"
                    data-testid="button-citation-pmid"
                    asChild
                  >
                    <a 
                      href={`https://pubmed.ncbi.nlm.nih.gov/${citation.pmid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      PubMed
                    </a>
                  </Button>
                )}
                
                {citation.doi && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 text-xs"
                    data-testid="button-citation-doi"
                    asChild
                  >
                    <a 
                      href={`https://doi.org/${citation.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      DOI
                    </a>
                  </Button>
                )}
                
                {citation.url && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 text-xs"
                    data-testid="button-citation-url"
                    asChild
                  >
                    <a href={citation.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full" data-testid={`citation-full-${citation.id}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-muted">
            <FileText className="w-6 h-6 text-muted-foreground" />
          </div>
          
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Badge className={getTypeColor(citation.type)}>
                {citation.type.replace("-", " ").toUpperCase()}
              </Badge>
              <span className="text-sm text-muted-foreground font-medium">
                {citation.year}
              </span>
            </div>
            
            <h3 className="text-lg font-semibold leading-snug" data-testid="text-citation-title">
              {citation.title}
            </h3>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span className="text-sm" data-testid="text-citation-authors">
                {formatAuthors(citation.authors)}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground italic" data-testid="text-citation-journal">
              {citation.journal}, {citation.year}
            </p>
            
            <div className="flex gap-2 pt-2">
              {citation.pmid && (
                <Button
                  variant="outline"
                  size="sm"
                  data-testid="button-citation-pmid"
                  asChild
                >
                  <a 
                    href={`https://pubmed.ncbi.nlm.nih.gov/${citation.pmid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    PubMed: {citation.pmid}
                  </a>
                </Button>
              )}
              
              {citation.doi && (
                <Button
                  variant="outline"
                  size="sm"
                  data-testid="button-citation-doi"
                  asChild
                >
                  <a 
                    href={`https://doi.org/${citation.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    DOI: {citation.doi}
                  </a>
                </Button>
              )}
              
              {citation.url && (
                <Button
                  variant="outline"
                  size="sm"
                  data-testid="button-citation-url"
                  asChild
                >
                  <a href={citation.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View Article
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}