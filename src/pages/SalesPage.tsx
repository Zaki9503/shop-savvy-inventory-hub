import React, { useState } from "react";
import { useData } from "@/lib/data-context";
import { useAuth } from "@/lib/auth-context";
import { ShoppingBag, Plus, Search, Filter, ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Sale, SaleType } from "@/lib/types";
import SaleDetailsModal from "@/components/sales/SaleDetailsModal";
import NewSaleForm from "@/components/sales/NewSaleForm";

const SalesPage: React.FC = () => {
  const { sales, shops, getShop, products, activeShopId } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Sale>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterType, setFilterType] = useState<SaleType | "all">("all");

  // Modal state
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  // New sale form state
  const [showNewSaleForm, setShowNewSaleForm] = useState(false);

  // Determine if user is admin or sub-admin
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";
  const isSubAdmin = user?.role === "sub_admin" || user?.role === "manager";
  
  // Get user's assigned shop
  const userShopId = user?.shopId;
  
  // Get shop name for display
  const getAssignedShopName = () => {
    if (!userShopId) return "";
    const shop = shops.find(s => s.id === userShopId);
    return shop ? shop.name : "Unknown Shop";
  };

  // Filter sales based on user role and shop assignment
  const filteredSales = sales
    .filter(sale => {
      // For sub-admin, only show sales from their shop
      if (isSubAdmin && userShopId) {
        if (sale.shopId !== userShopId) {
          return false;
        }
      }
      
      // Filter by search term
      if (searchTerm !== "") {
        const matchesSaleId = sale.id.toLowerCase().includes(searchTerm.toLowerCase());
        const shopName = getShop(sale.shopId)?.name.toLowerCase() || "";
        const matchesShopName = shopName.includes(searchTerm.toLowerCase());
        
        if (!matchesSaleId && !matchesShopName) {
          return false;
        }
      }
      
      // Filter by sale type
      if (filterType !== "all" && sale.saleType !== filterType) {
        return false;
      }
      
      return true;
    })
    // Sort results
    .sort((a, b) => {
      if (sortField === "createdAt") {
        return sortDirection === "asc"
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }

      if (sortField === "total") {
        return sortDirection === "asc"
          ? a.total - b.total
          : b.total - a.total;
      }

      return 0;
    });

  const handleSort = (field: keyof Sale) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSaleComplete = () => {
    setShowNewSaleForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
          {isSubAdmin && userShopId ? (
            <p className="text-gray-500">Managing sales for {getAssignedShopName()}</p>
          ) : (
            <p className="text-gray-500">Manage and track your sales across all shops</p>
          )}
        </div>

        <Button 
          className="flex items-center gap-2"
          onClick={() => setShowNewSaleForm(true)}
        >
          <Plus className="h-4 w-4" />
          <span>New Sale</span>
        </Button>
      </div>
      
      {showNewSaleForm ? (
        <NewSaleForm onSaleComplete={handleSaleComplete} />
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search sales..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <select
                  className="h-9 rounded-md border border-input px-3 py-1 text-sm"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as SaleType | "all")}
                >
                  <option value="all">All Types</option>
                  <option value="cash">Cash</option>
                  <option value="online">Online</option>
                </select>

                {isAdmin && (
                  <select className="h-9 rounded-md border border-input px-3 py-1 text-sm">
                    <option value="">All Shops</option>
                    {shops.map(shop => (
                      <option key={shop.id} value={shop.id}>{shop.name}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sale ID</TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("createdAt")}
                    >
                      <div className="flex items-center gap-2">
                        <span>Date</span>
                        {sortField === "createdAt" && (
                          sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                        )}
                      </div>
                    </TableHead>
                    {isAdmin && <TableHead>Shop</TableHead>}
                    <TableHead>Type</TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("total")}
                    >
                      <div className="flex items-center gap-2">
                        <span>Amount</span>
                        {sortField === "total" && (
                          sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={isAdmin ? 7 : 6} className="h-24 text-center">
                        No sales found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSales.map((sale) => {
                      const shop = getShop(sale.shopId);

                      return (
                        <TableRow key={sale.id}>
                          <TableCell className="font-mono text-sm">{sale.id}</TableCell>
                          <TableCell>{formatDate(sale.createdAt)}</TableCell>
                          {isAdmin && (
                            <TableCell>
                              {shop?.name || "Unknown Shop"}
                            </TableCell>
                          )}
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                sale.saleType === "cash"
                                  ? "border-primary text-primary bg-primary/10"
                                  : "border-inventory-DEFAULT text-inventory-DEFAULT bg-inventory-DEFAULT/10"
                              }
                            >
                              {sale.saleType.charAt(0).toUpperCase() + sale.saleType.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">₹{sale.total.toFixed(2)}</span>
                              {sale.balance > 0 && (
                                <span className="text-xs text-red-500">Due: ₹{sale.balance.toFixed(2)}</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={sale.status === "completed" ? "default" : "outline"}>
                              {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm"
                              onClick={() => {
                                setSelectedSale(sale);
                                setModalOpen(true);
                              }}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
      <SaleDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sale={selectedSale}
        products={products}
      />
    </div>
  );
};

export default SalesPage;
