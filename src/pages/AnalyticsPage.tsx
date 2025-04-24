
import React from "react";
import { useData } from "@/lib/data-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LowStockWarnings from "@/components/analytics/LowStockWarnings";
import ExpiryWarnings from "@/components/analytics/ExpiryWarnings";

const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Analytics & Warnings</h1>
        <p className="text-muted-foreground">
          Monitor low stock levels and upcoming product expirations
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <LowStockWarnings />
        <ExpiryWarnings />
      </div>
    </div>
  );
};

export default AnalyticsPage;
