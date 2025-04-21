
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import AdminHeaderUser from "./AdminHeaderUser";
import AppSidebar from "./AppSidebar";

export const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50 font-sans">
        <AppSidebar onLogout={handleLogout} />
        <div className="flex-1">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <SidebarTrigger className="mr-2" />
                <div className="relative">
                  {/* The search field */}
                  <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 w-full sm:w-60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              <AdminHeaderUser />
            </div>
            {/* Render outlet */}
            {children || <Outlet />}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
