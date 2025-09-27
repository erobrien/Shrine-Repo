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

  const evidenceColors = {
    "High": "bg-green-100 text-green-800",
    "Moderate": "bg-yellow-100 text-yellow-800",
    "Limited": "bg-red-100 text-red-800"
  };

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Research Glossary</h2>
          <p className="font-medium text-muted-foreground text-lg">
            Comprehensive definitions of peptides, compounds, and research terminology.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Peptide & Research Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search terms and definitions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-6"
              data-testid="input-search-glossary"
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
                          className={`${evidenceColors[entry.evidenceLevel]} text-xs border`}
                        >
                          {entry.evidenceLevel} Evidence
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {entry.category}
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 font-light text-muted-foreground">
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