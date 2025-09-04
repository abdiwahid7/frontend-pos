import React, { useState } from "react";

type ReturnItem = {
  productId: string;
  quantity: number;
};
import { useData } from "../context/DataContext";

const ReturnsDashboard: React.FC = () => {
  const { suppliers, products, transactions, addTransaction } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    supplierId: suppliers[0]?.id || "",
    items: [] as ReturnItem[],
    status: "completed" as "completed" | "pending" | "cancelled",
  });
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  // Filter return transactions
  const returnOrders = transactions.filter((t) => t.type === "return");
  const filteredReturns = returnOrders.filter((ret) => {
    const supplier = suppliers.find((s) => s.id === ret.supplierId);
    return (
      (supplier?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      ret.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Add product to return form
  const addProductToReturn = () => {
    if (!selectedProductId || selectedQuantity < 1) return;
  const exists = form.items.find((item) => item.productId === selectedProductId);
    if (exists) return;
    setForm({
      ...form,
      items: [
        ...form.items,
        { productId: selectedProductId, quantity: selectedQuantity },
      ],
    });
    setSelectedProductId("");
    setSelectedQuantity(1);
  };

  // Submit return
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.supplierId || form.items.length === 0) return;
    // Build items with product info
    const items = form.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        productId: item.productId,
        productName: product?.name || "",
        quantity: item.quantity,
        price: product?.price || 0,
        total: (product?.price || 0) * item.quantity,
      };
    });
    const subtotal = items.reduce((sum, i) => sum + i.total, 0);
    const tax = 0;
    const discount = 0;
    const total = subtotal;
    addTransaction({
      type: "return",
      supplierId: form.supplierId,
      items,
      subtotal,
      tax,
      discount,
      total,
      paymentMethod: "N/A",
  status: form.status,
      cashier: "Admin User",
    });
    setShowForm(false);
    setForm({
      supplierId: suppliers[0]?.id || "",
      items: [],
      status: "completed",
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Returns to Suppliers Dashboard</h1>
      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by supplier or return ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-64"
        />
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          New Return
        </button>
      </div>

      {/* Return Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl mx-4">
            <h2 className="text-xl font-semibold mb-4">Record Return to Supplier</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Supplier</label>
                <select
                  value={form.supplierId}
                  onChange={(e) => setForm({ ...form, supplierId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Add Product</label>
                <div className="flex gap-2">
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-2/3"
                  >
                    <option value="">Select product</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                    className="border border-gray-300 rounded-lg px-3 py-2 w-1/3"
                  />
                  <button
                    type="button"
                    onClick={addProductToReturn}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Add
                  </button>
                </div>
              </div>
              {/* List of added products */}
              {form.items.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-1">Products to Return</label>
                  <ul className="list-disc pl-5">
                    {form.items.map((item) => {
                      const product = products.find((p) => p.id === item.productId);
                      return (
                        <li key={item.productId} className="mb-1">
                          {product?.name} - Qty: {item.quantity}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Record Return
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Returns Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto mt-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredReturns.map((ret) => {
              const supplier = suppliers.find((s) => s.id === ret.supplierId);
              return (
                <tr key={ret.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ret.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supplier?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ret.items.map((item) => `${item.productName} (x${item.quantity})`).join(", ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${ret.total.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ret.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(ret.timestamp).toLocaleDateString()}</td>
                </tr>
              );
            })}
            {filteredReturns.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">No returns found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReturnsDashboard;
