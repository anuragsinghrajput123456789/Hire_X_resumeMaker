import { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, MotionConfig } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import FloatingChatbot from "./components/FloatingChatbot";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import PageTransition from "./components/PageTransition";
import ScrollToTopButton from "./components/ScrollToTopButton";
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
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const PageFallback = () => (
  <div className="min-h-[65vh] flex flex-col items-center justify-center gap-3">
    <div className="relative flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
      <Loader2 className="w-5 h-5 text-[#00F2FE] absolute animate-pulse" />
    </div>
    <span className="text-xs font-semibold text-slate-400 font-mono tracking-wider animate-pulse">Loading Workspace...</span>
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

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<ErrorBoundary><PageTransition><Index /></PageTransition></ErrorBoundary>} />
        <Route path="/login" element={<ErrorBoundary><PageTransition><Login /></PageTransition></ErrorBoundary>} />
        <Route path="/register" element={<ErrorBoundary><PageTransition><Register /></PageTransition></ErrorBoundary>} />
        <Route path="/generator" element={<ErrorBoundary><PageTransition><GeneratorPage /></PageTransition></ErrorBoundary>} />
        <Route path="/analyzer" element={<ErrorBoundary><PageTransition><AnalyzerPage /></PageTransition></ErrorBoundary>} />
        <Route path="/job-match" element={<ErrorBoundary><PageTransition><JobMatchPage /></PageTransition></ErrorBoundary>} />
        <Route path="/chat" element={<ErrorBoundary><PageTransition><ChatPage /></PageTransition></ErrorBoundary>} />
        <Route path="/cold-email" element={<ErrorBoundary><PageTransition><ColdEmailPage /></PageTransition></ErrorBoundary>} />
        <Route path="/cover-letter" element={<ErrorBoundary><PageTransition><CoverLetterPage /></PageTransition></ErrorBoundary>} />
        <Route path="/profile" element={<ErrorBoundary><PageTransition><ProfilePage /></PageTransition></ErrorBoundary>} />
        <Route path="*" element={<ErrorBoundary><PageTransition><NotFound /></PageTransition></ErrorBoundary>} />
      </Routes>
    </AnimatePresence>
  );
};

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
      <MotionConfig reducedMotion="never">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className={`min-h-screen bg-mesh transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <Navbar />
                <main className="relative pt-32">
                  <Suspense fallback={<PageFallback />}>
                    <AnimatedRoutes />
                  </Suspense>
                </main>
                <Footer />
                <FloatingChatbot />
                <ScrollToTopButton />
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </MotionConfig>
    </QueryClientProvider>
  );
};

export default App;
