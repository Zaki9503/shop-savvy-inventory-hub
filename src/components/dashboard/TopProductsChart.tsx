import React, { useMemo } from "react";
import {
  Line,
  LineChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useData } from "@/lib/data-context";

const TopProductsChart = () => {
  const { sales, products } = useData();

  // Process sales data to get top 3 products
  const topProductsData = useMemo(() => {
    // Count total quantity sold for each product
    const productSales = new Map<string, number>();
    
    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        const currentTotal = productSales.get(item.productId) || 0;
        productSales.set(item.productId, currentTotal + item.quantity);
      });
    });

    // Get top 3 products by quantity sold
    const topProducts = Array.from(productSales.entries())
      .map(([productId, quantity]) => {
        const product = products.find(p => p.id === productId);
        return {
          id: productId,
          name: product?.name || 'Unknown Product',
          quantity
        };
      })
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 3);

    // Generate data points for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    return last7Days.map(date => {
      const dayData: any = { date: date.toLocaleDateString() };
      
      topProducts.forEach(product => {
        const daySales = sales
          .filter(sale => {
            const saleDate = new Date(sale.createdAt);
            return saleDate.toDateString() === date.toDateString();
          })
          .reduce((total, sale) => {
            const item = sale.items.find(item => item.productId === product.id);
            return total + (item?.quantity || 0);
          }, 0);
        
        dayData[product.name] = daySales;
      });

      return dayData;
    });
  }, [sales, products]);

  const colors = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Top 3 Products Sales Trend</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={topProductsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {topProductsData.length > 0 && Object.keys(topProductsData[0])
              .filter(key => key !== 'date')
              .map((productName, index) => (
                <Line
                  key={productName}
                  type="monotone"
                  dataKey={productName}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopProductsChart; 