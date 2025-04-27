import React, { useState, useEffect } from "react";
import { useData } from "@/lib/data-context";
import { useAuth } from "@/lib/auth-context";
import { Package, Plus, Search, Trash2, ShoppingCart, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Product } from "@/lib/types";

interface ShopProductsPageProps {
  shopId: string;
}

const ShopProductsPage: React.FC<ShopProductsPageProps> = ({ shopId }) => {
  const { 
    products, 
    getShop, 
    getShopProducts, 
    updateInventory, 
    removeProductFromShop,
    getProductInventory,
    inventory
  } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddProductDialog, setShowAddProductDialog] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [productQuantity, setProductQuantity] = useState<number>(1);
  
  // Get shop information
  const shop = getShop(shopId);
  
  // Get products specific to this shop
  const shopProducts = getShopProducts(shopId);
  
  // Filter shop products based on search term
  const filteredProducts = shopProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Check if user has permission to manage this shop
  const canManageShop = 
    user?.role === "admin" || 
    user?.role === "super_admin" || 
    (user?.role === "sub_admin" && user?.shopId === shopId);
  
  // Load available products that are not already in this shop
  useEffect(() => {
    const shopProductIds = new Set(shopProducts.map(p => p.id));
    const productsNotInShop = products.filter(p => !shopProductIds.has(p.id));
    setAvailableProducts(productsNotInShop);
  }, [products, shopProducts]);
  
  // Get inventory data for a product in this shop
  const getProductInventoryData = (productId: string) => {
    const inventoryItem = inventory.find(
      item => item.shopId === shopId && item.productId === productId
    );
    
    return {
      quantity: inventoryItem?.quantity || 0,
      minStockLevel: inventoryItem?.minStockLevel || 0,
      lastUpdated: inventoryItem?.lastUpdated || ''
    };
  };
  
  // Handle adding a product to the shop
  const handleAddProductToShop = () => {
    if (!selectedProductId || productQuantity < 1) {
      toast({
        variant: "destructive",
        title: "Invalid Selection",
        description: "Please select a product and specify a valid quantity",
      });
      return;
    }
    
    const result = updateInventory(shopId, selectedProductId, productQuantity);
    
    if (result) {
      toast({
        title: "Product Added",
        description: "Product has been added to the shop inventory",
      });
      setShowAddProductDialog(false);
      setSelectedProductId("");
      setProductQuantity(1);
    } else {
      toast({
        variant: "destructive",
        title: "Failed to Add Product",
        description: "There was an error adding the product to inventory",
      });
    }
  };
  
  // Handle removing a product from the shop
  const handleRemoveProduct = (productId: string) => {
    if (window.confirm("Are you sure you want to remove this product from the shop?")) {
      const success = removeProductFromShop(shopId, productId);
      
      if (success) {
        toast({
          title: "Product Removed",
          description: "Product has been removed from the shop inventory",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to Remove Product",
          description: "There was an error removing the product from inventory",
        });
      }
    }
  };

  if (!shop) {
    return <div className="p-6">Shop not found</div>;
  }
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{shop.name} Products</h1>
          <p className="text-muted-foreground">Manage products for this shop</p>
        </div>
        
        {canManageShop && (
          <Button onClick={() => setShowAddProductDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product to Shop
          </Button>
        )}
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Product Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-1">No Products Found</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                {searchTerm
                  ? "No products match your search. Try a different search term."
                  : "This shop doesn't have any products yet. Add products to get started."}
              </p>
              {canManageShop && !searchTerm && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setShowAddProductDialog(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              )}
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    {canManageShop && <TableHead></TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => {
                    const inventoryData = getProductInventoryData(product.id);
                    const isLowStock = inventoryData.quantity <= inventoryData.minStockLevel && inventoryData.quantity > 0;
                    const isOutOfStock = inventoryData.quantity === 0;
                    const isExpired = product.expiryDate && new Date(product.expiryDate) < new Date();
                    
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-md flex items-center justify-center bg-gray-100">
                              {product.image ? (
                                <img 
                                  src={product.image} 
                                  alt={product.name} 
                                  className="h-full w-full rounded-md object-cover"
                                />
                              ) : (
                                <Package className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-xs text-muted-foreground">{product.category}</div>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                        
                        <TableCell>₹{product.price.toFixed(2)}</TableCell>
                        
                        <TableCell>
                          <div className="font-medium">
                            {inventoryData.quantity}{" "}
                            {inventoryData.quantity <= inventoryData.minStockLevel && inventoryData.quantity > 0 && (
                              <AlertCircle className="inline h-4 w-4 text-amber-500 ml-1" />
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Min: {inventoryData.minStockLevel}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          {isExpired ? (
                            <Badge variant="outline" className="bg-red-100 text-red-700">
                              Expired
                            </Badge>
                          ) : isOutOfStock ? (
                            <Badge variant="outline" className="bg-orange-100 text-orange-700">
                              Out of Stock
                            </Badge>
                          ) : isLowStock ? (
                            <Badge variant="outline" className="bg-amber-100 text-amber-700">
                              Low Stock
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-green-100 text-green-700">
                              In Stock
                            </Badge>
                          )}
                        </TableCell>
                        
                        {canManageShop && (
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveProduct(product.id)}
                              className="text-destructive hover:text-destructive/80"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Product Dialog */}
      <Dialog open={showAddProductDialog} onOpenChange={setShowAddProductDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Product to {shop.name}</DialogTitle>
            <DialogDescription>
              Select a product and specify the quantity to add to this shop's inventory.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="product" className="text-sm font-medium">
                Product
              </label>
              <Select onValueChange={setSelectedProductId} value={selectedProductId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {availableProducts.length === 0 ? (
                    <div className="p-2 text-center text-sm">
                      All products are already in this shop
                    </div>
                  ) : (
                    availableProducts.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - {product.sku}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="quantity" className="text-sm font-medium">
                Quantity
              </label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={productQuantity}
                onChange={(e) => setProductQuantity(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAddProductDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddProductToShop}
              disabled={!selectedProductId || productQuantity < 1 || availableProducts.length === 0}
            >
              Add to Inventory
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShopProductsPage; 