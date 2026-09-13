import { TransactionsView } from "@/components/transactions-view";
import { getProducts, getTransactions } from "@/lib/api";

export default async function TransactionsPage() {
  const [transactionsResult, productsResult] = await Promise.all([getTransactions(), getProducts()]);

  return (
    <TransactionsView
      initialTransactions={transactionsResult.data}
      products={productsResult.data}
      dataSource={
        transactionsResult.source === "api" && productsResult.source === "api" ? "api" : "fallback"
      }
    />
  );
}
