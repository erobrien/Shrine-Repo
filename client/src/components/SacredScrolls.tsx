import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  evidenceLevel: "High" | "Moderate" | "Limited";
}

export default function ResearchGlossary() {
  const [searchTerm, setSearchTerm] = useState("");

  // todo: remove mock functionality - replace with real data
  const glossaryEntries: GlossaryEntry[] = [
    {
      term: "BPC-157",
      definition: "Body Protection Compound-157 is a synthetic peptide derived from gastric juice protein. Research suggests potential benefits for tissue repair, wound healing, and gastrointestinal protection, though human clinical data is limited.",
      category: "Healing Peptides",
      evidenceLevel: "Moderate"
    },
    {
      term: "GLP-1 Agonists",
      definition: "Glucagon-Like Peptide-1 receptor agonists regulate blood glucose and gastric emptying. Well-established clinical evidence supports their use for type 2 diabetes and weight management.",
      category: "Metabolic Health", 
      evidenceLevel: "High"
    },
    {
      term: "IGF-1 LR3",
      definition: "Insulin-like Growth Factor-1 Long Arg3 is a synthetic analog with extended half-life. Limited human research exists on its effects for muscle growth and recovery.",
      category: "Growth Factors",
      evidenceLevel: "Limited"
    },
    {
      term: "Thymosin Beta-4",
      definition: "A naturally occurring peptide involved in wound healing and tissue repair. Animal studies show promise, but human clinical evidence remains limited.",
      category: "Recovery Peptides",
      evidenceLevel: "Moderate"
    },
    {
      term: "NAD+ Precursors",
      definition: "Compounds that increase cellular NAD+ levels, supporting energy metabolism and DNA repair. Research on aging and longevity benefits is ongoing.",
      category: "Longevity Research",
      evidenceLevel: "Moderate"
    }
  ];

  const filteredEntries = glossaryEntries.filter(entry =>
    entry.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Use semantic classes that adapt to dark mode
  const getEvidenceClass = (level: string) => {
    switch(level) {
      case "High":
        return "bg-primary/10 text-primary border-primary/20";
      case "Moderate":
        return "bg-accent text-accent-foreground border-accent/20";
      case "Limited":
        return "bg-muted text-muted-foreground border-muted";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  return (
    <section className="py-8 sm:py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Research Glossary</h2>
          <p className="font-medium text-muted-foreground text-base sm:text-lg px-2 sm:px-0">
            Comprehensive definitions of peptides, compounds, and research terminology.
          </p>
        </div>

        <Card>
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl">Peptide & Research Terms</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <Input
              placeholder="Search terms and definitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4 sm:mb-6"
              data-testid="input-search-glossary"
            />

            <Accordion type="single" collapsible className="space-y-2">
              {filteredEntries.map((entry, index) => (
                <AccordionItem 
                  key={entry.term} 
                  value={`item-${index}`}
                  className="border rounded-lg px-3 sm:px-4"
                >
                  <AccordionTrigger 
                    className="hover:no-underline py-3 sm:py-4 min-h-[44px]"
                    data-testid={`trigger-${entry.term.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full mr-4 gap-2">
                      <span className="font-semibold text-left text-sm sm:text-base">{entry.term}</span>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        <Badge 
                          variant="outline"
                          className={`${getEvidenceClass(entry.evidenceLevel)} text-xs`}
                        >
                          <span className="hidden sm:inline">{entry.evidenceLevel} </span>Evidence
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {entry.category}
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-3 sm:pb-4 font-light text-muted-foreground text-sm sm:text-base">
                    {entry.definition}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {filteredEntries.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <p>No terms found matching your search.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}