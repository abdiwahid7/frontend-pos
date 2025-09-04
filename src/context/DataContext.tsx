import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Product {
  id: string;
  name: string;
  barcode: string;
  price: number;
  wholesalePrice: number;
  retailPrice: number;
  cost: number;
  stock: number;
  unit: string;
  minimumOrderQuantity: number;
  packSize: number;
  category: string;
  brand: string;
  supplier: string;
  description?: string;
  reorderLevel: number;
  expiryDate?: string;
  batchNumber?: string;
  storageConditions?: string;
}

export interface Customer {
  id: string;
  name: string;
  businessName: string;
  customerType: "retailer" | "restaurant" | "distributor" | "other";
  taxId: string;
  creditLimit: number;
  paymentTerms: string;
  email: string;
  phone: string;
  address: string;
  billingAddress: string;
  deliveryAddress: string;
  balance: number;
  totalPurchases: number;
  joinDate: string;
  discountRate: number;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  balance: number;
  totalOrders: number;
}

export interface Transaction {
  id: string;
  type: "sale" | "return" | "purchase" | "supplier_payment";
  customerId?: string;
  supplierId?: string;
  items: TransactionItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: string;
  status: "completed" | "pending" | "cancelled";
  timestamp: string;
  cashier: string;
  // For supplier payments
  paymentAmount?: number;
}

export interface TransactionItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

interface DataContextType {
  products: Product[];
  customers: Customer[];
  suppliers: Supplier[];
  transactions: Transaction[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  addCustomer: (customer: Omit<Customer, "id">) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  addSupplier: (supplier: Omit<Supplier, "id">) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  addTransaction: (transaction: Omit<Transaction, "id" | "timestamp">) => void;
  updateStock: (productId: string, quantity: number) => void;
  getSupplierStatement: (supplierId: string) => Transaction[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Premium Rice - Basmati",
      barcode: "8901030875021",
      price: 45.0,
      wholesalePrice: 42.0,
      retailPrice: 48.0,
      cost: 38.0,
      stock: 500,
      unit: "kg",
      minimumOrderQuantity: 25,
      packSize: 25,
      category: "Grains & Cereals",
      brand: "Golden Harvest",
      supplier: "Grain Suppliers Ltd",
      description: "Premium quality basmati rice, aged 2 years",
      reorderLevel: 100,
      expiryDate: "2025-12-31",
      batchNumber: "GH2024001",
      storageConditions: "Cool, dry place",
    },
    {
      id: "2",
      name: "Olive Oil - Extra Virgin",
      barcode: "8901030875038",
      price: 125.0,
      wholesalePrice: 120.0,
      retailPrice: 135.0,
      cost: 110.0,
      stock: 200,
      unit: "liters",
      minimumOrderQuantity: 12,
      packSize: 5,
      category: "Oils & Fats",
      brand: "Mediterranean Gold",
      supplier: "Oil Importers Inc",
      description: "Cold-pressed extra virgin olive oil",
      reorderLevel: 50,
      expiryDate: "2026-06-30",
      batchNumber: "MG2024002",
      storageConditions: "Store in cool, dark place",
    },
    {
      id: "3",
      name: "Frozen Chicken Breast",
      barcode: "8901030875045",
      price: 180.0,
      wholesalePrice: 175.0,
      retailPrice: 190.0,
      cost: 165.0,
      stock: 150,
      unit: "kg",
      minimumOrderQuantity: 20,
      packSize: 10,
      category: "Frozen Foods",
      brand: "Farm Fresh",
      supplier: "Poultry Suppliers Co",
      description: "Grade A frozen chicken breast, hormone-free",
      reorderLevel: 30,
      expiryDate: "2025-03-15",
      batchNumber: "FF2024003",
      storageConditions: "Keep frozen at -18°C",
    },
  ]);

  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "1",
      name: "Ahmed Hassan",
      businessName: "City Supermarket Chain",
      customerType: "retailer",
      taxId: "TAX123456789",
      creditLimit: 50000,
      paymentTerms: "Net 30",
      email: "ahmed@citysupermarket.com",
      phone: "+1-555-0101",
      address: "123 Commercial St, Business District",
      billingAddress: "123 Commercial St, Business District",
      deliveryAddress: "456 Warehouse Ave, Industrial Zone",
      balance: 0,
      totalPurchases: 125000.0,
      joinDate: "2024-01-15",
      discountRate: 5,
    },
    {
      id: "2",
      name: "Maria Rodriguez",
      businessName: "Golden Palace Restaurant",
      customerType: "restaurant",
      taxId: "TAX987654321",
      creditLimit: 25000,
      paymentTerms: "Net 15",
      email: "maria@goldenpalace.com",
      phone: "+1-555-0202",
      address: "789 Restaurant Row, Food District",
      billingAddress: "789 Restaurant Row, Food District",
      deliveryAddress: "789 Restaurant Row, Food District",
      balance: 2500.0,
      totalPurchases: 85000.0,
      joinDate: "2024-02-10",
      discountRate: 3,
    },
  ]);

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: "1",
      name: "Grain Suppliers Ltd",
      email: "orders@grainsuppliers.com",
      phone: "+1-555-1001",
      address: "789 Industrial Blvd, Agricultural Zone",
      balance: 1250.0,
      totalOrders: 15670.25,
    },
    {
      id: "2",
      name: "Oil Importers Inc",
      email: "supply@oilimporters.com",
      phone: "+1-555-2002",
      address: "321 Port Ave, Import District",
      balance: 875.3,
      totalOrders: 8934.5,
    },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "sale",
      customerId: "1",
      items: [
        {
          productId: "1",
          productName: "Premium Rice - Basmati",
          quantity: 10,
          price: 42.0,
          total: 420.0,
        },
        {
          productId: "2",
          productName: "Olive Oil - Extra Virgin",
          quantity: 5,
          price: 120.0,
          total: 600.0,
        },
      ],
      subtotal: 1020.0,
      tax: 81.6,
      discount: 50.0,
      total: 1051.6,
      paymentMethod: "credit_card",
      status: "completed",
      timestamp: "2024-12-21T10:30:00Z",
      cashier: "Admin User",
    },
  ]);

  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct = { ...product, id: Date.now().toString() };
    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const addCustomer = (customer: Omit<Customer, "id">) => {
    const newCustomer = { ...customer, id: Date.now().toString() };
    setCustomers((prev) => [...prev, newCustomer]);
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const addSupplier = (supplier: Omit<Supplier, "id">) => {
    const newSupplier = { ...supplier, id: Date.now().toString() };
    setSuppliers((prev) => [...prev, newSupplier]);
  };

  const updateSupplier = (id: string, updates: Partial<Supplier>) => {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const addTransaction = (
    transaction: Omit<Transaction, "id" | "timestamp">
  ) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);

    // Handle purchase order: increase stock, update supplier balance
    if (transaction.type === "purchase") {
      transaction.items.forEach((item) => {
        updateStock(item.productId, item.quantity);
      });
      if (transaction.supplierId) {
        setSuppliers((prev) =>
          prev.map((s) =>
            s.id === transaction.supplierId
              ? {
                  ...s,
                  balance: s.balance + transaction.total,
                  totalOrders: s.totalOrders + transaction.total,
                }
              : s
          )
        );
      }
    }

    // Handle supplier payment: decrease supplier balance
    if (
      transaction.type === "supplier_payment" &&
      transaction.supplierId &&
      transaction.paymentAmount
    ) {
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === transaction.supplierId
              ? { 
                  ...s, 
                  balance: Math.max(0, s.balance - (transaction.paymentAmount ?? 0)),
                }
            : s
        )
      );
    }

    // Handle returns to supplier: decrease stock, decrease supplier balance
    if (transaction.type === "return" && transaction.supplierId) {
      transaction.items.forEach((item) => {
        updateStock(item.productId, -item.quantity);
      });
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === transaction.supplierId
            ? { ...s, balance: Math.max(0, s.balance - transaction.total) }
            : s
        )
      );
    }
  };
  // Get all transactions for a supplier (for statements)
  const getSupplierStatement = (supplierId: string) => {
    return transactions.filter((t) => t.supplierId === supplierId);
  };

  const updateStock = (productId: string, quantity: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, stock: Math.max(0, p.stock + quantity) }
          : p
      )
    );
  };

  return (
    <DataContext.Provider
      value={{
        products,
        customers,
        suppliers,
        transactions,
        addProduct,
        updateProduct,
        addCustomer,
        updateCustomer,
        addSupplier,
        updateSupplier,
        addTransaction,
        updateStock,
        getSupplierStatement,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
