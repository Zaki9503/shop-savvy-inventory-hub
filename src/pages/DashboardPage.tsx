import React from "react";
import { useAuth } from "@/lib/auth-context";
import { useData } from "@/lib/data-context";
import StatCard from "@/components/dashboard/StatCard";
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
    customers 
  } = useData();
  
  // For managers, filter data by their shop
  const isShopManager = user?.role === "manager" && user?.shopId;
  
  // Filter sales by shop if the user is a manager
  const filteredSales = isShopManager 
    ? sales.filter(sale => sale.shopId === user.shopId) 
    : sales;
  
  // Calculate total sales by type
  const cashPayments = filteredSales
    .filter(sale => sale.saleType === "cash")
    .reduce((sum, sale) => sum + sale.total, 0);
    
  const onlinePayments = filteredSales
    .filter(sale => sale.saleType === "online")
    .reduce((sum, sale) => sum + sale.total, 0);
  
  const totalSales = cashPayments + onlinePayments;
  
  // Get shops to display
  const displayShops = isShopManager
    ? shops.filter(shop => shop.id === user.shopId)
    : shops;

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
      </div>
      
      {/* Sales by Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Cash Payments</h3>
          <p className="text-3xl font-bold text-primary">${cashPayments.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">
            {Math.round((cashPayments / totalSales) * 100)}% of total sales
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Online Payments</h3>
          <p className="text-3xl font-bold text-inventory-DEFAULT">${onlinePayments.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">
            {Math.round((onlinePayments / totalSales) * 100)}% of total sales
          </p>
        </div>
      </div>
      
      {/* Products Sold Chart */}
      <div className="grid grid-cols-1">
        <SalesChart />
      </div>
    </div>
  );
};

export default DashboardPage;
