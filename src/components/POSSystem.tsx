import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/useAuth";
import {
  Search,
  Scan,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  DollarSign,
  Printer,
  X,
  ShoppingCart,
} from "lucide-react";
import { Product, Transaction, TransactionItem } from "../types";

const POSSystem: React.FC = () => {
  const { products, customers, addTransaction } = useData();
  const { user } = useAuth();
  const [cart, setCart] = useState<
    Array<{
      productId: string;
      productName: string;
      price: number;
      quantity: number;
      total: number;
    }>
  >([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [customCustomerName, setCustomCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [discount, setDiscount] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(
    null
  );

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode.includes(searchTerm)
  );

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert("This product is out of stock and cannot be added to the cart.");
      return;
    }
    const existingItem = cart.find((item) => item.productId === product.id);
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        alert("You cannot add more than the available stock.");
        return;
      }
      setCart(
        cart.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total: (item.quantity + 1) * item.price,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          productName: product.name,
          price: product.wholesalePrice,
          quantity: 1,
          total: product.wholesalePrice,
        },
      ]);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    if (newQuantity <= 0) {
      setCart(cart.filter((item) => item.productId !== productId));
    } else if (newQuantity > product.stock) {
      alert("Cannot order more than available stock.");
      setCart(
        cart.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: product.stock,
                total: product.stock * item.price,
              }
            : item
        )
      );
    } else {
      setCart(
        cart.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: newQuantity,
                total: newQuantity * item.price,
              }
            : item
        )
      );
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax - discount;

  const processTransaction = () => {
    if (cart.length === 0) return;

    const transaction = {
      type: "sale" as const,
      customerId:
        selectedCustomer === "custom"
          ? undefined
          : selectedCustomer || undefined,
      customerName:
        selectedCustomer === "custom" && customCustomerName
          ? customCustomerName
          : undefined,
      items: cart,
      subtotal,
      tax,
      discount,
      total,
      paymentMethod,
      status: "completed" as const,
      cashier: user?.full_name || "Cashier",
    };

    addTransaction(transaction);
    setLastTransaction({ ...transaction, id: Date.now().toString() });
    setCart([]);
    setDiscount(0);
    setSearchTerm("");
    setShowReceipt(true);
  };

  return (
    <div className="p-6 h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Point of Sale</h1>
        <p className="text-gray-600 mt-2">
          Process sales transactions and manage cart items
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
        {/* Product Search & Selection */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products or scan barcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Scan className="h-5 w-5" />
                <span>Scan</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => addToCart(product)}
                className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300 ${
                  product.stock <= 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                title={product.stock <= 0 ? "Out of stock" : ""}
              >
                <h3 className="font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">
                    Stock: {product.stock}
                  </span>
                </div>
                {product.stock <= 0 && (
                  <div className="text-xs text-red-500 mt-2">Out of stock</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cart & Checkout */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Current Sale
          </h2>

          {/* Customer Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer (Optional)
            </label>
            <select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
            >
              <option value="">Walk-in Customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
              <option value="custom">Other (Type Name Below)</option>
            </select>
            {selectedCustomer === "custom" && (
              <input
                type="text"
                placeholder="Enter customer name..."
                value={customCustomerName}
                onChange={(e) => setCustomCustomerName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-2"
              />
            )}
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto mb-4">
            {cart.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <ShoppingCart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Cart is empty</p>
                <p className="text-sm">Add products to start a transaction</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {item.productName}
                      </p>
                      <p className="text-sm text-gray-600">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="p-1 text-gray-500 hover:text-red-600"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="p-1 text-gray-500 hover:text-green-600"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="p-1 text-gray-500 hover:text-red-600 ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          {cart.length > 0 && (
            <div className="border-t border-gray-200 pt-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8%):</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Discount:</span>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-20 text-right border border-gray-300 rounded px-2 py-1 text-sm"
                    placeholder="0.00"
                  />
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="cash">Cash</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="mobile_payment">Mobile Payment</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={processTransaction}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <DollarSign className="h-5 w-5" />
                  <span>Complete Sale</span>
                </button>
                <button
                  onClick={() => setCart([])}
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && lastTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Transaction Complete</h3>
              <button
                onClick={() => setShowReceipt(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 font-mono text-sm">
              <div className="text-center mb-4">
                <h4 className="font-bold">RETAILPRO STORE</h4>
                <p>123 Business St, City, State 12345</p>
                <p>Phone: (555) 123-4567</p>
              </div>

              <div className="border-t border-gray-400 my-4"></div>

              <div className="mb-4">
                <p>Transaction #: {lastTransaction.id}</p>
                <p>Date: {new Date().toLocaleString()}</p>
                <p>Cashier: {lastTransaction.cashier}</p>
                {!window.matchMedia("print").matches &&
                  (lastTransaction.customerName ? (
                    <p>Customer: {lastTransaction.customerName}</p>
                  ) : lastTransaction.customerId ? (
                    <p>
                      Customer:{" "}
                      {(() => {
                        const customer = customers.find(
                          (c) => c.id === lastTransaction.customerId
                        );
                        return customer ? customer.name : "Walk-in Customer";
                      })()}
                    </p>
                  ) : (
                    <p>Customer: Walk-in Customer</p>
                  ))}
              </div>

              <div className="border-t border-gray-400 my-4"></div>

              {lastTransaction.items.map((item: TransactionItem) => (
                <div key={item.productId} className="flex justify-between mb-1">
                  <span>{item.productName}</span>
                  <span>
                    {item.quantity}x ${item.price.toFixed(2)} = $
                    {item.total.toFixed(2)}
                  </span>
                </div>
              ))}

              <div className="border-t border-gray-400 my-4"></div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${lastTransaction.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${lastTransaction.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>-${lastTransaction.discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${lastTransaction.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-center mt-4">
                <p>Thank you for your business!</p>
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Printer className="h-4 w-4" />
                <span>Print</span>
              </button>
              <button
                onClick={() => setShowReceipt(false)}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POSSystem;
