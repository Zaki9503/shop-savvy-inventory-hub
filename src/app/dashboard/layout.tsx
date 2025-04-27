import React from "react";
import { usePathname } from "@/hooks/use-pathname";
import DashboardNav from "@/components/ui/dashboard-nav";
import { useAuth } from "@/lib/auth-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    window.location.href = "/login";
    return null;
  }
  
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="hidden md:flex w-64 flex-col h-screen border-r bg-background">
        <div className="p-6">
          <h1 className="text-xl font-bold">Shop Savvy</h1>
        </div>
        <nav className="flex-1 overflow-auto px-3 py-2">
          <DashboardNav activePath={pathname} />
        </nav>
      </aside>
      <div className="flex-1 overflow-auto">
        <main className="bg-muted/10 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
} 