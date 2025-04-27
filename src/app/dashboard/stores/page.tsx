"use client";

import { useState, useEffect } from "react";
import { useData } from "@/lib/data-context";
import { useAuth } from "@/lib/auth-context";
import { Plus, Edit, Trash2, Store, LogIn, Info, Package } from "lucide-react";
import CreateStoreModal from "@/components/stores/CreateStoreModal";
import EditStoreModal from "@/components/stores/EditStoreModal";
import ShopDetailModal from "@/components/stores/ShopDetailModal";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Shop } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export default function StoresPage() {
  const { shops, deleteShop, setActiveShop } = useData();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Shop | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter shops based on search term
  const filteredShops = shops.filter(shop => 
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.shopNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditStore = (store: Shop) => {
    setSelectedStore(store);
    setIsEditModalOpen(true);
  };

  const handleDeleteStore = (storeId: string) => {
    // Check if there are any sales associated with this store
    const { getSalesByShop } = useData();
    const storeSales = getSalesByShop(storeId);
    
    if (storeSales.length > 0) {
      toast({
        variant: "destructive",
        title: "Cannot delete store",
        description: "This store has sales records and cannot be deleted",
      });
      return;
    }
    
    // Otherwise, delete the store
    const deleteResult = deleteShop(storeId);
    
    if (deleteResult.success) {
      toast({
        title: "Store deleted",
        description: "The store has been successfully deleted",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: deleteResult.error || "Failed to delete the store",
      });
    }
  };

  // Handle entering a store as Super Admin
  const handleEnterStore = (store: Shop) => {
    setActiveShop(store.id);
    toast({
      title: "Store Access Granted",
      description: `You are now viewing ${store.name}`
    });
    window.location.href = "/dashboard";
  };

  const handleViewStoreDetails = (store: Shop) => {
    setSelectedStore(store);
    setIsDetailModalOpen(true);
  };

  // Only Super Admin can see this page
  if (user?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Store className="h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Stores</h1>
          <p className="text-muted-foreground">Manage all store locations and their Sub Admin accounts</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Store
        </Button>
      </div>
      
      <div className="mb-6">
        <div className="relative w-full max-w-md">
          <Input
            placeholder="Search stores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Store className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>
      
      {filteredShops.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-muted/50 rounded-lg p-8 mt-8">
          <Store className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium mb-2">No stores found</h2>
          <p className="text-muted-foreground text-center mb-4">
            {searchTerm ? "Try a different search term" : "You haven't added any stores to your inventory system yet."}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Store
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map((store) => (
            <Card key={store.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center">
                  <Store className="h-5 w-5 mr-2 text-primary" />
                  {store.name}
                </CardTitle>
                <CardDescription>Store #{store.shopNo}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="text-sm font-medium">Address:</span>
                  <p className="text-sm text-muted-foreground">{store.address}</p>
                </div>
                {store.phone && (
                  <div>
                    <span className="text-sm font-medium">Phone:</span>
                    <p className="text-sm text-muted-foreground">{store.phone}</p>
                  </div>
                )}
                {store.email && (
                  <div>
                    <span className="text-sm font-medium">Email:</span>
                    <p className="text-sm text-muted-foreground">{store.email}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium">Created:</span>
                  <p className="text-sm text-muted-foreground">{formatDate(store.createdAt)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Sub Admin:</span>
                  <p className="text-sm text-muted-foreground">
                    {store.managerId ? (
                      (() => {
                        try {
                          const users = JSON.parse(localStorage.getItem('users') || '[]');
                          const subAdmin = users.find((user: any) => user.id === store.managerId);
                          return subAdmin ? subAdmin.username : "Assigned";
                        } catch (error) {
                          return "Assigned";
                        }
                      })()
                    ) : "Not Assigned"}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="pt-1 flex justify-between gap-2">
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleEnterStore(store)}
                    className="flex items-center gap-1"
                  >
                    <LogIn className="h-4 w-4" />
                    Enter Store
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewStoreDetails(store)}
                    className="flex items-center gap-1"
                  >
                    <Info className="h-4 w-4" />
                    Details
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = `/dashboard/stores/${store.id}/products`}
                    className="flex items-center gap-1"
                  >
                    <Package className="h-4 w-4" />
                    Products
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditStore(store)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Store</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete {store.name}? This action cannot be undone.
                          All associated inventory and sales data will be permanently removed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive hover:bg-destructive/90"
                          onClick={() => handleDeleteStore(store.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      <CreateStoreModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
      
      <EditStoreModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        store={selectedStore}
      />
      
      <ShopDetailModal
        open={isDetailModalOpen}
        onOpenChange={setIsDetailModalOpen}
        store={selectedStore}
      />
    </div>
  );
} 