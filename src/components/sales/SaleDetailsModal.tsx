
import React from "react";
import { Product, Sale } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SaleBill from "./SaleBill";

interface SaleDetailsModalProps {
  open: boolean;
  onClose: () => void;
  sale: Sale | null;
  products: Product[];
}

const SaleDetailsModal: React.FC<SaleDetailsModalProps> = ({ open, onClose, sale }) => {
  if (!sale) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Sale Details</DialogTitle>
        </DialogHeader>
        <SaleBill sale={sale} />
      </DialogContent>
    </Dialog>
  );
};

export default SaleDetailsModal;
