import React, { useState } from "react";
import { useData } from "@/lib/data-context";
import { useAuth } from "@/lib/auth-context";
import { Product, SaleItem, SaleType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShoppingBag, Plus, Minus, Search, QrCode, CreditCard, Banknote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRCodeDisplay from "./QRCodeDisplay";

interface NewSaleFormProps {
  onSaleComplete: () => void;
}

const NewSaleForm: React.FC<NewSaleFormProps> = ({ onSaleComplete }) => {
  const { products, addSale, getProduct } = useData();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [skuInput, setSkuInput] = useState("");
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [saleType, setSaleType] = useState<SaleType>("cash");
  const [showQrCode, setShowQrCode] = useState(false);
  
  const totalAmount = saleItems.reduce((sum, item) => sum + item.total, 0);
  
  const handleSkuSearch = () => {
    if (!skuInput.trim()) return;
    
    // Find product by SKU
    const product = products.find(p => p.sku.toLowerCase() === skuInput.toLowerCase());
    
    if (!product) {
      toast({
        title: "Product not found",
        description: `No product found with SKU: ${skuInput}`,
        variant: "destructive",
      });
      return;
    }
    
    // Check if product is already in the list
    const existingItemIndex = saleItems.findIndex(item => item.productId === product.id);
    
    if (existingItemIndex >= 0) {
      // Increase quantity of existing item
      const updatedItems = [...saleItems];
      updatedItems[existingItemIndex].quantity += 1;
      updatedItems[existingItemIndex].total = updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].price;
      setSaleItems(updatedItems);
    } else {
      // Add new item
      const newItem: SaleItem = {
        productId: product.id,
        quantity: 1,
        price: product.price,
        total: product.price,
      };
      setSaleItems([...saleItems, newItem]);
    }
    
    // Clear input
    setSkuInput("");
    
    toast({
      title: "Product added",
      description: `${product.name} added to sale`,
    });
  };
  
  const handleQuantityChange = (index: number, change: number) => {
    const updatedItems = [...saleItems];
    const newQuantity = Math.max(1, updatedItems[index].quantity + change);
    updatedItems[index].quantity = newQuantity;
    updatedItems[index].total = newQuantity * updatedItems[index].price;
    setSaleItems(updatedItems);
  };
  
  const handleRemoveItem = (index: number) => {
    const updatedItems = [...saleItems];
    updatedItems.splice(index, 1);
    setSaleItems(updatedItems);
  };
  
  const handleCompleteSale = () => {
    if (saleItems.length === 0) {
      toast({
        title: "Cannot complete sale",
        description: "Add at least one product to the sale",
        variant: "destructive",
      });
      return;
    }
    
    if (saleType === "online") {
      setShowQrCode(true);
      return;
    }
    
    // Complete the sale for cash payment
    submitSale();
  };
  
  const submitSale = () => {
    if (!user) return;
    
    const newSale = {
      shopId: user.shopId || "shop1", // Default to first shop if user has no shop assigned
      saleType,
      items: saleItems,
      total: totalAmount,
      paid: totalAmount, // Assume full payment for now
      balance: 0,
      createdBy: user.id,
      status: "completed" as const,
    };
    
    addSale(newSale);
    
    toast({
      title: "Sale completed",
      description: `Total amount: $${totalAmount.toFixed(2)}`,
    });
    
    // Reset form
    setSaleItems([]);
    setSaleType("cash");
    setShowQrCode(false);
    
    // Notify parent component
    onSaleComplete();
  };
  
  const handlePaymentConfirmed = () => {
    setShowQrCode(false);
    submitSale();
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          <span>New Sale</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Enter product SKU..."
                value={skuInput}
                onChange={(e) => setSkuInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSkuSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSkuSearch}>Add</Button>
          </div>
          
          {saleItems.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {saleItems.map((item, index) => {
                    const product = getProduct(item.productId);
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{product?.name}</span>
                            <span className="text-xs text-gray-500">{product?.sku}</span>
                          </div>
                        </TableCell>
                        <TableCell>₹{item.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleQuantityChange(index, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleQuantityChange(index, 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">₹{item.total.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(index)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="rounded-md border border-dashed p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-2 text-lg font-semibold">Empty Cart</h3>
              <p className="text-sm text-gray-500">Add products by entering SKU codes</p>
            </div>
          )}
        </div>
      </CardContent>
      
      {saleItems.length > 0 && (
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex items-center justify-between w-full">
            <span className="text-lg font-semibold">Total Amount:</span>
            <span className="text-2xl font-bold">₹{totalAmount.toFixed(2)}</span>
          </div>
          
          <Tabs
            defaultValue="cash"
            className="w-full"
            value={saleType}
            onValueChange={(value) => setSaleType(value as SaleType)}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cash" className="flex items-center gap-2">
                <Banknote className="h-4 w-4" />
                Cash Payment
              </TabsTrigger>
              <TabsTrigger value="online" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Online Payment
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button
            className="w-full"
            size="lg"
            onClick={handleCompleteSale}
          >
            {saleType === 'online' ? 'Proceed to Pay' : 'Complete Sale'}
          </Button>
        </CardFooter>
      )}
      
      <Dialog open={showQrCode} onOpenChange={setShowQrCode}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan QR Code for Payment</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <QRCodeDisplay size={250} />
            <p className="text-center text-sm">
              Amount: <span className="font-bold">₹{totalAmount.toFixed(2)}</span>
            </p>
            <Button onClick={handlePaymentConfirmed}>
              Payment Confirmed
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default NewSaleForm;
