import { SupplierView } from "@/components/supplier-view";
import { getSuppliers } from "@/lib/api";

export default async function SupplierPage() {
  const suppliers = await getSuppliers();
  return <SupplierView initialSuppliers={suppliers.data} dataSource={suppliers.source} />;
}
