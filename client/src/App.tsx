import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer"; 
import Home from "@/pages/Home";
import Peptides from "@/pages/Peptides";
import PeptideDetail from "@/pages/PeptideDetail";
import Guides from "@/pages/Guides";
import GuideDetail from "@/pages/GuideDetail";
import NotFound from "@/pages/not-found";

// Red Banner Component
function RedBanner() {
  return (
    <div className="bg-red-600 text-white py-3 px-4 text-center relative">
      <div className="flex items-center justify-center gap-2">
        <span className="animate-pulse">🔥</span>
        <span className="font-semibold text-sm md:text-base">
          SPECIAL OFFER: Use code DOJO20 for 20% off all research peptides!
        </span>
        <span className="animate-pulse">🔥</span>
      </div>
      <div className="text-xs mt-1 opacity-90">
        Limited time offer - Premium research-grade peptides
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/peptides" component={Peptides} />
      <Route path="/peptide/:id" component={PeptideDetail} />
      <Route path="/research" component={Guides} />
      <Route path="/guide/:slug" component={GuideDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  console.log("🎯 App component rendering...");
  console.log("📍 Current path:", window.location.pathname);
  
  const handleLoginClick = () => {
    console.log('Login clicked - Begin Your Training');
    // todo: remove mock functionality - integrate with real auth
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col bg-background">
          <RedBanner />
          <Navigation onLoginClick={handleLoginClick} />
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
