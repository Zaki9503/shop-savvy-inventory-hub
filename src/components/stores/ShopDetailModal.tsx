import React, { useEffect, useState } from "react";
import { Shop } from "@/lib/types";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Store, User, Mail, Phone, MapPin, Calendar, Shield, Package } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface ShopDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  store: Shop | null;
}

interface SubAdmin {
  id: string;
  username: string;
  email?: string;
  role: string;
  name?: string;
  phone?: string;
  avatar?: string;
  storeName?: string;
}

interface SuperAdmin {
  id: string;
  username: string;
  email?: string;
  name?: string;
  phone?: string;
  avatar?: string;
}

const ShopDetailModal: React.FC<ShopDetailModalProps> = ({ open, onOpenChange, store }) => {
  const [subAdmin, setSubAdmin] = useState<SubAdmin | null>(null);
  const [superAdmin, setSuperAdmin] = useState<SuperAdmin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (!store) return;
      
      setLoading(true);
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Load sub-admin data
        if (store.managerId) {
          const manager = users.find((user: any) => user.id === store.managerId);
          
          if (manager) {
            // Load additional profile data
            const profileData = localStorage.getItem(`profile_${manager.id}`);
            if (profileData) {
              setSubAdmin({ 
                ...manager, 
                ...JSON.parse(profileData) 
              });
            } else {
              setSubAdmin(manager);
            }
          }
        } else {
          setSubAdmin(null);
        }
        
        // Load super-admin data if available
        if (store.superAdminId) {
          const admin = users.find((user: any) => user.id === store.superAdminId);
          
          if (admin) {
            // Load additional profile data
            const profileData = localStorage.getItem(`profile_${admin.id}`);
            if (profileData) {
              setSuperAdmin({ 
                ...admin, 
                ...JSON.parse(profileData) 
              });
            } else {
              setSuperAdmin(admin);
            }
          }
        } else {
          setSuperAdmin(null);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [store]);

  const handleViewProducts = () => {
    if (store) {
      window.location.href = `/dashboard/stores/${store.id}/products`;
      onOpenChange(false);
    }
  };

  if (!store) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Store className="h-5 w-5 mr-2 text-primary" />
            {store.name}
          </DialogTitle>
          <DialogDescription>
            Store #{store.storeNumber}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-sm font-medium flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                Address
              </span>
              <p className="text-sm">{store.address}</p>
            </div>
            
            <div className="space-y-1">
              <span className="text-sm font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                Created
              </span>
              <p className="text-sm">{formatDate(store.createdAt)}</p>
            </div>
          </div>
          
          {store.phone && (
            <div className="space-y-1">
              <span className="text-sm font-medium flex items-center">
                <Phone className="h-4 w-4 mr-1 text-muted-foreground" />
                Phone
              </span>
              <p className="text-sm">{store.phone}</p>
            </div>
          )}
          
          {store.email && (
            <div className="space-y-1">
              <span className="text-sm font-medium flex items-center">
                <Mail className="h-4 w-4 mr-1 text-muted-foreground" />
                Email
              </span>
              <p className="text-sm">{store.email}</p>
            </div>
          )}
          
          <Separator />
          
          {/* Super Admin Information */}
          {(store.superAdminId || superAdmin) && (
            <>
              <div className="space-y-3">
                <h3 className="text-md font-medium flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                  Super Admin
                </h3>
                
                {loading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : superAdmin ? (
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      {superAdmin.avatar ? (
                        <AvatarImage src={superAdmin.avatar} alt={superAdmin.name || superAdmin.username} />
                      ) : (
                        <AvatarFallback>
                          {(superAdmin.name || superAdmin.username || "?")[0].toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    <div className="space-y-1">
                      <p className="font-medium">{superAdmin.name || superAdmin.username}</p>
                      <p className="text-sm text-muted-foreground">{superAdmin.username}</p>
                      {superAdmin.email && (
                        <p className="text-sm flex items-center">
                          <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          {superAdmin.email}
                        </p>
                      )}
                      {superAdmin.phone && (
                        <p className="text-sm flex items-center">
                          <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          {superAdmin.phone}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No Super Admin information available.</p>
                )}
              </div>
              
              <Separator />
            </>
          )}
          
          {/* Sub Admin Information */}
          <div className="space-y-3">
            <h3 className="text-md font-medium flex items-center">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              Sub Admin Manager
            </h3>
            
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : subAdmin ? (
              <div className="flex items-start space-x-4">
                <Avatar className="h-12 w-12">
                  {subAdmin.avatar ? (
                    <AvatarImage src={subAdmin.avatar} alt={subAdmin.name || subAdmin.username} />
                  ) : (
                    <AvatarFallback>
                      {(subAdmin.name || subAdmin.username || "?")[0].toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <div className="space-y-1">
                  <p className="font-medium">{subAdmin.name || subAdmin.username}</p>
                  <p className="text-sm text-muted-foreground">{subAdmin.username}</p>
                  {subAdmin.email && (
                    <p className="text-sm flex items-center">
                      <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      {subAdmin.email}
                    </p>
                  )}
                  {subAdmin.phone && (
                    <p className="text-sm flex items-center">
                      <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      {subAdmin.phone}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No Sub Admin assigned to this store.</p>
            )}
          </div>
        </div>
        
        <DialogFooter className="mt-6">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center" 
            onClick={handleViewProducts}
          >
            <Package className="mr-2 h-4 w-4" />
            View Shop Products
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShopDetailModal; 