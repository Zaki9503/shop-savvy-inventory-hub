
import React, { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Import necessary hooks and contexts
import { useData } from "@/lib/data-context";

const SalesChart = () => {
  const { sales } = useData();

  // Process sales data for charts
  const chartData = useMemo(() => {
    const last7Days = new Map<string, {date: string, total: number}>();
    const today = new Date();

    // Create entries for the last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      last7Days.set(dateStr, {date: dateStr, total: 0});
    }

    // Sum up sales per day
    sales.forEach((sale) => {
      const saleDate = new Date(sale.createdAt);
      const dateStr = saleDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      
      // Only consider sales from the last 7 days
      if (last7Days.has(dateStr)) {
        const existingData = last7Days.get(dateStr);
        if (existingData) {
          last7Days.set(dateStr, {
            ...existingData,
            total: existingData.total + sale.total,
          });
        }
      }
    });

    return Array.from(last7Days.values());
  }, [sales]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Area Chart for Sales Trend */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <h3 className="font-semibold text-lg">Sales Trend</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bar Chart for Sales by Method */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <h3 className="font-semibold text-lg">Sales by Method</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" name="Total Sales" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;
