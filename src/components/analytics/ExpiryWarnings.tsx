
import React from "react";
import { useData } from "@/lib/data-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CalendarClock } from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";

const ExpiryWarnings: React.FC = () => {
  const { products } = useData();
  const today = new Date();
  
  const soonToExpireProducts = products.filter((product) => {
    if (!product.expiryDate) return false;
    const daysUntilExpiry = differenceInDays(
      parseISO(product.expiryDate),
      today
    );
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5" />
          Expiring Soon
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {soonToExpireProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No products expiring soon
            </p>
          ) : (
            soonToExpireProducts.map((product) => (
              <Alert key={product.id}>
                <AlertTitle className="font-semibold">
                  {product.name} - Expires in{" "}
                  {differenceInDays(parseISO(product.expiryDate!), today)} days
                </AlertTitle>
                <AlertDescription className="text-sm">
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <span>SKU: {product.sku}</span>
                    <span>
                      Expiry Date:{" "}
                      {new Date(product.expiryDate!).toLocaleDateString()}
                    </span>
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

export default ExpiryWarnings;
