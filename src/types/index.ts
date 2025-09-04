export type Customer = {
  id: string;
  name: string;
  email: string;
  businessName?: string;
  taxId?: string;
  phone: string;
  address: string;
  balance: number;
  totalPurchases: number;
  joinDate: string;
  creditLimit: number;
  paymentTerms?: string;
  discountRate?: string;
  customerType?: "retailer" | "restaurant" | "distributor" | "other";
  billingAddress?: string;
  deliveryAddress?: string;
};

export type Supplier = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  balance: number;
  totalOrders: number;
  paymentTerms?: string;
  notes?: string;
};

export type TransactionItem = {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  total: number;
};

export type Transaction = {
  id: string;
  type: "sale" | "purchase" | "return" | "supplier_payment";
  customerId?: string;
  supplierId?: string;
  items: TransactionItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
  status: string;
  cashier: string;
  timestamp: string;
  // For custom customer name
  customerName?: string;
};

export type Product = {
  id: string;
  name: string;
  barcode: string;
  wholesalePrice: number;
  retailPrice: number;
  stock: number;
  reorderLevel: number;
};
