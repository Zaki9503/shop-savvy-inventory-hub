import React from "react";
import { useData } from "@/lib/data-context";
import TopProductsChart from "@/components/dashboard/TopProductsChart";
import InventoryStatusCard from "@/components/dashboard/InventoryStatusCard";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";

const DashboardPage = () => {
  const { shops, sales, inventory, products } = useData();

  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalShops = shops.length;

  // Calculate inventory status for each shop
  const getShopInventoryStatus = (shopId) => {
    const shopInventory = inventory.filter(item => item.shopId === shopId);
    
    // Count items with low stock (quantity <= minStockLevel but > 0)
    const lowStockCount = shopInventory.filter(
      item => item.quantity <= item.minStockLevel && item.quantity > 0
    ).length;
    
    // Count items out of stock (quantity = 0)
    const outOfStockCount = shopInventory.filter(
      item => item.quantity === 0
    ).length;
    
    return { lowStockCount, outOfStockCount };
  };

  // Navigate to shop products page
  const navigateToShopProducts = (shopId) => {
    window.location.href = `/dashboard/stores/${shopId}/products`;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">Total Sales</h3>
          <p className="text-3xl font-bold">₹{totalSales.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-2">Total Shops</h3>
          <p className="text-3xl font-bold">{totalShops}</p>
        </div>
      </div>

      {/* Inventory Status for Each Shop */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Inventory Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shops.map(shop => {
            const { lowStockCount, outOfStockCount } = getShopInventoryStatus(shop.id);
            return (
              <InventoryStatusCard
                key={shop.id}
                shopId={shop.id}
                shopName={shop.name}
                lowStockCount={lowStockCount}
                outOfStockCount={outOfStockCount}
                onShopClick={navigateToShopProducts}
              />
            );
          })}
        </div>
      </div>

      {/* Top Products Chart */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Top Products</h2>
        <TopProductsChart />
      </div>
    </div>
  );
};

export default DashboardPage; 