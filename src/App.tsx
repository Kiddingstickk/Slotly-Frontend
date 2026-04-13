import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import BookingPage from "./pages/BookingPage";
import LoginPage from "./pages/SigninPage";
import BusinessRegistrationForm  from "./pages/BusinessRegisterPage";
import RegisterPage from "./pages/SignupPage"; 
import AvailabilityPage from "./pages/Availbilty";

const queryClient = new QueryClient();

const DashboardWrapper = () => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    return <LoginPage />;
  }
  return <Dashboard userId={userId} />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/business/register" element={<BusinessRegistrationForm />} />
          <Route path="/availability/:businessId" element={<AvailabilityPage />} />
          <Route path="/dashboard" element={<DashboardWrapper />} />
          <Route path="/:businessId" element={<Index />} />
          <Route path="/:businessId/book" element={<BookingPage />} />
          <></>

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;