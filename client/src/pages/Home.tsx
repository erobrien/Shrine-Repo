import HeroSection from "@/components/HeroSection";
import ExploreGrid from "@/components/ExploreGrid";
import TopicCard from "@/components/TopicCard";
import ResearchGlossary from "@/components/SacredScrolls";
import NewsletterSignup from "@/components/NewsletterSignup";

export default function Home() {
  // todo: remove mock functionality - replace with real featured topics data
  const featuredTopics = [
    {
      title: "BPC-157",
      summary: "Body Protection Compound-157 shows promising results for tissue repair and gastrointestinal health in animal studies. Human clinical data remains limited.",
      category: "peptide" as const,
      evidenceGrade: "B" as const,
      lastUpdated: "2 days ago",
      studyCount: 47,
      href: "/peptides/bpc-157"
    },
    {
      title: "GLP-1 Receptor Agonists",
      summary: "Well-established clinical evidence supports GLP-1 agonists for type 2 diabetes management and weight loss. FDA-approved options available.",
      category: "peptide" as const,
      evidenceGrade: "A" as const,
      lastUpdated: "1 week ago", 
      studyCount: 89,
      href: "/peptides/glp-1"
    },
    {
      title: "Muscle Recovery Protocols", 
      summary: "Various peptides show potential for accelerating muscle recovery after exercise, though human studies are limited and protocols vary.",
      category: "condition" as const,
      evidenceGrade: "C" as const,
      lastUpdated: "3 days ago",
      studyCount: 23,
      href: "/conditions/muscle-recovery"
    }
  ];

  return (
    <div className="min-h-screen">
      <HeroSection />
      <ExploreGrid />

      {/* Featured Topics Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Research</h2>
            <p className="font-medium text-muted-foreground text-lg">
              Recently updated topics with the latest evidence and analysis.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTopics.map((topic) => (
              <TopicCard
                key={topic.title}
                {...topic}
                onView={() => console.log(`${topic.title} viewed`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Latest Updates</h2>
            <p className="font-medium text-muted-foreground text-lg">
              New research summaries and updated evidence grades published daily.
            </p>
          </div>
          
          <div className="space-y-4">
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
              <div key={index} className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover-elevate">
                <div>
                  <h3 className="font-medium text-foreground">{update.title}</h3>
                  <p className="text-sm text-muted-foreground">{update.date}</p>
                </div>
                <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
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
  );
}