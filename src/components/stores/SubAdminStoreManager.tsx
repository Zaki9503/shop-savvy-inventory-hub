import React, { useState, useEffect } from "react";
import { useData } from "@/lib/data-context";
import { useAuth } from "@/lib/auth-context";
import { Store, Plus, Package, Edit, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Shop } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import CreateStoreModal from "./CreateStoreModal";
import ShopProductsPage from "./ShopProductsPage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SubAdminStoreManager = () => {
  const { shops, getShopInventory } = useData();
  const { user } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"store" | "products">("store");
  
  // Filter shop by sub-admin ID
  const subAdminShop = user?.shopId ? shops.find(shop => shop.id === user.shopId) : null;
  
  // Calculate product count for this shop
  const productCount = subAdminShop ? getShopInventory(subAdminShop.id).length : 0;

  // Handle store product management
  const handleViewProducts = () => {
    setActiveTab("products");
  };

  // Handle returning to store details
  const handleViewStore = () => {
    setActiveTab("store");
  };

  if (!user || user.role !== "sub_admin") {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Store className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">Only sub-admins can view this page.</p>
      </div>
    );
  }

  // Show store creation UI if no store exists yet
  if (!subAdminShop) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center bg-muted/50 rounded-lg p-8 mt-8">
          <Store className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium mb-2">No Store Found</h2>
          <p className="text-muted-foreground text-center mb-4">
            You don't have a store assigned to your account yet.
          </p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your Store
          </Button>
        </div>
        
        <CreateStoreModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          forSubAdmin={true}
          subAdminId={user.id}
        />
      </div>
    );
  }

  // Show store management UI
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Store className="h-6 w-6 mr-2 text-primary" />
            {subAdminShop.name}
          </h1>
          <p className="text-muted-foreground">Store #{subAdminShop.storeNumber}</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={activeTab === "store" ? "default" : "outline"}
            onClick={handleViewStore}
          >
            <Store className="h-4 w-4 mr-2" />
            Store Details
          </Button>
          
          <Button 
            variant={activeTab === "products" ? "default" : "outline"}
            onClick={handleViewProducts}
          >
            <Package className="h-4 w-4 mr-2" />
            Products
            {productCount > 0 && (
              <span className="ml-2 bg-primary-foreground rounded-full px-2 py-0.5 text-xs">
                {productCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {activeTab === "store" ? (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
            <CardDescription>Manage your store details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium">Store Name</h3>
                <p>{subAdminShop.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Store ID</h3>
                <p>{subAdminShop.storeNumber}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Address</h3>
                <p>{subAdminShop.address}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium">Created</h3>
                <p>{formatDate(subAdminShop.createdAt)}</p>
              </div>
              {subAdminShop.phone && (
                <div>
                  <h3 className="text-sm font-medium">Phone</h3>
                  <p>{subAdminShop.phone}</p>
                </div>
              )}
              {subAdminShop.email && (
                <div>
                  <h3 className="text-sm font-medium">Email</h3>
                  <p>{subAdminShop.email}</p>
                </div>
              )}
            </div>
            
            <Separator className="my-4" />
            
            <div className="bg-muted/50 p-4 rounded-md">
              <h3 className="text-sm font-medium mb-2">Products Overview</h3>
              <div className="flex gap-4">
                <div>
                  <span className="text-2xl font-bold">{productCount}</span>
                  <p className="text-xs text-muted-foreground">Total Products</p>
                </div>
                <Button size="sm" variant="outline" onClick={handleViewProducts}>
                  <Package className="h-4 w-4 mr-2" />
                  Manage Products
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <ShopProductsPage shopId={subAdminShop.id} />
      )}
    </div>
  );
};

export default SubAdminStoreManager; 