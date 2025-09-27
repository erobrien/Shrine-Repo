import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setIsSubmitted(true);
    setEmail("");
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-muted/30">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="text-center">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl font-bold">Stay Updated</CardTitle>
            <p className="font-medium text-muted-foreground text-sm sm:text-base mt-1">
              Get the latest research summaries and evidence-based peptide insights.
            </p>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            {isSubmitted ? (
              <div className="py-6 sm:py-8">
                <div className="text-3xl sm:text-4xl mb-2">✓</div>
                <p className="text-primary font-medium text-base sm:text-lg">Thank you for subscribing!</p>
                <p className="font-light text-muted-foreground text-xs sm:text-sm mt-1">
                  You'll receive the latest research updates.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="input-newsletter-email"
                  className="text-center text-sm sm:text-base min-h-[44px]"
                />
                <Button 
                  type="submit" 
                  className="w-full font-medium min-h-[44px]"
                  data-testid="button-subscribe"
                >
                  Subscribe to Updates
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}