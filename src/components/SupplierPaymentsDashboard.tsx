import React, { useState } from "react";
import { useData } from "../context/DataContext";

const SupplierPaymentsDashboard: React.FC = () => {
  const { suppliers, transactions, addTransaction } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    supplierId: suppliers[0]?.id || "",
    paymentAmount: 0,
    paymentMethod: "Bank Transfer",
    status: "completed" as "completed" | "pending" | "cancelled",
  });

  // Filter supplier payment transactions
  const paymentTxns = transactions.filter((t) => t.type === "supplier_payment");
  const filteredPayments = paymentTxns.filter((pay) => {
    const supplier = suppliers.find((s) => s.id === pay.supplierId);
    return (
      (supplier?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      pay.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Submit payment
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.supplierId || form.paymentAmount <= 0) return;
    addTransaction({
      type: "supplier_payment",
      supplierId: form.supplierId,
      items: [],
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
      paymentAmount: form.paymentAmount,
      paymentMethod: form.paymentMethod,
      status: form.status,
      cashier: "Admin User",
    });
    setShowForm(false);
    setForm({
      supplierId: suppliers[0]?.id || "",
      paymentAmount: 0,
      paymentMethod: "Bank Transfer",
      status: "completed",
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Supplier Payments Dashboard</h1>
      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by supplier or payment ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-64"
        />
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Record Payment
        </button>
      </div>

      {/* Payment Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl mx-4">
            <h2 className="text-xl font-semibold mb-4">Record Supplier Payment</h2>
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
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  min={1}
                  value={form.paymentAmount}
                  onChange={(e) => setForm({ ...form, paymentAmount: Number(e.target.value) })}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Payment Method</label>
                <select
                  value={form.paymentMethod}
                  onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>
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
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto mt-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPayments.map((pay) => {
              const supplier = suppliers.find((s) => s.id === pay.supplierId);
              return (
                <tr key={pay.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{pay.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supplier?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${pay.paymentAmount?.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pay.paymentMethod}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pay.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(pay.timestamp).toLocaleDateString()}</td>
                </tr>
              );
            })}
            {filteredPayments.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">No payments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierPaymentsDashboard;
