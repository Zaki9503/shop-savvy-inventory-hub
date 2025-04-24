import React from 'react';
import { Sale } from '@/lib/types';
import { useData } from '@/lib/data-context';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Receipt, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SaleBillProps {
  sale: Sale;
}

const SaleBill: React.FC<SaleBillProps> = ({ sale }) => {
  const { getShop, getProduct, activeShopId } = useData();
  // Use active shop if available, otherwise fallback to sale's shop
  const shop = activeShopId ? getShop(activeShopId) : getShop(sale.shopId);

  const handlePrint = () => {
    window.print();
  };

  if (!shop) return null;

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div className="text-center flex-1">
          <h2 className="text-2xl font-bold">{shop.name}</h2>
          <p className="text-gray-600">Shop No: {shop.shopNo}</p>
          <p className="text-gray-600">{shop.address}</p>
          {shop.phone && <p className="text-gray-600">Phone: {shop.phone}</p>}
        </div>
        <Button 
          variant="outline" 
          className="print:hidden"
          onClick={handlePrint}
        >
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
      </div>

      <div className="flex justify-between mb-4 text-sm">
        <div>
          <p>Bill No: {sale.id}</p>
          <p>Date: {new Date(sale.createdAt).toLocaleDateString()}</p>
        </div>
        <div>
          <p>Payment Mode: {sale.saleType.toUpperCase()}</p>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead className="text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sale.items.map((item, index) => {
            const product = getProduct(item.productId);
            return (
              <TableRow key={index}>
                <TableCell>
                  <div>
                    <div className="font-medium">{product?.name}</div>
                    <div className="text-xs text-gray-500">{product?.sku}</div>
                  </div>
                </TableCell>
                <TableCell>₹{item.price.toFixed(2)}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell className="text-right">₹{item.total.toFixed(2)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <div className="mt-4 flex flex-col items-end space-y-1">
        <p className="text-lg font-bold">
          Total Amount: ₹{sale.total.toFixed(2)}
        </p>
        {sale.balance > 0 && (
          <>
            <p>Paid: ₹{sale.paid.toFixed(2)}</p>
            <p className="text-red-500">Balance: ₹{sale.balance.toFixed(2)}</p>
          </>
        )}
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Thank you for your business!</p>
      </div>
    </Card>
  );
};

export default SaleBill;
