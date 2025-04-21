
import React from "react";
import { cn } from "@/lib/utils";
import { Package } from "lucide-react";

interface InventoryStatusCardProps {
  shopName: string;
  lowStockCount: number;
  outOfStockCount: number;
  className?: string;
}

export const InventoryStatusCard: React.FC<InventoryStatusCardProps> = ({
  shopName,
  lowStockCount,
  outOfStockCount,
  className,
}) => {
  return (
    <div className={cn(
      "bg-white rounded-xl shadow-sm p-6", 
      className
    )}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-700">{shopName}</h3>
        <div className="bg-blue-100 text-blue-800 p-2 rounded-md">
          <Package className="h-4 w-4" />
        </div>
      </div>
      
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Low Stock Items</span>
          <span className={cn(
            "text-sm font-medium px-2 py-1 rounded-full",
            lowStockCount > 0 ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"
          )}>
            {lowStockCount}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Out of Stock</span>
          <span className={cn(
            "text-sm font-medium px-2 py-1 rounded-full",
            outOfStockCount > 0 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
          )}>
            {outOfStockCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InventoryStatusCard;
