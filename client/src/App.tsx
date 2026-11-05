import { useMemo } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
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
import ProfilesLanding from "@/pages/profiles-landing";
import Login from "@/pages/auth/login";
import Onboarding from "@/pages/auth/onboarding";
import Dashboard from "@/pages/dashboard";
import PublicProfile from "@/pages/public-profile";
import { LangProvider } from "@/lib/i18n";
import { AuthProvider } from "@/lib/auth";
import { MobileLangSwitcher } from "@/components/ui/mobile-lang-switcher";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { RESERVED_USERNAMES } from "@shared/saas-schema";

function getSubdomain(): string | null {
  if (typeof window === "undefined") return null;
  const hostname = window.location.hostname;

  // Localhost root or IP
  if (hostname === "localhost" || hostname === "127.0.0.1") return null;

  // Local subdomains (e.g. salah.localhost:5000)
  if (hostname.endsWith(".localhost")) {
    const sub = hostname.split(".")[0];
    if (sub && !(RESERVED_USERNAMES as readonly string[]).includes(sub.toLowerCase())) {
      return sub.toLowerCase();
    }
  }

  // Production domains (e.g. salah.novawebdv.com or salah.novawebdv.vercel.app)
  const parts = hostname.split(".");
  if (parts.length >= 3) {
    const sub = parts[0];
    if (sub && !(RESERVED_USERNAMES as readonly string[]).includes(sub.toLowerCase())) {
      return sub.toLowerCase();
    }
  }

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/profiles" component={ProfilesLanding} />
      <Route path="/profile-saas" component={ProfilesLanding} />
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/register" component={Login} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/p/:username" component={PublicProfile} />
      <Route path="/u/:username" component={PublicProfile} />
      <Route path="/projects" component={Projects} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function MainLayout() {
  const [location] = useLocation();

  // Paths that should not have agency navigation chrome (personal profiles, onboarding, dashboard)
  const isDedicatedPage = useMemo(() => {
    return (
      location.startsWith("/p/") ||
      location.startsWith("/u/") ||
      location.startsWith("/dashboard") ||
      location.startsWith("/onboarding")
    );
  }, [location]);

  return (
    <>
      {!isDedicatedPage && <Navbar />}
      <div className={!isDedicatedPage ? "pb-24 md:pb-0" : ""}>
        <Router />
      </div>
      {!isDedicatedPage && <WhatsAppButton />}
      {!isDedicatedPage && <MobileLangSwitcher />}
      {!isDedicatedPage && <BottomNav />}
    </>
  );
}

function App() {
  const subdomain = useMemo(() => getSubdomain(), []);

  return (
    <HelmetProvider>
      <LangProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <Toaster />
              {subdomain ? (
                <PublicProfile usernameParam={subdomain} />
              ) : (
                <MainLayout />
              )}
            </TooltipProvider>
          </QueryClientProvider>
        </AuthProvider>
      </LangProvider>
    </HelmetProvider>
  );
}

export default App;
