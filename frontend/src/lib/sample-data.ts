import type { AnalyticsSummary, Product, Transaction } from "@/lib/types";

export const fallbackProducts: Product[] = [
  {
    id: "prd-beras-5kg",
    name: "Beras Ramos 5kg",
    category: "Sembako",
    unit: "karung",
    purchase_price: 58000,
    selling_price: 68000,
    current_stock: 8,
    minimum_stock: 10,
    status: "Menipis"
  },
  {
    id: "prd-minuman-sachet",
    name: "Minuman Sachet",
    category: "Minuman",
    unit: "renceng",
    purchase_price: 9200,
    selling_price: 10000,
    current_stock: 32,
    minimum_stock: 12,
    status: "Aman"
  },
  {
    id: "prd-minyak-1l",
    name: "Minyak Goreng 1L",
    category: "Sembako",
    unit: "botol",
    purchase_price: 14500,
    selling_price: 17000,
    current_stock: 0,
    minimum_stock: 6,
    status: "Habis"
  }
];

export const fallbackTransactions: Transaction[] = [
  {
    id: "trx-001",
    date: "2026-06-16",
    product_name: "Beras Ramos 5kg",
    quantity: 2,
    selling_price: 68000,
    discount: 0,
    payment_method: "Tunai",
    notes: "Sample data"
  },
  {
    id: "trx-002",
    date: "2026-06-16",
    product_name: "Minuman Sachet",
    quantity: 5,
    selling_price: 10000,
    discount: 0,
    payment_method: "QRIS",
    notes: "Sample data"
  }
];

export const fallbackSummary: AnalyticsSummary = {
  total_sales_today: 2450000,
  gross_profit_today: 620000,
  transaction_count_today: 38,
  low_stock_count: 7,
  sales_trend: [
    { label: "Sen", value: 1800000 },
    { label: "Sel", value: 2100000 },
    { label: "Rab", value: 1950000 },
    { label: "Kam", value: 2300000 },
    { label: "Jum", value: 2750000 },
    { label: "Sab", value: 3200000 },
    { label: "Min", value: 2450000 }
  ],
  top_products: fallbackProducts.slice(0, 2),
  low_stock_products: fallbackProducts.filter((product) => product.status !== "Aman"),
  recent_transactions: fallbackTransactions,
  recommendations: [
    {
      title: "Beras 5kg hampir habis",
      description: "Stok Beras 5kg diperkirakan habis dalam 3 hari jika penjualan stabil.",
      action: "Siapkan restock sebelum akhir pekan."
    },
    {
      title: "Margin minuman sachet kecil",
      description: "Minuman Sachet laku tinggi, tapi margin hanya sekitar 8%.",
      action: "Cek harga beli atau paket bundling."
    },
    {
      title: "Supplier Sinar Jaya menarik",
      description: "Supplier Sinar Jaya memberi harga lebih rendah untuk kategori sembako.",
      action: "Bandingkan untuk restock berikutnya."
    }
  ]
};
