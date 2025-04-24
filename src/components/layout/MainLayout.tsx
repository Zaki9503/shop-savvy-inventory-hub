
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";
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
              <SidebarTrigger className="mr-2" />
              <AdminHeaderUser />
            </div>
            {children || <Outlet />}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
