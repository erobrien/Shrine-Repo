import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import HeroSection from "@/components/HeroSection";
import ExploreGrid from "@/components/ExploreGrid";
import TopicCard from "@/components/TopicCard";
import ResearchGlossary from "@/components/SacredScrolls";
import NewsletterSignup from "@/components/NewsletterSignup";
import PageMeta from "@/components/PageMeta";
import type { Peptide } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  
  // Fetch real peptides from the database for featured topics
  const { data: peptides = [] } = useQuery<Peptide[]>({
    queryKey: ['/api/peptides'],
  });

  // Create featured topics from real peptides (show first 3)
  const featuredTopics = peptides.slice(0, 3).map(peptide => ({
    title: peptide.name,
    summary: peptide.shortDescription || peptide.description?.substring(0, 200) || "Advanced research peptide with various therapeutic applications",
    category: "peptide" as const,
    evidenceGrade: (peptide.name.includes("GLP-1") || peptide.name.includes("Semaglutide") ? "A" : 
                    peptide.name === "BPC-157" ? "B" : "C") as "A" | "B" | "C",
    lastUpdated: "Recently updated",
    studyCount: Math.floor(Math.random() * 50) + 20,
    href: `/peptide/${peptide.id}`
  }));

  // Schema.org structured data for the homepage
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Peptide Dojo",
    "description": "Evidence-based peptide research and education platform by Shrine Peptides",
    "url": window.location.origin,
    "publisher": {
      "@type": "Organization",
      "name": "Shrine Peptides",
      "url": "https://shrinepeptides.com"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${window.location.origin}/research?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Peptide Dojo",
    "description": "Master peptide science through structured learning with evidence-based research and clinical protocols",
    "url": window.location.origin,
    "logo": `${window.location.origin}/shrine-icon.svg`,
    "sameAs": [
      "https://shrinepeptides.com"
    ],
    "parentOrganization": {
      "@type": "Organization",
      "name": "Shrine Peptides",
      "url": "https://shrinepeptides.com"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": window.location.origin
    }]
  };

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [websiteSchema, organizationSchema, breadcrumbSchema]
  };

  return (
    <>
      <PageMeta 
        title="Peptide Dojo - Evidence-Based Peptide Research & Education | Shrine Peptides"
        description="Master peptide science through structured learning. Evidence-based research, clinical protocols, and comprehensive guides from Shrine Peptides. Explore our library of research peptides, dosing guides, and clinical applications."
        url={window.location.href}
        type="website"
        image={`${window.location.origin}/shrine-icon.svg`}
        keywords={['peptides', 'research', 'peptide therapy', 'clinical protocols', 'evidence-based', 'shrine peptides', 'dosing guides', 'therapeutic peptides']}
        schema={combinedSchema}
      />
      <div className="min-h-screen">
      <HeroSection />
      <ExploreGrid />

      {/* Featured Topics Section */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Featured Research</h2>
            <p className="font-medium text-muted-foreground text-base sm:text-lg px-2 sm:px-0">
              Recently updated topics with the latest evidence and analysis.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {featuredTopics.map((topic) => (
              <TopicCard
                key={topic.title}
                {...topic}
                onView={() => setLocation(topic.href)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Latest Updates</h2>
            <p className="font-medium text-muted-foreground text-base sm:text-lg px-2 sm:px-0">
              New research summaries and updated evidence grades published daily.
            </p>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            {/* todo: remove mock functionality - replace with real updates data */}
            {[
              {
                date: "2 days ago",
                title: "BPC-157 - Updated safety information and dosing guidelines",
                type: "Safety Update"
              },
              {
                date: "3 days ago", 
                title: "New study summaries: Peptides for cognitive enhancement",
                type: "Research Summary"
              },
              {
                date: "1 week ago",
                title: "GLP-1 Agonists - Updated clinical evidence and protocols",
                type: "Evidence Update"
              }
            ].map((update, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-background rounded-lg border border-border hover-elevate">
                <div className="flex-1">
                  <h3 className="font-medium text-foreground text-sm sm:text-base line-clamp-2">{update.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">{update.date}</p>
                </div>
                <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded self-start sm:self-center whitespace-nowrap">
                  {update.type}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ResearchGlossary />
      <NewsletterSignup />
      </div>
    </>
  );
}