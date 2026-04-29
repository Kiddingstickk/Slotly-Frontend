import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import BookingPage from "./pages/BookingPage";
import LoginPage from "./pages/Login";
import BusinessRegistrationForm  from "./pages/BusinessRegisterPage";
import RegisterPage from "./pages/SignupPage"; 
import AvailabilityPage from "./pages/Availbilty";
import CustomerDashboard from "./pages/customerDashbaord";
import CustomerLoginPage from "./pages/customerLoginPage";
import CustomerRegisterPage from "./pages/customerRegistrationPage";
import EmployeeRegistrationPage from "./pages/EmployeeRegisterPage";


{/* import DashboardLayout from "./components/dashboard/DashboardLayout.tsx";
import Overview from "./pages/dashboard/Overview.tsx";
import Bookings from "./pages/dashboard/Bookings.tsx";
import DashCalendar from "./pages/dashboard/Calendar.tsx";
import Revenue from "./pages/dashboard/Revenue.tsx";
import Clients from "./pages/dashboard/Clients.tsx";
import DashServices from "./pages/dashboard/Services.tsx";
import Reviews from "./pages/dashboard/Reviews.tsx";
import Marketing from "./pages/dashboard/Marketing.tsx";
import DashSettings from "./pages/dashboard/Settings.tsx"; */}



const queryClient = new QueryClient();

const DashboardWrapper = () => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    // Redirect to /login instead of just rendering the component
    return <Navigate to="/auth" replace />;
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
          <Route path="/" element={<DashboardWrapper />} />
          <Route path="/auth" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/business/register" element={<BusinessRegistrationForm />} />
          <Route path="/availability/:businessId" element={<AvailabilityPage />} />
          <Route path="/dashboard" element={<DashboardWrapper />} />
          <Route path="/:businessId" element={<Index />} />
          <Route path="/:businessId/book" element={<BookingPage />} />

          <Route path="/customer/login" element={<CustomerLoginPage />} />
          <Route path="/customer/register" element={<CustomerRegisterPage />} />
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />


          <Route path="/employees/:businessId" element={<EmployeeRegistrationPage />} />


          <></>

          {/*<Route path="/new-dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="calendar" element={<DashCalendar />} />
            <Route path="revenue" element={<Revenue />} />
            <Route path="clients" element={<Clients />} />
            <Route path="services" element={<DashServices />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="marketing" element={<Marketing />} />
            <Route path="settings" element={<DashSettings />} />
          </Route>  */}


          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;