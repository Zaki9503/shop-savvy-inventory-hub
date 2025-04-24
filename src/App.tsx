import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/lib/auth-context";
import { DataProvider } from "@/lib/data-context";
import MainLayout from "@/components/layout/MainLayout";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import ProductsPage from "@/pages/ProductsPage";
import SalesPage from "@/pages/SalesPage";
import NotFound from "./pages/NotFound";
import ShopList from "@/components/shops/ShopList"
import AdminProfilePage from "@/pages/AdminProfilePage";
import AnalyticsPage from "@/pages/AnalyticsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              
              <Route element={<MainLayout />}>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/sales" element={<SalesPage />} />
                <Route path="/admin-profile" element={<AdminProfilePage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                {/* These routes will be implemented later */}
                {/* Shops Section */}
                <Route path="/shops" element={<ShopList />} />
                <Route path="/customers" element={<div className="p-8">Customers page coming soon</div>} />
                <Route path="/users" element={<div className="p-8">Users page coming soon</div>} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
