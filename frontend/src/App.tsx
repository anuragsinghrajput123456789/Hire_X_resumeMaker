import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import FloatingChatbot from "./components/FloatingChatbot";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import { Loader2 } from "lucide-react";

// Synchronous loading for core landing & auth pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Lazy loading for heavy feature pages to optimize initial bundle size
const GeneratorPage = lazy(() => import("./pages/GeneratorPage"));
const AnalyzerPage = lazy(() => import("./pages/AnalyzerPage"));
const JobMatchPage = lazy(() => import("./pages/JobMatchPage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const ColdEmailPage = lazy(() => import("./pages/ColdEmailPage"));
const CoverLetterPage = lazy(() => import("./pages/CoverLetterPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const PageFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <Loader2 className="w-8 h-8 text-primary animate-spin" />
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);

    const handler = (event: PromiseRejectionEvent) => {
      console.error('[Unhandled Promise Rejection]', event.reason);
      event.preventDefault();
    };
    window.addEventListener('unhandledrejection', handler);
    return () => window.removeEventListener('unhandledrejection', handler);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className={`min-h-screen bg-mesh transition-all duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <Navbar />
              <main className="relative pt-32">
                <Suspense fallback={<PageFallback />}>
                  <Routes>
                    <Route path="/" element={<ErrorBoundary><Index /></ErrorBoundary>} />
                    <Route path="/login" element={<ErrorBoundary><Login /></ErrorBoundary>} />
                    <Route path="/register" element={<ErrorBoundary><Register /></ErrorBoundary>} />
                    <Route path="/generator" element={<ErrorBoundary><GeneratorPage /></ErrorBoundary>} />
                    <Route path="/analyzer" element={<ErrorBoundary><AnalyzerPage /></ErrorBoundary>} />
                    <Route path="/job-match" element={<ErrorBoundary><JobMatchPage /></ErrorBoundary>} />
                    <Route path="/chat" element={<ErrorBoundary><ChatPage /></ErrorBoundary>} />
                    <Route path="/cold-email" element={<ErrorBoundary><ColdEmailPage /></ErrorBoundary>} />
                    <Route path="/cover-letter" element={<ErrorBoundary><CoverLetterPage /></ErrorBoundary>} />
                    <Route path="*" element={<ErrorBoundary><NotFound /></ErrorBoundary>} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
              <FloatingChatbot />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
