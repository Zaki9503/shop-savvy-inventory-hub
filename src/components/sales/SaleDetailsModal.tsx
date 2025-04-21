
import React from "react";
import { Product, Sale } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface SaleDetailsModalProps {
  open: boolean;
  onClose: () => void;
  sale: Sale | null;
  products: Product[];
}

export const SaleDetailsModal: React.FC<SaleDetailsModalProps> = ({ open, onClose, sale, products }) => {
  if (!sale) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>
            Sale Details
          </DialogTitle>
        </DialogHeader>
        <div>
          <div className="mb-2 text-sm text-gray-600">Sale ID: <span className="font-mono">{sale.id}</span></div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sale.items.map((item, idx) => {
                const product = products.find(p => p.id === item.productId);
                return (
                  <TableRow key={item.productId + idx}>
                    <TableCell>
                      <div className="font-medium">{product ? product.name : "Unknown"}</div>
                      <div className="text-xs text-gray-500">{product?.category}</div>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.total.toFixed(2)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
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

export default SaleDetailsModal;
