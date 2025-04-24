
import React from "react";
import { useData } from "@/lib/data-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { BellAlert } from "lucide-react";

const LowStockWarnings: React.FC = () => {
  const { products } = useData();
  const lowStockProducts = products.filter((product) => product.stock < 20);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BellAlert className="h-5 w-5" />
          Low Stock Warnings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lowStockProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No low stock warnings</p>
          ) : (
            lowStockProducts.map((product) => (
              <Alert key={product.id}>
                <AlertTitle className="font-semibold">
                  {product.name} - {product.stock} units left
                </AlertTitle>
                <AlertDescription className="text-sm">
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <span>SKU: {product.sku}</span>
                    <span>Category: {product.category}</span>
                  </div>
                </AlertDescription>
              </Alert>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LowStockWarnings;
