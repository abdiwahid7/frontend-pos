import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calculator,
  Calendar,
  CreditCard,
  PieChart,
  Package
} from 'lucide-react';

const Financial: React.FC = () => {
  const { transactions, products } = useData();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const getPeriodData = (period: string) => {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    return transactions.filter(t => new Date(t.timestamp) >= startDate);
  };

  const periodData = getPeriodData(selectedPeriod);
  const salesTransactions = periodData.filter(t => t.type === 'sale' && t.status === 'completed');
  
  const totalRevenue = salesTransactions.reduce((sum, t) => sum + t.total, 0);
  const totalCost = salesTransactions.reduce((sum, transaction) => {
    const cost = transaction.items.reduce((itemSum, item) => {
      const product = products.find(p => p.id === item.productId);
      return itemSum + (product ? product.cost * item.quantity : 0);
    }, 0);
    return sum + cost;
  }, 0);
  
  const grossProfit = totalRevenue - totalCost;
  const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

  const paymentMethods = salesTransactions.reduce((acc, t) => {
    acc[t.paymentMethod] = (acc[t.paymentMethod] || 0) + t.total;
    return acc;
  }, {} as Record<string, number>);

  const inventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const inventoryCost = products.reduce((sum, p) => sum + (p.cost * p.stock), 0);

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financial Overview</h1>
            <p className="text-gray-600 mt-2">Track revenue, expenses, and profitability</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% vs last period
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cost of Goods</p>
              <p className="text-2xl font-bold text-gray-900">${totalCost.toFixed(2)}</p>
              <p className="text-sm text-red-600 flex items-center mt-1">
                <TrendingDown className="h-3 w-3 mr-1" />
                +8.2% vs last period
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calculator className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Gross Profit</p>
              <p className="text-2xl font-bold text-gray-900">${grossProfit.toFixed(2)}</p>
              <p className="text-sm text-blue-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                {profitMargin.toFixed(1)}% margin
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inventory Value</p>
              <p className="text-2xl font-bold text-gray-900">${inventoryValue.toFixed(2)}</p>
              <p className="text-sm text-purple-600">
                Cost: ${inventoryCost.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Methods Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Payment Methods</h2>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {Object.entries(paymentMethods).map(([method, amount]) => {
              const percentage = totalRevenue > 0 ? (amount / totalRevenue) * 100 : 0;
              return (
                <div key={method} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {method.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-900">${amount.toFixed(2)}</span>
                      <span className="text-xs text-gray-500 ml-2">({percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
            {Object.keys(paymentMethods).length === 0 && (
              <p className="text-gray-500 text-center py-8">No payment data for this period</p>
            )}
          </div>
        </div>

        {/* Profit Analysis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Profit Analysis</h2>
            <Calculator className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
                <p className="text-sm font-medium text-gray-600">COGS</p>
                <p className="text-xl font-bold text-red-600">${totalCost.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-600">Gross Profit</p>
                  <p className="text-2xl font-bold text-blue-600">${grossProfit.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Margin</p>
                  <p className="text-xl font-bold text-blue-600">{profitMargin.toFixed(1)}%</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Profit by Product Category</h4>
              {(() => {
                const categoryData = products.reduce((acc, product) => {
                const category = product.category;
                if (!acc[category]) {
                  acc[category] = { revenue: 0, cost: 0, items: 0 };
                }
                
                // Calculate sales for this product in the period
                const productSales = salesTransactions.reduce((sum, transaction) => {
                  const item = transaction.items.find(i => i.productId === product.id);
                  return sum + (item ? item.total : 0);
                }, 0);
                
                const productCostSold = salesTransactions.reduce((sum, transaction) => {
                  const item = transaction.items.find(i => i.productId === product.id);
                  return sum + (item ? product.cost * item.quantity : 0);
                }, 0);
                
                acc[category].revenue += productSales;
                acc[category].cost += productCostSold;
                acc[category].items++;
                
                return acc;
                }, {} as any);
                
                return Object.entries(categoryData)
                .filter(([, data]) => (data as any).revenue > 0)
                .sort(([,a], [,b]) => (b as any).revenue - (a as any).revenue)
                .slice(0, 4)
                .map(([category, data]) => {
                  const profit = (data as any).revenue - (data as any).cost;
                  const margin = (data as any).revenue > 0 ? (profit / (data as any).revenue) * 100 : 0;
                  
                  return (
                    <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{category}</p>
                        <p className="text-sm text-gray-600">{(data as any).items} products</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">${profit.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">{margin.toFixed(1)}% margin</p>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>

        {/* Cash Flow Summary */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Cash Flow Summary</h2>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Cash Inflow</h3>
              <p className="text-2xl font-bold text-green-600 mt-2">${totalRevenue.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mt-1">From sales</p>
            </div>
            
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Cash Outflow</h3>
              <p className="text-2xl font-bold text-red-600 mt-2">${totalCost.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mt-1">Cost of goods sold</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Net Cash Flow</h3>
              <p className="text-2xl font-bold text-blue-600 mt-2">${grossProfit.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mt-1">Net profit</p>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Summary Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Financial Transactions</h3>
          <div className="space-y-3">
            {salesTransactions.slice(0, 6).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Sale #{transaction.id}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(transaction.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">+${transaction.total.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{transaction.paymentMethod.replace('_', ' ')}</p>
                </div>
              </div>
            ))}
            {salesTransactions.length === 0 && (
              <p className="text-gray-500 text-center py-8">No transactions for this period</p>
            )}
          </div>
        </div>

        {/* Financial Ratios */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Financial Ratios</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Gross Profit Margin</span>
              <span className="text-sm font-bold text-gray-900">{profitMargin.toFixed(1)}%</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Inventory Turnover</span>
              <span className="text-sm font-bold text-gray-900">
                {inventoryCost > 0 ? (totalCost / inventoryCost * 365).toFixed(1) : '0'}x
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Average Transaction Value</span>
              <span className="text-sm font-bold text-gray-900">
                ${salesTransactions.length > 0 ? (totalRevenue / salesTransactions.length).toFixed(2) : '0.00'}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Inventory Value</span>
              <span className="text-sm font-bold text-gray-900">${inventoryValue.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Days of Inventory</span>
              <span className="text-sm font-bold text-gray-900">
                {totalCost > 0 ? Math.round(inventoryCost / (totalCost / 30)) : '∞'} days
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Financial;