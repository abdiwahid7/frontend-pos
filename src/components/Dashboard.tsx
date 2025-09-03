import React from 'react';
import { useData } from '../context/DataContext';
import {
  DollarSign,
  Package,
  Users,
  TrendingUp,
  AlertTriangle,
  ShoppingCart
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { products, customers, transactions } = useData();

  const totalRevenue = transactions
    .filter(t => t.type === 'sale' && t.status === 'completed')
    .reduce((sum, t) => sum + t.total, 0);

  const todayRevenue = transactions
    .filter(t => {
      const today = new Date().toDateString();
      const transactionDate = new Date(t.timestamp).toDateString();
      return t.type === 'sale' && t.status === 'completed' && transactionDate === today;
    })
    .reduce((sum, t) => sum + t.total, 0);

  const lowStockItems = products.filter(p => p.stock <= p.reorderLevel);
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  const stats = [
    {
      title: "Today's Revenue",
      value: `$${todayRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+12.5%'
    },
    {
      title: 'Total Products',
      value: products.length.toString(),
      icon: Package,
      color: 'bg-blue-500',
      change: '+2.1%'
    },
    {
      title: 'Active Customers',
      value: customers.length.toString(),
      icon: Users,
      color: 'bg-purple-500',
      change: '+5.4%'
    },
    {
      title: 'Low Stock Items',
      value: lowStockItems.length.toString(),
      icon: AlertTriangle,
      color: 'bg-orange-500',
      change: '-1.2%'
    }
  ];

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your business overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-2">{stat.change} from last week</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
            <ShoppingCart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">#{transaction.id}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(transaction.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${transaction.total.toFixed(2)}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                    transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Low Stock Alert</h2>
            <AlertTriangle className="h-5 w-5 text-orange-500" />
          </div>
          <div className="space-y-4">
            {lowStockItems.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">Reorder Level: {product.reorderLevel}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-orange-600">{product.stock} left</p>
                  <p className="text-xs text-gray-500">{product.category}</p>
                </div>
              </div>
            ))}
            {lowStockItems.length === 0 && (
              <p className="text-gray-500 text-center py-4">All items are well stocked</p>
            )}
          </div>
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Revenue Trends</h2>
        <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Revenue chart visualization would go here</p>
            <p className="text-sm text-gray-400">Total Revenue: ${totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;