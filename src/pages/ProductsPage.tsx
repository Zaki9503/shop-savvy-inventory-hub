
import React, { useState } from "react";
import { useData } from "@/lib/data-context";
import { useAuth } from "@/lib/auth-context";
import { Package, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const ProductsPage: React.FC = () => {
  const { products, inventory } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  
  // For shop managers/staff, show only products in their shop
  const shopId = user?.shopId;
  const isAdminOrManager = user?.role === "admin" || user?.role === "manager";
  
  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));
  
  // Get stock level for a product at user's shop
  const getStockLevel = (productId: string) => {
    if (!shopId) return { quantity: 0, minLevel: 0 };
    
    const inventoryItem = inventory.find(
      item => item.shopId === shopId && item.productId === productId
    );
    
    return inventoryItem 
      ? { quantity: inventoryItem.quantity, minLevel: inventoryItem.minStockLevel }
      : { quantity: 0, minLevel: 0 };
  };
  
  // Determine stock status
  const getStockStatus = (quantity: number, minLevel: number) => {
    if (quantity === 0) return { label: "Out of Stock", variant: "destructive" };
    if (quantity <= minLevel) return { label: "Low Stock", variant: "warning" };
    return { label: "In Stock", variant: "default" };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500">Manage your product inventory</p>
        </div>
        
        <Button className="flex items-center gap-2">
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
            
            <div className="flex gap-2 w-full sm:w-auto">
              <select className="h-9 rounded-md border border-input px-3 py-1 text-sm">
                <option value="">All Categories</option>
                <option value="Dairy">Dairy</option>
                <option value="Bakery">Bakery</option>
                <option value="Produce">Produce</option>
                <option value="Beverages">Beverages</option>
              </select>
              
              <select className="h-9 rounded-md border border-input px-3 py-1 text-sm">
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  {shopId && <TableHead>Stock</TableHead>}
                  <TableHead>Status</TableHead>
                  {isAdminOrManager && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={shopId ? 6 : 5} className="h-24 text-center">
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => {
                    const { quantity, minLevel } = shopId ? getStockLevel(product.id) : { quantity: 0, minLevel: 0 };
                    const stockStatus = getStockStatus(quantity, minLevel);
                    
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-md bg-gray-100 p-2">
                              <Package className="h-full w-full text-gray-500" />
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
                        <TableCell>{product.category}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        
                        {shopId && (
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{quantity}</span>
                              <span className="text-xs text-gray-500">Min: {minLevel}</span>
                            </div>
                          </TableCell>
                        )}
                        
                        <TableCell>
                          {shopId ? (
                            <Badge 
                              variant={
                                stockStatus.variant === "warning" 
                                  ? "outline" 
                                  : stockStatus.variant === "destructive" 
                                    ? "destructive" 
                                    : "default"
                              }
                              className={
                                stockStatus.variant === "warning" 
                                  ? "border-amber-500 text-amber-700 bg-amber-50" 
                                  : undefined
                              }
                            >
                              {stockStatus.label}
                            </Badge>
                          ) : (
                            <Badge variant={product.isActive ? "default" : "outline"}>
                              {product.isActive ? "Active" : "Inactive"}
                            </Badge>
                          )}
                        </TableCell>
                        
                        {isAdminOrManager && (
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Edit</Button>
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
    </div>
  );
};

export default ProductsPage;
