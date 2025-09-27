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
    <section className="py-16 bg-muted/30">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Begin Your Training</CardTitle>
            <p className="text-muted-foreground">
              Receive new teachings from the dojo and advance your peptide mastery.
            </p>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="py-8">
                <div className="text-4xl mb-2">🎋</div>
                <p className="text-primary font-medium">Welcome to the dojo!</p>
                <p className="text-muted-foreground text-sm">
                  Your training journey begins now.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Enter your email to join the dojo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="input-newsletter-email"
                  className="text-center"
                />
                <Button 
                  type="submit" 
                  className="w-full font-medium"
                  data-testid="button-begin-training"
                >
                  Begin Your Training
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}