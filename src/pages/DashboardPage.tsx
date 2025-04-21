
import React from "react";
import { useAuth } from "@/lib/auth-context";
import { useData } from "@/lib/data-context";
import StatCard from "@/components/dashboard/StatCard";
import InventoryStatusCard from "@/components/dashboard/InventoryStatusCard";
import SalesChart from "@/components/dashboard/SalesChart";
import { 
  ShoppingBag, 
  Store, 
  Package, 
  Users 
} from "lucide-react";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    shops, 
    products,
    sales, 
    customers, 
    inventory,
    getShopInventory,
  } = useData();
  
  // For managers, filter data by their shop
  const isShopManager = user?.role === "manager" && user?.shopId;
  
  // Filter sales by shop if the user is a manager
  const filteredSales = isShopManager 
    ? sales.filter(sale => sale.shopId === user.shopId) 
    : sales;
  
  // Calculate total sales by type
  const cashSales = filteredSales
    .filter(sale => sale.saleType === "cash")
    .reduce((sum, sale) => sum + sale.total, 0);
    
  const creditSales = filteredSales
    .filter(sale => sale.saleType === "credit")
    .reduce((sum, sale) => sum + sale.total, 0);
    
  const leaseSales = filteredSales
    .filter(sale => sale.saleType === "lease")
    .reduce((sum, sale) => sum + sale.total, 0);
  
  const totalSales = cashSales + creditSales + leaseSales;
  
  // Get shops to display
  const displayShops = isShopManager
    ? shops.filter(shop => shop.id === user.shopId)
    : shops;
  
  // Calculate inventory status for each shop
  const getInventoryStatus = (shopId: string) => {
    const shopInventory = getShopInventory(shopId);
    const lowStock = shopInventory.filter(
      item => item.quantity > 0 && item.quantity <= item.minStockLevel
    ).length;
    const outOfStock = shopInventory.filter(item => item.quantity === 0).length;
    
    return { lowStock, outOfStock };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back, {user?.name}</p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Sales"
          value={`$${totalSales.toFixed(2)}`}
          icon={<ShoppingBag className="h-6 w-6 text-primary" />}
          trend={{ value: 12.5, isPositive: true }}
        />
        
        <StatCard 
          title="Shop Locations"
          value={isShopManager ? 1 : shops.length}
          icon={<Store className="h-6 w-6 text-inventory-DEFAULT" />}
        />
        
        <StatCard 
          title="Products"
          value={products.length}
          icon={<Package className="h-6 w-6 text-sales-DEFAULT" />}
        />
        
        <StatCard 
          title="Customers"
          value={customers.length}
          icon={<Users className="h-6 w-6 text-warning-DEFAULT" />}
          trend={{ value: 8.2, isPositive: true }}
        />
      </div>
      
      {/* Sales by Type */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Cash Sales</h3>
          <p className="text-3xl font-bold text-primary">${cashSales.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">
            {Math.round((cashSales / totalSales) * 100)}% of total sales
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Credit Sales</h3>
          <p className="text-3xl font-bold text-inventory-DEFAULT">${creditSales.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">
            {Math.round((creditSales / totalSales) * 100)}% of total sales
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Lease Sales</h3>
          <p className="text-3xl font-bold text-sales-DEFAULT">${leaseSales.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">
            {Math.round((leaseSales / totalSales) * 100)}% of total sales
          </p>
        </div>
      </div>
      
      {/* Sales Chart and Inventory Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart sales={filteredSales} />
        </div>
        
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Inventory Status</h3>
          
          {displayShops.map(shop => {
            const { lowStock, outOfStock } = getInventoryStatus(shop.id);
            return (
              <InventoryStatusCard 
                key={shop.id}
                shopName={shop.name}
                lowStockCount={lowStock}
                outOfStockCount={outOfStock}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
