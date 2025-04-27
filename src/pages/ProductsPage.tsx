import React, { useState, useEffect } from "react";
import { useData } from "@/lib/data-context";
import { useAuth } from "@/lib/auth-context";
import { Package, Plus, Search, Edit, Trash2, Pencil, AlertTriangle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/types";
import ProductDialog from "@/components/products/ProductDialog";
import { useToast } from "@/hooks/use-toast";

const ProductsPage: React.FC = () => {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    inventory, 
    shops, 
    updateInventory,
    removeProductFromShop,
    isProductInAnyShop
  } = useData();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  
  // Determine if user is an admin or a sub-admin/manager
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  const isSubAdmin = user?.role === "sub_admin" || user?.role === "manager";
  
  // For sub-admin, only show products in their shop
  const userShopId = user?.shopId;
  
  // For debugging - log inventory on load
  useEffect(() => {
    console.log("Current inventory:", inventory);
    console.log("Current products:", products);
    console.log("User shop ID:", userShopId);
  }, [inventory, products, userShopId]);
  
  // Helper to check if a product is in the user's shop
  const isProductInUserShop = (productId: string) => {
    if (!userShopId) return false;
    return inventory.some(item => item.shopId === userShopId && item.productId === productId);
  };
  
  // Check for expired products and update their status
  useEffect(() => {
    const today = new Date();
    products.forEach(product => {
      if (product.expiryDate && new Date(product.expiryDate) < today && product.isActive) {
        // Product has expired and is still active - mark as inactive
        updateProduct(product.id, { isActive: false });
        
        // Show notification for admin users and sub-admin users who manage this product
        if (isAdmin || (isSubAdmin && isProductInUserShop(product.id))) {
          toast({
            title: "Product Expired",
            description: `${product.name} has expired and has been marked as inactive.`,
            variant: "destructive",
          });
        }
      }
    });
  }, [products, updateProduct, isAdmin, toast, isSubAdmin]);
  
  // For subadmins, combine two approaches:
  // 1. Filter by current inventory items 
  // 2. Also include any product that was just added (might not be in inventory yet)
  const [recentlyAddedProducts, setRecentlyAddedProducts] = useState<string[]>([]);
  
  // Filter products based on user role and associated shop
  const filteredProducts = products
    .filter(product => {
      // First apply the search filter
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      
      // If user is a sub-admin, only show products for their shop
      if (isSubAdmin && userShopId) {
        // Check inventory to see if this product is stocked in their shop
        const hasInventoryInShop = inventory.some(
          item => item.shopId === userShopId && item.productId === product.id
        );
        
        // Also include any product that was recently added by this user
        const wasRecentlyAdded = recentlyAddedProducts.includes(product.id);
        
        return matchesSearch && (hasInventoryInShop || wasRecentlyAdded);
      }
      
      // For admins, show all products that match the search
      return matchesSearch;
    })
    .sort((a, b) => a.name.localeCompare(b.name));
  
  const getStockLevel = (productId: string) => {
    if (!userShopId) return { quantity: 0, minLevel: 0 };
    
    const inventoryItem = inventory.find(
      item => item.shopId === userShopId && item.productId === productId
    );
    
    return inventoryItem 
      ? { quantity: inventoryItem.quantity, minLevel: inventoryItem.minStockLevel }
      : { quantity: 0, minLevel: 0 };
  };
  
  const getStockStatus = (quantity: number, minLevel: number) => {
    if (quantity === 0) return { label: "Out of Stock", variant: "destructive" };
    if (quantity <= minLevel) return { label: "Low Stock", variant: "warning" };
    return { label: "In Stock", variant: "default" };
  };

  const handleAddProduct = (data: Partial<Product>) => {
    // Allow both admins and sub-admins to add products
    if (!isAdmin && !isSubAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to add products.",
        variant: "destructive"
      });
      return;
    }
    
    // Add the new product
    const result = addProduct({ 
      ...data, 
      isActive: true,
      stock: data.stock || 0
    } as Product);
    
    if (!result.success) {
      toast({
        title: "Error Adding Product",
        description: result.error || "Failed to add product",
        variant: "destructive"
      });
      return;
    }
    
    const newProduct = result.data!;
    console.log("New product added:", newProduct);
    
    // If sub-admin, automatically add to their shop's inventory
    if (isSubAdmin && userShopId) {
      // Add to inventory
      const inventoryItem = updateInventory(userShopId, newProduct.id, data.stock || 0);
      console.log("Added to inventory:", inventoryItem);
      
      // Track as recently added
      setRecentlyAddedProducts(prev => [...prev, newProduct.id]);
    }
    
    toast({
      title: "Success",
      description: "Product added successfully!",
    });
    setDialogOpen(false);
  };

  // Helper functions to save data to localStorage
  const saveProductsToLocalStorage = () => {
    localStorage.setItem('products', JSON.stringify(products));
  };
  
  const saveInventoryToLocalStorage = () => {
    localStorage.setItem('inventory', JSON.stringify(inventory));
  };

  const handleEditProduct = (data: Partial<Product>) => {
    // Check permissions: admins can edit any product, sub-admins can only edit products in their shop
    if (!isAdmin && !isSubAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to edit product details.",
        variant: "destructive"
      });
      return;
    }
    
    if (editingProduct) {
      // For sub-admins, check if the product is in their shop
      if (isSubAdmin && !isProductInUserShop(editingProduct.id)) {
        toast({
          title: "Access Denied",
          description: "You can only edit products in your shop.",
          variant: "destructive"
        });
        return;
      }
      
      const result = updateProduct(editingProduct.id, data);
      if (!result.success) {
        toast({
          title: "Error Updating Product",
          description: result.error || "Failed to update product",
          variant: "destructive"
        });
        return;
      }
      
      const updatedProduct = result.data!;
      console.log("Updated product:", updatedProduct);
      
      // If stock changed and user is sub-admin, update inventory for their shop
      if (isSubAdmin && userShopId && data.stock !== undefined && data.stock !== editingProduct.stock) {
        const inventoryUpdate = updateInventory(userShopId, editingProduct.id, data.stock);
        console.log("Updated inventory:", inventoryUpdate);
      }
      
      toast({
        title: "Success",
        description: "Product updated successfully!",
      });
      setDialogOpen(false);
      setEditingProduct(undefined);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    // Check permissions
    if (!isAdmin && !isSubAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to delete products.",
        variant: "destructive"
      });
      return;
    }
    
    // For sub-admins, check if the product is in their shop
    if (isSubAdmin && !isProductInUserShop(productId)) {
      toast({
        title: "Access Denied",
        description: "You can only remove products from your shop.",
        variant: "destructive"
      });
      return;
    }
    
    // Different behavior for admins vs sub-admins
    if (isAdmin) {
      // Super admins can permanently delete products
      if (window.confirm("Are you sure you want to permanently delete this product? This will remove it from all shops.")) {
        const result = deleteProduct(productId);
        
        if (result.success) {
          toast({
            title: "Success",
            description: "Product has been permanently deleted.",
          });
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to delete product",
            variant: "destructive"
          });
        }
      }
    } else if (isSubAdmin && userShopId) {
      // Sub-admins can only remove products from their shop's inventory
      if (window.confirm("Are you sure you want to remove this product from your shop? The product will still exist in the system.")) {
        // Use the context function to remove the product from this shop
        const success = removeProductFromShop(userShopId, productId);
        
        if (success) {
          // Remove from recently added list if it's there
          if (recentlyAddedProducts.includes(productId)) {
            setRecentlyAddedProducts(prev => prev.filter(id => id !== productId));
          }
          
          toast({
            title: "Success",
            description: "Product removed from your shop's inventory.",
          });
          
          // Refresh the page to update the UI
          window.location.reload();
        } else {
          toast({
            title: "Error",
            description: "Failed to remove product from inventory.",
            variant: "destructive"
          });
        }
      }
    }
  };

  // Function to get product status badge
  const getProductStatusBadge = (product: Product, isExpired: boolean) => {
    if (isExpired) {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-700 hover:bg-red-100/80">
          Expired
        </Badge>
      );
    } else if (product.stock === 0) {
      return (
        <Badge variant="outline" className="bg-orange-100 text-orange-700 hover:bg-orange-100/80 flex items-center gap-1">
          <ShoppingCart className="h-3 w-3" />
          <span>Out of Stock</span>
        </Badge>
      );
    } else {
      return (
        <Badge 
          variant={product.isActive ? "default" : "outline"}
          className={!product.isActive ? "bg-orange-100 text-orange-700 hover:bg-orange-100/80" : ""}
        >
          {product.isActive ? "Active" : "Inactive"}
        </Badge>
      );
    }
  };

  // Get shop name for sub-admin
  const getShopName = () => {
    if (!userShopId) return "";
    const shop = shops.find(s => s.id === userShopId);
    return shop ? shop.name : "";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          {isSubAdmin && userShopId && (
            <p className="text-gray-500">Managing products for {getShopName()}</p>
          )}
          {!isSubAdmin && (
            <p className="text-gray-500">Manage your product inventory across all shops</p>
          )}
        </div>
        
        {/* Allow both admins and sub-admins to add products */}
        {(isAdmin || isSubAdmin) && (
          <Button 
            className="flex items-center gap-2"
            onClick={() => {
              setEditingProduct(undefined);
              setDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Button>
        )}
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>EXP</TableHead>
                  <TableHead>Status</TableHead>
                  {/* Show edit and delete columns for both admins and sub-admins */}
                  {(isAdmin || isSubAdmin) && <TableHead>Edit</TableHead>}
                  {(isAdmin || isSubAdmin) && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={(isAdmin || isSubAdmin) ? 8 : 6} className="h-24 text-center">
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => {
                    const isExpired = product.expiryDate && new Date(product.expiryDate) < new Date();
                    const isOutOfStock = product.stock === 0;
                    
                    return (
                      <TableRow 
                        key={product.id} 
                        className={
                          isExpired 
                            ? "bg-red-50" 
                            : isOutOfStock 
                              ? "bg-orange-50"
                              : ""
                        }
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-md bg-gray-100 p-2">
                              {product.image ? (
                                <img 
                                  src={product.image} 
                                  alt={product.name}
                                  className="h-full w-full object-cover rounded-md"
                                />
                              ) : (
                                <Package className="h-full w-full text-gray-500" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-xs text-gray-500 line-clamp-1">
                                {product.description || "No description"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                        <TableCell>₹{product.price.toFixed(2)}</TableCell>
                        <TableCell className={isOutOfStock ? "text-orange-600 font-medium" : ""}>
                          {product.stock}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={isExpired ? "text-red-500 font-medium" : ""}>
                              {product.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : "-"}
                            </span>
                            {isExpired && (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getProductStatusBadge(product, isExpired)}
                        </TableCell>
                        {/* Show edit button for both admins and sub-admins */}
                        {(isAdmin || isSubAdmin) && (
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingProduct(product);
                                setDialogOpen(true);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <span className="sr-only">Edit</span>
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        )}
                        {/* Show appropriate action buttons based on user role */}
                        {(isAdmin || isSubAdmin) && (
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <span className="sr-only">
                                {isAdmin ? "Delete" : "Remove from Shop"}
                              </span>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={editingProduct}
        onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
      />
    </div>
  );
};

export default ProductsPage;
