import React, { useState } from "react";
import { useData } from "@/lib/data-context";
import { useAuth } from "@/lib/auth-context";
import { Package, Plus, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/types";
import ProductDialog from "@/components/products/ProductDialog";
import { useToast } from "@/hooks/use-toast";

const ProductsPage: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, inventory } = useData();
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  
  // For shop managers/staff, show only products in their shop
  const shopId = user?.shopId;
  const isAdminOrManager = user?.role === "admin" || user?.role === "manager";
  
  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));
  
  const getStockLevel = (productId: string) => {
    if (!shopId) return { quantity: 0, minLevel: 0 };
    
    const inventoryItem = inventory.find(
      item => item.shopId === shopId && item.productId === productId
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
    const newProduct = addProduct({ ...data, isActive: true } as Product);
    toast({
      title: "Success",
      description: "Product added successfully!",
    });
    setDialogOpen(false);
  };

  const handleEditProduct = (data: Partial<Product>) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
      toast({
        title: "Success",
        description: "Product updated successfully!",
      });
      setDialogOpen(false);
      setEditingProduct(undefined);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(productId);
      toast({
        title: "Success",
        description: "Product deleted successfully!",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500">Manage your product inventory</p>
        </div>
        
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
                  {isAdminOrManager && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => {
                    const isExpired = product.expiryDate && new Date(product.expiryDate) < new Date();
                    
                    return (
                      <TableRow key={product.id}>
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
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>
                          <span className={isExpired ? "text-red-500 font-medium" : ""}>
                            {product.expiryDate ? new Date(product.expiryDate).toLocaleDateString() : "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={product.isActive ? "default" : "outline"}
                            className={!product.isActive ? "bg-orange-100 text-orange-700 hover:bg-orange-100/80" : ""}
                          >
                            {product.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        
                        {isAdminOrManager && (
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingProduct(product);
                                  setDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
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
        initialData={editingProduct}
        onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
        mode={editingProduct ? "edit" : "add"}
      />
    </div>
  );
};

export default ProductsPage;
