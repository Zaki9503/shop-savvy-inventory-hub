
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useData } from "@/lib/data-context";
import { Shop } from "@/lib/types";

interface ShopDetailModalProps {
  open: boolean;
  onClose: () => void;
  shop: Shop | null;
  isActive: boolean;
}

const ShopDetailModal: React.FC<ShopDetailModalProps> = ({ open, onClose, shop, isActive }) => {
  const { updateShop } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [editedShop, setEditedShop] = useState<Shop | null>(null);

  // Initialize edited shop when modal opens
  React.useEffect(() => {
    if (shop) {
      setEditedShop(shop);
    }
  }, [shop]);

  if (!shop || !editedShop) return null;

  const handleSave = () => {
    if (editedShop) {
      updateShop(shop.id, editedShop);
      setIsEditing(false);
    }
  };

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
        <div className="space-y-4">
          {isEditing ? (
            <>
              <div>
                <label className="text-sm font-medium mb-1 block">Name</label>
                <Input
                  value={editedShop.name}
                  onChange={(e) => setEditedShop({ ...editedShop, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Shop Number</label>
                <Input
                  value={editedShop.shopNo}
                  onChange={(e) => setEditedShop({ ...editedShop, shopNo: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Address</label>
                <Input
                  value={editedShop.address}
                  onChange={(e) => setEditedShop({ ...editedShop, address: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Phone</label>
                <Input
                  value={editedShop.phone || ''}
                  onChange={(e) => setEditedShop({ ...editedShop, phone: e.target.value })}
                />
              </div>
            </>
          ) : (
            <>
              <div className="text-base font-semibold mb-1">{shop.name}</div>
              <div className="text-sm mb-1">Shop Number: <span className="font-mono">{shop.shopNo}</span></div>
              <div className="text-sm mb-1">Address: {shop.address}</div>
              <div className="text-sm mb-1">{shop.phone && <>Phone: {shop.phone}</>}</div>
            </>
          )}
        </div>
        <div className="flex justify-end gap-2 pt-4">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>Edit</Button>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShopDetailModal;
