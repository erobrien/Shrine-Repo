import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface GlossaryEntry {
  term: string;
  definition: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

export default function SacredScrolls() {
  const [searchTerm, setSearchTerm] = useState("");

  // todo: remove mock functionality - replace with real data
  const glossaryEntries: GlossaryEntry[] = [
    {
      term: "BPC-157",
      definition: "Body Protection Compound-157 is a synthetic peptide derived from gastric juice protein. It promotes healing of muscles, tendons, and ligaments while supporting gut health and reducing inflammation.",
      category: "recovery",
      difficulty: "Intermediate"
    },
    {
      term: "GLP-1",
      definition: "Glucagon-Like Peptide-1 is a hormone that regulates blood sugar levels and slows gastric emptying. Used for weight management and metabolic health.",
      category: "weight-loss", 
      difficulty: "Beginner"
    },
    {
      term: "IGF-1 LR3",
      definition: "Insulin-like Growth Factor-1 Long Arg3 is a synthetic analog of IGF-1 with extended half-life. Promotes muscle growth and cellular regeneration.",
      category: "performance",
      difficulty: "Advanced"
    },
    {
      term: "Thymosin Beta-4",
      definition: "A naturally occurring peptide that plays a crucial role in wound healing, tissue repair, and regeneration. Supports cardiovascular health and immune function.",
      category: "wellness",
      difficulty: "Intermediate"
    },
    {
      term: "NAD+",
      definition: "Nicotinamide Adenine Dinucleotide is a coenzyme essential for cellular energy production and DNA repair. Supports healthy aging and cognitive function.",
      category: "longevity",
      difficulty: "Beginner"
    }
  ];

  const filteredEntries = glossaryEntries.filter(entry =>
    entry.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const difficultyColors = {
    "Beginner": "bg-green-100 text-green-800",
    "Intermediate": "bg-yellow-100 text-yellow-800",
    "Advanced": "bg-red-100 text-red-800"
  };

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Sacred Scrolls</h2>
          <p className="text-muted-foreground text-lg">
            Ancient wisdom meets modern science. Expand your peptide knowledge.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📜 Peptide Glossary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search the sacred scrolls..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-6"
              data-testid="input-search-scrolls"
            />

            <Accordion type="single" collapsible className="space-y-2">
              {filteredEntries.map((entry, index) => (
                <AccordionItem 
                  key={entry.term} 
                  value={`item-${index}`}
                  className="border rounded-lg px-4"
                >
                  <AccordionTrigger 
                    className="hover:no-underline py-4"
                    data-testid={`trigger-${entry.term.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  >
                    <div className="flex items-center justify-between w-full mr-4">
                      <span className="font-semibold text-left">{entry.term}</span>
                      <div className="flex gap-2">
                        <Badge 
                          variant="secondary"
                          className={`${difficultyColors[entry.difficulty]} text-xs`}
                        >
                          {entry.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {entry.category.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-muted-foreground">
                    {entry.definition}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {filteredEntries.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <div className="text-4xl mb-2">📜</div>
                <p>No scrolls found matching your search.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <Button 
            variant="outline"
            onClick={() => console.log('Claim Your Scroll clicked')}
            data-testid="button-claim-scroll"
          >
            Claim Your Scroll
          </Button>
        </div>
      </div>
    </section>
  );
}