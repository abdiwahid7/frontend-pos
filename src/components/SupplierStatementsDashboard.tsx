import React, { useState } from "react";
import { useData } from "../context/DataContext";

const SupplierStatementsDashboard: React.FC = () => {
  const { suppliers, getSupplierStatement } = useData();
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || "");

  const supplier = suppliers.find((s) => s.id === selectedSupplierId);
  const statement = selectedSupplierId ? getSupplierStatement(selectedSupplierId) : [];

  // Export to CSV
  const exportToCSV = () => {
    let csvContent = "Type,Date,Amount,Products,Method,Status\n";
    statement.forEach((txn) => {
          const products = txn.items.map((item) => `${item.productName} (x${item.quantity})`).join(", ");
          const amount = txn.type === "supplier_payment" ? txn.paymentAmount : txn.total;
      csvContent += `${txn.type},${new Date(txn.timestamp).toLocaleDateString()},${amount},${products},${txn.paymentMethod},${txn.status}\n`;
    });
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `supplier_statement_${supplier?.name || "unknown"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Supplier Statements Dashboard</h1>
      <div className="mb-6 flex items-center gap-4">
        <label className="block text-sm font-medium">Supplier:</label>
        <select
          value={selectedSupplierId}
          onChange={(e) => setSelectedSupplierId(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2"
        >
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <button
          onClick={exportToCSV}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Export Statement
        </button>
      </div>
      {/* Supplier Name Display */}
      {supplier && (
        <div className="mb-4 text-lg font-semibold text-gray-700">
          Supplier Name: <span className="text-gray-900">{supplier.name}</span>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {statement.map((txn) => {
              const products = txn.items.map((item) => `${item.productName} (x${item.quantity})`).join(", ");
              const amount = txn.type === "supplier_payment" ? txn.paymentAmount : txn.total;
              return (
                <tr key={txn.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{txn.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(txn.timestamp).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${amount?.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{products}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{txn.paymentMethod}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{txn.status}</td>
                </tr>
              );
            })}
            {statement.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">No transactions found for this supplier.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupplierStatementsDashboard;
