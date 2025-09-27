import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer"; 
import ThemeToggle from "@/components/ThemeToggle";
import Home from "@/pages/Home";
import Peptides from "@/pages/Peptides";
import PeptideDetail from "@/pages/PeptideDetail";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/peptides" component={Peptides} />
      <Route path="/peptide/:id" component={PeptideDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const handleLoginClick = () => {
    console.log('Login clicked - Begin Your Training');
    // todo: remove mock functionality - integrate with real auth
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col bg-background">
          <Navigation onLoginClick={handleLoginClick} />
          <div className="fixed top-4 right-4 z-[150]">
            <ThemeToggle />
          </div>
          <main className="flex-1">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
