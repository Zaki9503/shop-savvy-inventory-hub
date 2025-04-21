
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Sale } from "@/lib/types";

interface SalesChartProps {
  sales: Sale[];
}

// Helper function to group sales by date
const groupSalesByDate = (sales: Sale[], days = 7) => {
  const data: Record<string, { date: string; cash: number; credit: number; lease: number }> = {};
  
  // Get the last 'days' days
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days + 1);
  
  // Initialize data structure with dates
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    data[dateStr] = { date: dateStr, cash: 0, credit: 0, lease: 0 };
  }
  
  // Aggregate sales by date and type
  sales.forEach(sale => {
    const dateStr = new Date(sale.createdAt).toISOString().split('T')[0];
    if (data[dateStr]) {
      data[dateStr][sale.saleType] += sale.total;
    }
  });
  
  // Convert to array and sort by date
  return Object.values(data).sort((a, b) => a.date.localeCompare(b.date));
};

export const SalesChart: React.FC<SalesChartProps> = ({ sales }) => {
  const data = groupSalesByDate(sales);
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Sales Trend (Last 7 Days)</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickFormatter={formatDate} />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => [`$${value.toFixed(2)}`, null]}
              labelFormatter={(label) => formatDate(label as string)}
            />
            <Legend />
            <Bar dataKey="cash" name="Cash Sales" fill="#2563eb" radius={[4, 4, 0, 0]} />
            <Bar dataKey="credit" name="Credit Sales" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            <Bar dataKey="lease" name="Lease Sales" fill="#14b8a6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;
