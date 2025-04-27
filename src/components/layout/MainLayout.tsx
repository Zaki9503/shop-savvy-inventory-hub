import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";
import AdminHeaderUser from "./AdminHeaderUser";
import AppSidebar from "./AppSidebar";
import { useAuth } from "@/lib/auth-context";
import { useData } from "@/lib/data-context";
import { Store } from "lucide-react";

export const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { logout } = useAuth();
  const { activeShopId, getShop } = useData();
  const navigate = useNavigate();
  
  // Get active shop if one is selected
  const activeShop = activeShopId ? getShop(activeShopId) : null;
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50 font-sans">
        <AppSidebar onLogout={handleLogout} />
        <div className="flex-1">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="mr-2" />
                {activeShop ? (
                  <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-md shadow-sm">
                    <Store className="h-5 w-5" />
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-600">Store:</span>
                      <span className="font-semibold text-lg">{activeShop.name}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2">
                    <span className="font-medium text-gray-400">No store selected</span>
                  </div>
                )}
              </div>
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
