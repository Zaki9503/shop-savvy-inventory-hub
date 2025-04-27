import { Suspense } from "react";
import ShopProductsPage from "@/components/stores/ShopProductsPage";

interface ShopProductsPageProps {
  params: {
    storeId: string;
  };
}

export default function ShopProducts({ params }: ShopProductsPageProps) {
  return (
    <Suspense fallback={<div className="p-6">Loading shop products...</div>}>
      <ShopProductsPage shopId={params.storeId} />
    </Suspense>
  );
} 