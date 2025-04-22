
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shop } from "@/lib/types";

interface ShopDetailModalProps {
  open: boolean;
  onClose: () => void;
  shop: Shop | null;
  isActive: boolean;
}

const ShopDetailModal: React.FC<ShopDetailModalProps> = ({ open, onClose, shop, isActive }) => {
  if (!shop) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Shop Details
            {isActive && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                Active
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        <div>
          <div className="text-base font-semibold mb-1">{shop.name}</div>
          <div className="text-sm mb-1">Shop Number: <span className="font-mono">{shop.shopNo}</span></div>
          <div className="text-sm mb-1">Address: {shop.address}</div>
          <div className="text-sm mb-1">{shop.phone && <>Phone: {shop.phone}</>}</div>
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

