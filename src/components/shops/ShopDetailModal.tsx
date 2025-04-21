
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, Shop } from "@/lib/types";

interface ShopDetailModalProps {
  open: boolean;
  onClose: () => void;
  shop: Shop | null;
  manager?: User | null;
  workers: User[];
}

const ShopDetailModal: React.FC<ShopDetailModalProps> = ({ open, onClose, shop, manager, workers }) => {
  if (!shop) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>Shop Details</DialogTitle>
        </DialogHeader>
        <div>
          <div className="text-base font-semibold mb-1">{shop.name}</div>
          <div className="text-sm mb-1">Shop Number: <span className="font-mono">{shop.shopNo}</span></div>
          <div className="text-sm mb-1">Address: {shop.address}</div>
          <div className="text-sm mb-1">{shop.phone && <>Phone: {shop.phone}</>} {shop.email && <>Email: {shop.email}</>}</div>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="font-semibold mb-2">Shop Manager</div>
          {manager ? (
            <div className="space-y-1">
              <div>Name: {manager.name}</div>
              <div>Email: {manager.email}</div>
              <div>Phone: {manager.phone || "-"}</div>
              <div>Address: {manager.address || "-"}</div>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">No manager assigned.</div>
          )}
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="font-semibold mb-2">Workers</div>
          {workers.length ? (
            <ul className="space-y-2">
              {workers.map(worker => (
                <li key={worker.id} className="bg-muted px-2 py-1 rounded">
                  <div className="flex flex-col">
                    <span className="font-medium">{worker.name}</span>
                    <span className="text-xs text-muted-foreground">{worker.email}</span>
                    <span className="text-xs">Phone: {worker.phone || "-"}</span>
                    <span className="text-xs">Address: {worker.address || "-"}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500 text-sm">No workers assigned.</div>
          )}
        </div>
        <div className="flex justify-end pt-4">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShopDetailModal;
