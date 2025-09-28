import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

interface ResearchFAQProps {
  title?: string;
  faqs: FAQItem[];
  defaultOpen?: string[]; // IDs of FAQs to open by default
}

export default function ResearchFAQ({ title = "Frequently Asked Questions", faqs, defaultOpen = [] }: ResearchFAQProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(defaultOpen));

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  // Generate Schema.org FAQPage structured data
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      {/* FAQ Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <Card className="w-full" data-testid="research-faq-container">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <HelpCircle className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-semibold" data-testid="text-faq-title">
              {title}
            </h3>
          </div>

          <div className="space-y-3" data-testid="list-faq-items">
            {faqs.map((faq) => (
              <Collapsible
                key={faq.id}
                open={openItems.has(faq.id)}
                onOpenChange={() => toggleItem(faq.id)}
              >
                <CollapsibleTrigger 
                  className="w-full group"
                  data-testid={`button-faq-toggle-${faq.id}`}
                >
                  <div className="flex items-center justify-between w-full p-4 rounded-lg border hover-elevate transition-all text-left">
                    <h4 className="font-medium text-sm leading-relaxed pr-4" data-testid={`text-faq-question-${faq.id}`}>
                      {faq.question}
                    </h4>
                    <ChevronDown 
                      className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ${
                        openItems.has(faq.id) ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="px-4 py-3 text-sm text-muted-foreground leading-relaxed" data-testid={`text-faq-answer-${faq.id}`}>
                    {faq.answer}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}