import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { 
  Home, 
  Package, 
  ShoppingBag, 
  LogOut,
  User,
  Bell,
  IndianRupee,
  Store
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
  const { user, hasPermission } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
  const isManager = hasPermission(["admin", "manager", "super_admin"]);

  console.log("User role:", user?.role); // Add this line for debugging

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 pl-4 py-6 border-b border-sidebar-accent/20">
          <IndianRupee className="h-8 w-8 text-white" />
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-white">ShopSavvy</h1>
            <span className="text-xs text-sidebar-foreground/70">Inventory Hub</span>
          </div>
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
          
          {isAdmin && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink 
                  to="/stores" 
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-4 py-3 hover:bg-sidebar-accent rounded-md transition-colors ${
                      isActive ? "bg-sidebar-accent text-white" : "text-sidebar-foreground"
                    }`
                  }
                >
                  <Store className="h-5 w-5" />
                  <span>Manage Stores</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          
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
