import React, { useState, useEffect } from "react";
import LandingView from "./components/LandingView";
import LoginView from "./components/LoginView";
import DashboardView from "./components/DashboardView";
import { supabase } from "./lib/supabase";

type ViewState = "landing" | "login" | "register" | "forgot" | "dashboard";

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>("landing");
  const [user, setUser] = useState<any>(null);

  // Sync Supabase authentication state on mount
  useEffect(() => {
    // Recover session in case OAuth callback already fired before subscription
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setCurrentView("dashboard");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        // Force routing to dashboard (covers OAuth callback from Google, etc.)
        setCurrentView("dashboard");
      } else {
        setUser(null);
        // Fallback to landing if logged out while on dashboard
        setCurrentView((prev) => prev === "dashboard" ? "landing" : prev);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Router dispatcher
  const handleNavigate = (view: ViewState) => {
    setCurrentView(view);
    // Smoothly scroll back to the top of the viewport when changing views
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoginSuccess = () => {
    setCurrentView("dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div id="app-root" className="min-h-screen bg-bg-primary text-text-primary">
      {currentView === "landing" && (
        <LandingView onNavigate={handleNavigate} />
      )}

      {(currentView === "login" || currentView === "register" || currentView === "forgot") && (
        <LoginView 
          initialMode={currentView === "register" ? "register" : currentView === "forgot" ? "forgot" : "login"} 
          onNavigate={handleNavigate}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {currentView === "dashboard" && (
        <DashboardView onNavigate={handleNavigate} user={user} />
      )}
    </div>
  );
}
