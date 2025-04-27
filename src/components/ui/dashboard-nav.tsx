import React from "react";
import { useAuth } from "@/lib/auth-context";
import { useData } from "@/lib/data-context";
import { 
  Store, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart, 
  Settings, 
  LayoutDashboard,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  title: string;
  icon: React.ReactNode;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, title, icon, active }) => {
  return (
    <a
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
        active ? "bg-muted font-medium text-primary" : "text-muted-foreground"
      )}
    >
      {icon}
      {title}
    </a>
  );
};

interface DashboardNavProps {
  activePath: string;
}

export const DashboardNav: React.FC<DashboardNavProps> = ({ activePath }) => {
  const { user, logout } = useAuth();
  const { activeShopId, shops } = useData();
  
  const activeShop = shops.find(shop => shop.id === activeShopId);
  const userShop = user?.shopId ? shops.find(shop => shop.id === user.shopId) : null;
  const isSubAdmin = user?.role === "sub_admin";
  const isSuperAdmin = user?.role === "super_admin" || user?.role === "admin";
  
  return (
    <div className="flex flex-col h-full justify-between">
      {/* Store Information for Sub-Admin */}
      {isSubAdmin && userShop && (
        <div className="mb-4 p-4 bg-primary/10 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Store className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-primary">Your Store</span>
          </div>
          <h3 className="text-sm font-semibold truncate">{userShop.name}</h3>
          <p className="text-xs text-muted-foreground">Store #{userShop.storeNumber}</p>
        </div>
      )}
      
      <div className="space-y-1">
        <NavItem
          href="/dashboard"
          title="Dashboard"
          icon={<LayoutDashboard className="h-4 w-4" />}
          active={activePath === "/dashboard"}
        />
        
        {isSuperAdmin && (
          <NavItem
            href="/dashboard/stores"
            title="Stores"
            icon={<Store className="h-4 w-4" />}
            active={activePath === "/dashboard/stores"}
          />
        )}
        
        {isSubAdmin && (
          <NavItem
            href="/dashboard/my-store"
            title="My Store"
            icon={<Store className="h-4 w-4" />}
            active={activePath === "/dashboard/my-store"}
          />
        )}
        
        <NavItem
          href="/dashboard/products"
          title="Products"
          icon={<Package className="h-4 w-4" />}
          active={activePath === "/dashboard/products"}
        />
        
        <NavItem
          href="/dashboard/sales"
          title="Sales"
          icon={<ShoppingCart className="h-4 w-4" />}
          active={activePath === "/dashboard/sales"}
        />
        
        {isSuperAdmin && (
          <NavItem
            href="/dashboard/users"
            title="Users"
            icon={<Users className="h-4 w-4" />}
            active={activePath === "/dashboard/users"}
          />
        )}
        
        <NavItem
          href="/dashboard/reports"
          title="Reports"
          icon={<BarChart className="h-4 w-4" />}
          active={activePath === "/dashboard/reports"}
        />

        <NavItem
          href="/dashboard/settings"
          title="Settings"
          icon={<Settings className="h-4 w-4" />}
          active={activePath === "/dashboard/settings"}
        />
      </div>
      
      <div className="mt-auto pt-4 border-t">
        {activeShopId && !userShop && (
          <div className="px-3 py-2 mb-2">
            <div className="text-xs font-medium text-muted-foreground">Active Store</div>
            <div className="text-sm font-semibold truncate">
              {activeShop?.name || "Unknown Store"}
            </div>
          </div>
        )}
        
        <button 
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:text-destructive"
          onClick={() => {
            logout();
            window.location.href = "/login";
          }}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardNav; 