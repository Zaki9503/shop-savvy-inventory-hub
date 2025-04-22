import React, { useState } from "react";
import { useData } from "@/lib/data-context";
import { Shop, User } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, Plus, Building, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import ShopDetailModal from "./ShopDetailModal";

// Mock users to simulate shop managers and workers (replace with your real users data as needed)
const MOCK_USERS: User[] = [
  {
    id: "2",
    name: "Alice Manager",
    email: "alice.manager@shopsavvy.com",
    role: "manager",
    shopId: "shop1",
    phone: "555-232-3434",
    address: "123 Main St, Downtown",
    avatar: "",
    idProof: ""
  },
  {
    id: "3",
    name: "Bob Worker",
    email: "bob.worker@shopsavvy.com",
    role: "staff",
    shopId: "shop1",
    phone: "555-878-2020",
    address: "223 Worker St, Downtown",
    avatar: "",
    idProof: ""
  },
  {
    id: "4",
    name: "Clara Worker",
    email: "clara.worker@shopsavvy.com",
    role: "staff",
    shopId: "shop2",
    phone: "555-908-4848",
    address: "17 Tower Lane, Uptown",
    avatar: "",
    idProof: ""
  }
];

const getCityFromAddress = (address: string) => {
  // Very simple city extraction (get last word after comma)
  if (!address) return "";
  const parts = address.split(",");
  return parts.length > 1 ? parts[parts.length - 1].trim() : "";
};

const ShopList: React.FC = () => {
  const { shops, addShop, deleteShop, activeShopId, setActiveShop } = useData();
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Inputs for adding a shop
  const [name, setName] = useState("");
  const [shopNo, setShopNo] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [managerName, setManagerName] = useState("");

  const openDetail = (shop: Shop) => {
    setSelectedShop(shop);
    setModalOpen(true);
  };

  const closeDetail = () => {
    setModalOpen(false);
    setSelectedShop(null);
  };

  // Find manager/workers for the selected shop
  const getManagerAndWorkers = (shop: Shop) => {
    const manager = MOCK_USERS.find(u => u.role === "manager" && u.shopId === shop.id) || null;
    const workers = MOCK_USERS.filter(u => u.role === "staff" && u.shopId === shop.id);
    return { manager, workers };
  };

  const handleAddShop = () => {
    if (!name || !shopNo || !address) return;
    addShop({ name, shopNo, address, phone, managerName } as any);
    setName("");
    setShopNo("");
    setAddress("");
    setPhone("");
    setManagerName("");
  };

  const handleDeleteShop = (id: string) => {
    deleteShop(id);
    if (activeShopId === id) {
      setActiveShop(""); // Use setActiveShop instead of setActiveShopId
    }
    if (selectedShop && selectedShop.id === id) {
      closeDetail();
    }
  };

  const handleShopClick = (shop: Shop) => {
    setActiveShop(shop.id);
    setSelectedShop(shop);
    setModalOpen(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="text-muted-foreground" />
            Manage Shops
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end"
            onSubmit={e => {
              e.preventDefault();
              handleAddShop();
            }}
          >
            <div>
              <Input placeholder="Shop Name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <Input placeholder="Shop Number" value={shopNo} onChange={e => setShopNo(e.target.value)} required />
            </div>
            <div>
              <Input placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} required />
            </div>
            <div>
              <Input placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div>
              <Input placeholder="Manager Name" value={managerName} onChange={e => setManagerName(e.target.value)} />
            </div>
            <div className="md:col-span-5 flex justify-end mt-1">
              <Button type="submit" size="sm" className="gap-2">
                <Plus size={18} /> Add Shop
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shops.map(shop => (
          <Card 
            key={shop.id} 
            className={cn(
              "hover:ring-2 transition-all relative cursor-pointer",
              activeShopId === shop.id 
                ? "ring-2 ring-green-500 bg-green-50"
                : "hover:ring-primary"
            )}
          >
            <button
              className="w-full text-left px-6 py-4 focus-visible:outline-none"
              onClick={() => handleShopClick(shop)}
            >
              <div className="font-semibold text-lg flex gap-2 items-center">
                <Home className={cn(
                  "inline mr-1",
                  activeShopId === shop.id ? "text-green-500" : "text-muted-foreground"
                )} />
                {shop.name}
              </div>
              <div className="text-xs text-muted-foreground">
                Shop No: {shop.shopNo}
              </div>
              <div className="text-xs">Address: {shop.address}</div>
              <div className="text-xs">City: {getCityFromAddress(shop.address)}</div>
            </button>
            <Button
              size="icon"
              variant="destructive"
              className="absolute top-2 right-2"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteShop(shop.id);
              }}
              aria-label="Delete Shop"
            >
              <Trash size={18} />
            </Button>
          </Card>
        ))}
      </div>

      <ShopDetailModal
        open={modalOpen}
        onClose={closeDetail}
        shop={selectedShop}
        isActive={selectedShop ? activeShopId === selectedShop.id : false}
      />
    </div>
  );
};

export default ShopList;
