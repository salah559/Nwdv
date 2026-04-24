import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BottomNav } from "@/components/bottom-nav";
import { Navbar } from "@/components/ui/navbar";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Projects from "@/pages/projects";
import Contact from "@/pages/contact";
import About from "@/pages/about";
import Admin from "@/pages/admin";
import Pricing from "@/pages/pricing";
import { LangProvider } from "@/lib/i18n";
import { MobileHeader } from "@/components/ui/mobile-header";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/projects" component={Projects} />
      <Route path="/about" component={About} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/contact" component={Contact} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <LangProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Navbar />
          <MobileHeader />
          <div className="pb-24 pt-20 md:pt-0 md:pb-0">
            <Router />
          </div>
          <WhatsAppButton />
          <BottomNav />
        </TooltipProvider>
      </QueryClientProvider>
    </LangProvider>
  );
}

export default App;
