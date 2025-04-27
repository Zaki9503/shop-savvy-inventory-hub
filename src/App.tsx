import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { DataProvider } from "@/lib/data-context";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import MainLayout from "@/components/layout/MainLayout";
import { AuthLayout } from "@/components/layout/AuthLayout";
import DashboardPage from "@/pages/DashboardPage";
import ProductsPage from "@/pages/ProductsPage";
import SalesPage from "@/pages/SalesPage";
import NotFound from "./pages/NotFound";
import AdminProfilePage from "@/pages/AdminProfilePage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import StoresPage from "@/pages/StoresPage";
import { SuperAdminRegister } from '@/components/auth/SuperAdminRegister';
import { SubAdminRegister } from '@/components/auth/SubAdminRegister';
import { LoginForm } from '@/components/auth/LoginForm';
import { SuperAdminDashboard } from '@/components/dashboard/SuperAdminDashboard';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { StoreDashboard } from '@/components/dashboard/StoreDashboard';
import { useEffect, useState } from 'react';

const queryClient = new QueryClient();

interface User {
  id: string;
  username: string;
  role: 'super_admin' | 'sub_admin' | 'admin' | 'manager';
  storeId?: string;
  shopId?: string;
}

function PrivateRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
}

// Wrap routes with auth check
const AppRoutes = () => {
  const { user, isAuthenticated } = useAuth();
  const [userType, setUserType] = useState<'super' | 'sub' | 'admin' | null>(null);

  useEffect(() => {
    if (user) {
      // Determine user type based on role
      if (user.role === 'super_admin' || user.role === 'admin') {
        setUserType('super');
      } else if (user.role === 'sub_admin' || user.role === 'manager') {
        setUserType('sub');
      }
    } else {
      setUserType(null);
    }
  }, [user]);

  // For debugging
  console.log("Auth state:", { isAuthenticated, userType, userRole: user?.role });

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginForm />
          } />
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <SuperAdminRegister />
          } />
          <Route path="/register-sub-admin" element={<SubAdminRegister />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <DashboardPage /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/stores"
            element={
              isAuthenticated && (userType === 'super' || userType === 'admin') ? (
                <StoresPage />
              ) : (
                <Navigate to={isAuthenticated ? "/unauthorized" : "/login"} replace />
              )
            }
          />
          <Route
            path="/products"
            element={
              isAuthenticated ? <ProductsPage /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/sales"
            element={
              isAuthenticated ? <SalesPage /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/admin-profile"
            element={
              isAuthenticated ? <AdminProfilePage /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/analytics"
            element={
              isAuthenticated ? <AnalyticsPage /> : <Navigate to="/login" replace />
            }
          />
          <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <DataProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </TooltipProvider>
        </AuthProvider>
      </DataProvider>
    </QueryClientProvider>
  );
};

export default App;
