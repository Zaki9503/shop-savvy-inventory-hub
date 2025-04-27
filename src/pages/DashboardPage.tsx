import React, { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useData } from "@/lib/data-context";
import StatCard from "@/components/dashboard/StatCard";
import { 
  ShoppingBag, 
  Package,
  Store
} from "lucide-react";
import TopProductsChart from "@/components/dashboard/TopProductsChart";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    products,
    sales,
    shops,
    setActiveShop
  } = useData();
  
  // For managers or sub admins, filter data by their shop
  const isShopManager = (user?.role === "manager" || user?.role === "sub_admin") && user?.shopId;
  
  // Find the user's assigned shop if they are a sub_admin
  const userShop = isShopManager 
    ? shops.find(shop => shop.id === user.shopId) 
    : null;
  
  // Set the active shop for sub-admin users
  useEffect(() => {
    if (isShopManager && user?.shopId) {
      setActiveShop(user.shopId);
    }
  }, [isShopManager, user?.shopId, setActiveShop]);
  
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome back, {user?.name || user?.username}</p>
      </div>
      
      {/* Store Header for Sub Admin */}
      {userShop && (
        <div className="bg-primary/10 rounded-xl p-6 flex items-center space-x-4">
          <div className="bg-primary/20 rounded-full p-3">
            <Store className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{userShop.name}</h2>
            <p className="text-sm text-muted-foreground">
              {userShop.address} • Store #{userShop.storeNumber}
            </p>
          </div>
        </div>
      )}
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard 
          title="Total Sales"
          value={`₹${totalSales.toFixed(2)}`}
          icon={<ShoppingBag className="h-6 w-6 text-primary" />}
          trend={{ value: 12.5, isPositive: true }}
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
          <p className="text-3xl font-bold text-primary">₹{cashPayments.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">
            {totalSales > 0 ? Math.round((cashPayments / totalSales) * 100) : 0}% of total sales
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Online Payments</h3>
          <p className="text-3xl font-bold text-inventory-DEFAULT">₹{onlinePayments.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">
            {totalSales > 0 ? Math.round((onlinePayments / totalSales) * 100) : 0}% of total sales
          </p>
        </div>
      </div>
      
      {/* Top Products Chart */}
      <div className="grid grid-cols-1">
        <TopProductsChart />
      </div>
    </div>
  );
};

export default DashboardPage;
