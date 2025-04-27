import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "@/lib/data-context";
import { useAuth } from "@/lib/auth-context";
import { Shop } from "@/lib/types";
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Building, PlusCircle, Store, User, Edit, LogIn, Trash2, Plus, Info } from "lucide-react";
import CreateStoreModal from "@/components/stores/CreateStoreModal";
import EditStoreModal from "@/components/stores/EditStoreModal";
import ShopDetailModal from "@/components/stores/ShopDetailModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { formatDate } from "@/lib/utils";

const StoresPage = () => {
  const { shops, getShop, setActiveShop, deleteShop } = useData();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Shop | null>(null);

  // Filter shops based on the super admin's ID and search term
  const filteredShops = shops
    .filter(shop => {
      // If the user is a super admin/admin, only show stores linked to them or with no super admin assigned
      if (user?.role === 'super_admin' || user?.role === 'admin') {
        return !shop.superAdminId || shop.superAdminId === user.id;
      }
      return true; // Default case (should not occur due to role check)
    })
    .filter(shop => 
      shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.shopNo.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Handle entering a store as Super Admin
  const handleEnterStore = (shop: Shop) => {
    setActiveShop(shop.id);
    toast({
      title: "Store Access Granted",
      description: `You are now viewing ${shop.name}`,
    });
    navigate("/dashboard");
  };

  // Handle editing a store
  const handleEditStore = (shop: Shop) => {
    setSelectedStore(shop);
    setEditModalOpen(true);
  };

  // Handle deleting a store
  const handleDeleteStore = (storeId: string) => {
    const success = deleteShop(storeId);
    
    if (success) {
      toast({
        title: "Success",
        description: "Store deleted successfully"
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete store",
        variant: "destructive"
      });
    }
  };

  // Handle viewing store details
  const handleViewStoreDetails = (shop: Shop) => {
    setSelectedStore(shop);
    setDetailModalOpen(true);
  };

  // Only Super Admin/Admin can see this page
  if (user?.role !== 'super_admin' && user?.role !== 'admin') {
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
        <Button onClick={() => setCreateModalOpen(true)}>
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
            <Button onClick={() => setCreateModalOpen(true)}>
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
                    {store.managerId ? "Assigned" : "Not Assigned"}
                  </p>
                </div>
                {store.superAdminId && (
                  <div>
                    <span className="text-sm font-medium">Super Admin:</span>
                    <p className="text-sm text-muted-foreground">
                      {(() => {
                        try {
                          const users = JSON.parse(localStorage.getItem('users') || '[]');
                          const superAdmin = users.find((user: any) => user.id === store.superAdminId);
                          return superAdmin ? superAdmin.username : "Assigned";
                        } catch (error) {
                          return "Assigned";
                        }
                      })()}
                    </p>
                  </div>
                )}
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
                    Enter
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
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
      />
      
      {selectedStore && (
        <>
          <EditStoreModal
            open={editModalOpen}
            onOpenChange={setEditModalOpen}
            store={selectedStore}
          />
          
          <ShopDetailModal
            open={detailModalOpen}
            onOpenChange={setDetailModalOpen}
            store={selectedStore}
          />
        </>
      )}
    </div>
  );
};

export default StoresPage; 