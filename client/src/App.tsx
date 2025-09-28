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
  
  // Simple test to see if React is working
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
      <h1>🚀 React App is Working!</h1>
      <p>Current URL: {window.location.href}</p>
      <p>Current Path: {window.location.pathname}</p>
      <p>Timestamp: {new Date().toISOString()}</p>
    </div>
  );
}

export default App;
