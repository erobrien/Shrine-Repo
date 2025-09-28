import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  User, 
  GraduationCap, 
  Building, 
  Mail, 
  ExternalLink,
  FileText
} from "lucide-react";
import type { Author } from "@shared/schema";

interface AuthorCardProps {
  author: Author;
  variant?: "full" | "compact";
}

export default function AuthorCard({ author, variant = "compact" }: AuthorCardProps) {
  const initials = author.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-3" data-testid={`author-compact-${author.id}`}>
        <Avatar className="w-8 h-8">
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium text-sm" data-testid="text-author-name">
            {author.name}
          </span>
          {author.credentials && author.credentials.length > 0 && (
            <span className="text-xs text-muted-foreground" data-testid="text-author-primary-credential">
              {author.credentials[0]}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full" data-testid={`author-card-${author.id}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="text-lg font-semibold">{initials}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-xl font-semibold" data-testid="text-author-name">
                {author.name}
              </h3>
              {author.affiliation && (
                <div className="flex items-center gap-1 text-muted-foreground mt-1">
                  <Building className="w-4 h-4" />
                  <span className="text-sm" data-testid="text-author-affiliation">
                    {author.affiliation}
                  </span>
                </div>
              )}
            </div>

            {author.bio && (
              <p className="text-sm text-muted-foreground leading-relaxed" data-testid="text-author-bio">
                {author.bio}
              </p>
            )}

            {author.credentials && author.credentials.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-sm font-medium">
                  <GraduationCap className="w-4 h-4" />
                  Credentials
                </div>
                <div className="flex flex-wrap gap-1" data-testid="list-author-credentials">
                  {author.credentials.map((credential, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {credential}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {author.expertise && author.expertise.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-sm font-medium">
                  <FileText className="w-4 h-4" />
                  Expertise
                </div>
                <div className="flex flex-wrap gap-1" data-testid="list-author-expertise">
                  {author.expertise.map((area, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {author.publications && (
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-sm font-medium">
                  <FileText className="w-4 h-4" />
                  Publications
                </div>
                <p className="text-xs text-muted-foreground" data-testid="text-author-publications">
                  {author.publications}
                </p>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              {author.contactEmail && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  data-testid="button-author-email"
                  asChild
                >
                  <a href={`mailto:${author.contactEmail}`}>
                    <Mail className="w-3 h-3 mr-1" />
                    Contact
                  </a>
                </Button>
              )}
              
              {author.linkedinUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  data-testid="button-author-linkedin"
                  asChild
                >
                  <a href={author.linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    LinkedIn
                  </a>
                </Button>
              )}
              
              {author.researchGateUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  data-testid="button-author-researchgate"
                  asChild
                >
                  <a href={author.researchGateUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    ResearchGate
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