import { ProductsView } from "@/components/products-view";
import { getInventoryMovements, getProducts, getSuppliers } from "@/lib/api";

export default async function ProductsPage() {
  const [productsResult, movementsResult, suppliersResult] = await Promise.all([
    getProducts(),
    getInventoryMovements(),
    getSuppliers()
  ]);

  return (
    <ProductsView
      initialProducts={productsResult.data}
      initialMovements={movementsResult.data}
      suppliers={suppliersResult.data}
      dataSource={
        productsResult.source === "api" &&
        movementsResult.source === "api" &&
        suppliersResult.source === "api"
          ? "api"
          : "fallback"
      }
    />
  );
}
