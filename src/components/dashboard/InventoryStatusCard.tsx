import React from "react";
import { cn } from "@/lib/utils";
import { Store } from "lucide-react";

interface InventoryStatusCardProps {
  shopId?: string;
  shopName: string;
  lowStockCount: number;
  outOfStockCount: number;
  onShopClick?: (shopId: string) => void;
}

const InventoryStatusCard: React.FC<InventoryStatusCardProps> = ({
  shopId,
  shopName,
  lowStockCount,
  outOfStockCount,
  onShopClick
}) => {
  const hasStockIssues = lowStockCount > 0 || outOfStockCount > 0;
  
  return (
    <div 
      className={cn(
        "bg-white rounded-lg border p-4 shadow-sm",
        shopId && onShopClick && "cursor-pointer hover:shadow-md transition-shadow"
      )}
      onClick={() => {
        if (shopId && onShopClick) {
          onShopClick(shopId);
        }
      }}
    >
      <div className="flex items-center mb-4">
        <div className="p-2 rounded-full bg-primary/10 mr-3">
          <Store className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium">{shopName}</h3>
          <p className="text-xs text-muted-foreground">
            Inventory Status
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm">Low Stock Items</span>
          <span className={cn(
            "font-medium",
            lowStockCount > 0 && "text-amber-600"
          )}>
            {lowStockCount}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm">Out of Stock Items</span>
          <span className={cn(
            "font-medium",
            outOfStockCount > 0 && "text-red-600"
          )}>
            {outOfStockCount}
          </span>
        </div>
        
        <div className="text-xs mt-2 text-right text-muted-foreground">
          {hasStockIssues 
            ? lowStockCount + outOfStockCount === 1 
              ? "1 item needs attention" 
              : `${lowStockCount + outOfStockCount} items need attention`
            : "All items in stock"
          }
        </div>
      </div>
    </div>
  );
};

export default InventoryStatusCard;
