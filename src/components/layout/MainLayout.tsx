import React from "react";
import { Link, NavLink, Outlet, useNavigate, Routes, Route } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { 
  Home, 
  Package, 
  ShoppingBag, 
  Store, 
  Users, 
  LogOut,
  Search,
  User
} from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarProvider
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AdminProfilePage from "@/pages/AdminProfilePage";

export const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
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
        <AppSidebar user={user} onLogout={handleLogout} />
        <div className="flex-1">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <SidebarTrigger className="mr-2" />
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 w-full sm:w-60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Link to="/admin-profile" className="focus:outline-none">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="hidden sm:block text-sm">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>
            {/* Route rendering */}
            <Routes>
              <Route path="/admin-profile" element={<AdminProfilePage />} />
            </Routes>
            {children || <Outlet />}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

interface AppSidebarProps {
  user: any;
  onLogout: () => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ user, onLogout }) => {
  const { hasPermission } = useAuth();
  const isAdmin = hasPermission(["admin"]);
  const isManager = hasPermission(["admin", "manager"]);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 pl-4 py-4">
          <ShoppingBag className="h-7 w-7 text-white" />
          <h1 className="text-xl font-bold text-white">ShopSavvy</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
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
                to="/customers" 
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-3 hover:bg-sidebar-accent rounded-md transition-colors ${
                    isActive ? "bg-sidebar-accent text-white" : "text-sidebar-foreground"
                  }`
                }
              >
                <Users className="h-5 w-5" />
                <span>Customers</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {isAdmin && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink 
                  to="/users" 
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-4 py-3 hover:bg-sidebar-accent rounded-md transition-colors ${
                      isActive ? "bg-sidebar-accent text-white" : "text-sidebar-foreground"
                    }`
                  }
                >
                  <User className="h-5 w-5" />
                  <span>Users</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
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

export default MainLayout;
