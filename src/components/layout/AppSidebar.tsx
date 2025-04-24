import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { 
  Home, 
  Package, 
  ShoppingBag, 
  Store, 
  LogOut,
  User,
  Bell,
  IndianRupee
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  onLogout: () => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ onLogout }) => {
  const { hasPermission } = useAuth();
  const isAdmin = hasPermission(["admin"]);
  const isManager = hasPermission(["admin", "manager"]);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 pl-4 py-4">
          <IndianRupee className="h-7 w-7 text-white" />
          <h1 className="text-xl font-bold text-white">ShopSavvy</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink 
                to="/admin-profile" 
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-3 hover:bg-sidebar-accent rounded-md transition-colors ${
                    isActive ? "bg-sidebar-accent text-white" : "text-sidebar-foreground"
                  }`
                }
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-3 hover:bg-sidebar-accent rounded-md transition-colors ${
                    isActive ? "bg-sidebar-accent text-white" : "text-sidebar-foreground"
                  }`
                }
              >
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink 
                to="/products" 
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-3 hover:bg-sidebar-accent rounded-md transition-colors ${
                    isActive ? "bg-sidebar-accent text-white" : "text-sidebar-foreground"
                  }`
                }
              >
                <Package className="h-5 w-5" />
                <span>Products</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink 
                to="/sales" 
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-3 hover:bg-sidebar-accent rounded-md transition-colors ${
                    isActive ? "bg-sidebar-accent text-white" : "text-sidebar-foreground"
                  }`
                }
              >
                <ShoppingBag className="h-5 w-5" />
                <span>Sales</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {isManager && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink 
                  to="/shops" 
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-4 py-3 hover:bg-sidebar-accent rounded-md transition-colors ${
                      isActive ? "bg-sidebar-accent text-white" : "text-sidebar-foreground"
                    }`
                  }
                >
                  <Store className="h-5 w-5" />
                  <span>Shops</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <NavLink 
                to="/analytics" 
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-3 hover:bg-sidebar-accent rounded-md transition-colors ${
                    isActive ? "bg-sidebar-accent text-white" : "text-sidebar-foreground"
                  }`
                }
              >
                <Bell className="h-5 w-5" />
                <span>Analytics</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 w-full hover:bg-sidebar-accent rounded-md transition-colors text-sidebar-foreground"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
