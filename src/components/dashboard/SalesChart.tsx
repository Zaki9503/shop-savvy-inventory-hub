
import React, { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { useData } from "@/lib/data-context";

const COLORS = ["#0088FE", "#00C49F"];

const SalesChart = () => {
  const { sales } = useData();

  // Process sales data for average daily sales
  const averageDailySales = useMemo(() => {
    const dailySales = new Map<number, { day: number; total: number; count: number }>();
    
    sales.forEach((sale) => {
      const date = new Date(sale.createdAt);
      const day = date.getDate();
      
      const current = dailySales.get(day) || { day, total: 0, count: 0 };
      dailySales.set(day, {
        day,
        total: current.total + sale.total,
        count: current.count + 1
      });
    });

    return Array.from(dailySales.values())
      .map(({ day, total, count }) => ({
        day,
        average: total / count
      }))
      .sort((a, b) => a.day - b.day);
  }, [sales]);

  // Process sales data for payment methods
  const paymentData = useMemo(() => {
    const totals = {
      cash: 0,
      online: 0
    };

    sales.forEach((sale) => {
      if (sale.saleType === "cash") {
        totals.cash += sale.total;
      } else if (sale.saleType === "online") {
        totals.online += sale.total;
      }
    });

    return [
      { name: "Cash", value: totals.cash },
      { name: "Online", value: totals.online }
    ];
  }, [sales]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Average Daily Sales Line Chart */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <h3 className="font-semibold text-lg">Average Daily Sales</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={averageDailySales}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => `$${Number(value).toFixed(2)}`}
                  labelFormatter={(label) => `Day ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="average"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Payment Methods Pie Chart */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <h3 className="font-semibold text-lg">Payment Methods Distribution</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `$${Number(value).toFixed(2)}`}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;
