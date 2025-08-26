import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QuizProvider } from "./contexts/QuizContext";
import Upload from "./pages/Upload";
import Summary from "./pages/Summary";
import Quiz from "./pages/Quiz";
import Score from "./pages/Score";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <QuizProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Upload />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/score" element={<Score />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QuizProvider>
  </QueryClientProvider>
);

export default App;
