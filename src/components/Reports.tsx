import React, { useState } from "react";
import { Transaction } from "../types/index";
import { Transaction } from "../types";
import { useData } from "../context/DataContext";
import {
  BarChart3,
  Calendar,
  Download,
  TrendingUp,
  Users,
  Package,
  DollarSign,
} from "lucide-react";

const Reports: React.FC = () => {
  // Helper to get customer name from transaction
  function getCustomerName(transaction: Transaction): string {
    const customer = customers.find((c) => c.id === transaction.customerId);
  // custom customerName may exist for some transactions
    if (customer) return customer.name;
    if ((transaction as { customerName?: string }).customerName) {
      return (transaction as { customerName?: string }).customerName!;
    }
    return "Walk-in Customer";
  }
  // Export report data to CSV
  const exportToCSV = () => {
    let csvContent = "";
    if (reportType === "customer") {
      csvContent += "Customer Name,Phone,Total Purchases,Balance\n";
      customers.forEach((c) => {
        csvContent += `${c.name},${c.phone},${c.totalPurchases},${c.balance}\n`;
      });
    } else {
      csvContent +=
        "Transaction ID,Date,Customer,Items,Payment Method,Total,Status\n";
      filteredSalesData.forEach((transaction) => {
  // customer variable removed, use getCustomerName instead
  const customerName = getCustomerName(transaction);
        csvContent += `${transaction.id},${new Date(
          transaction.timestamp
        ).toLocaleDateString()},${customerName},${
          transaction.items.length
        },${transaction.paymentMethod.replace("_", " ")},${transaction.total},${
          transaction.status
        }\n`;
      });
    }
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download =
      reportType === "customer" ? "customer_report.csv" : "sales_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };
  const { transactions, products, customers } = useData();
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [reportType, setReportType] = useState("sales");
  const [searchTerm, setSearchTerm] = useState("");

  const getPeriodData = (period: string) => {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "today":
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case "week":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "month":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "year":
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setHours(0, 0, 0, 0));
    }

    return transactions.filter((t) => new Date(t.timestamp) >= startDate);
  };

  const periodData = getPeriodData(selectedPeriod);
  const salesData = periodData.filter(
    (t) => t.type === "sale" && t.status === "completed"
  );

  const totalRevenue = salesData.reduce((sum, t) => sum + t.total, 0);
  const totalTransactions = salesData.length;
  const averageTransactionValue =
    totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

  const productSales: Record<
    string,
    { name: string; quantity: number; revenue: number }
  > = salesData.reduce((acc, transaction) => {
    transaction.items.forEach((item) => {
      if (acc[item.productId]) {
        acc[item.productId]!.quantity += item.quantity;
        acc[item.productId]!.revenue += item.total;
      } else {
        acc[item.productId] = {
          name: item.productName,
          quantity: item.quantity,
          revenue: item.total,
        };
      }
    });
    return acc;
  }, {} as Record<string, { name: string; quantity: number; revenue: number }>);

  const topProducts = Object.entries(productSales)
    .sort(([, a], [, b]) => b.revenue - a.revenue)
    .slice(0, 5);

  const lowStockProducts = products.filter((p) => p.stock <= p.reorderLevel);

  const filteredSalesData = salesData.filter((transaction) => {
  // customer variable removed, use getCustomerName instead
  const customerName = getCustomerName(transaction);
    return (
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Reports & Analytics
        </h1>
        <p className="text-gray-600 mt-2">
          Comprehensive business insights and performance metrics
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="sales">Sales Report</option>
              <option value="inventory">Inventory Report</option>
              <option value="customer">Customer Report</option>
              <option value="financial">Financial Summary</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Period
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last Year</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer name or transaction ID..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={exportToCSV}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="h-5 w-5" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Transactions</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalTransactions}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Avg Transaction
              </p>
              <p className="text-2xl font-bold text-gray-900">
                ${averageTransactionValue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Low Stock Items
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {lowStockProducts.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Selling Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Top Selling Products
            </h2>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {topProducts.length > 0 ? (
              topProducts.map(([productId, data]) => (
                <div
                  key={productId}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{data.name}</p>
                    <p className="text-sm text-gray-600">
                      Qty: {data.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${data.revenue.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">Revenue</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                No sales data for this period
              </p>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Transactions
            </h2>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {filteredSalesData.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">#{transaction.id}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(transaction.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${transaction.total.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {transaction.paymentMethod}
                  </p>
                </div>
              </div>
            ))}
            {filteredSalesData.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                No transactions for this period
              </p>
            )}
          </div>
        </div>

        {/* Inventory Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Inventory Status
            </h2>
            <Package className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {products.length}
                </p>
                <p className="text-sm text-gray-600">Total Products</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">
                  {lowStockProducts.length}
                </p>
                <p className="text-sm text-gray-600">Low Stock</p>
              </div>
            </div>

            {lowStockProducts.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Items Needing Reorder:
                </h4>
                <div className="space-y-2">
                  {lowStockProducts.slice(0, 3).map((product) => (
                    <div
                      key={product.id}
                      className="flex justify-between items-center p-2 bg-orange-50 rounded border-l-4 border-orange-400"
                    >
                      <span className="text-sm text-gray-900">
                        {product.name}
                      </span>
                      <span className="text-sm font-medium text-orange-600">
                        {product.stock} left
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Customer Insights */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Customer Insights
            </h2>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {customers.length}
                </p>
                <p className="text-sm text-gray-600">Total Customers</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  $
                  {customers
                    .reduce((sum, c) => sum + c.totalPurchases, 0)
                    .toFixed(0)}
                </p>
                <p className="text-sm text-gray-600">Customer LTV</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Top Customers:</h4>
              <div className="space-y-2">
                {customers
                  .sort((a, b) => b.totalPurchases - a.totalPurchases)
                  .slice(0, 3)
                  .map((customer) => (
                    <div
                      key={customer.id}
                      className="flex justify-between items-center p-2 bg-purple-50 rounded"
                    >
                      <span className="text-sm text-gray-900">
                        {customer.name}
                      </span>
                      <span className="text-sm font-medium text-purple-600">
                        ${customer.totalPurchases.toFixed(2)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Reports Table: Sales or Customer Report */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {reportType === "customer"
              ? "Customer Report"
              : "Detailed Sales Report"}
          </h3>
        </div>
        <div className="overflow-x-auto">
          {reportType === "customer" ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Purchases
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {customer.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {customer.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${customer.totalPurchases.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${customer.balance.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSalesData.map((transaction) => {
                  // customer variable removed, use getCustomerName instead
                  return (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{transaction.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(transaction.timestamp).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getCustomerName(transaction)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.items.length} item(s)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.paymentMethod.replace("_", " ")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${transaction.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            transaction.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : transaction.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
