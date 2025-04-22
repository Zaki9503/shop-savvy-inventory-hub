
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Sale, Shop } from "@/lib/types";

interface SalesChartProps {
  sales: Sale[];
  shops: Shop[];
}

// Helper function to group product quantities by date and shop
const groupProductsByDateAndShop = (sales: Sale[], shops: Shop[], days = 7) => {
  const data: Record<string, { date: string } & Record<string, number>> = {};
  
  // Get the last 'days' days
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days + 1);
  
  // Initialize data structure with dates
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    data[dateStr] = { 
      date: dateStr,
      ...Object.fromEntries(shops.map(shop => [shop.name, 0]))
    };
  }
  
  // Aggregate product quantities by date and shop
  sales.forEach(sale => {
    const dateStr = new Date(sale.createdAt).toISOString().split('T')[0];
    if (data[dateStr]) {
      const shop = shops.find(s => s.id === sale.shopId);
      if (shop) {
        const totalQuantity = sale.items.reduce((sum, item) => sum + item.quantity, 0);
        data[dateStr][shop.name] += totalQuantity;
      }
    }
  });
  
  // Convert to array and sort by date
  return Object.values(data).sort((a, b) => a.date.localeCompare(b.date));
};

export const SalesChart: React.FC<SalesChartProps> = ({ sales, shops }) => {
  const data = groupProductsByDateAndShop(sales, shops);
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  // Generate a unique color for each shop
  const colors = ['#2563eb', '#0ea5e9', '#14b8a6'];
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Products Sold by Store (Last 7 Days)</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickFormatter={formatDate} />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => [`${value} units`, null]}
              labelFormatter={(label) => formatDate(label as string)}
            />
            <Legend />
            {shops.map((shop, index) => (
              <Line
                key={shop.id}
                type="monotone"
                dataKey={shop.name}
                name={`${shop.name}`}
                stroke={colors[index % colors.length]}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
