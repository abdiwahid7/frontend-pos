import React from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Truck,
  FileText,
  Calculator,
  Store,
  DollarSign,
} from "lucide-react";

import { AuthUser } from "../context/AuthContext";
import { useAuth } from "../context/useAuth";

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
  user: AuthUser;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onModuleChange,
  user,
}) => {
  const { logout } = useAuth();
  // Example: Only admin/manager can see Reports and Financial
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "pos", label: "Point of Sale", icon: ShoppingCart },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "customers", label: "Customers", icon: Users },
    { id: "suppliers", label: "Suppliers", icon: Truck },
    ...(user.role === "admin" || user.role === "manager"
      ? [
          { id: "reports", label: "Reports", icon: FileText },
          { id: "financial", label: "Financial", icon: Calculator },
          { id: "purchase_orders", label: "Purchase Orders", icon: Package },
          {
            id: "supplier_payments",
            label: "Supplier Payments",
            icon: DollarSign,
          },
          { id: "returns", label: "Returns to Suppliers", icon: Truck },
          {
            id: "supplier_statements",
            label: "Supplier Statements",
            icon: FileText,
          },
        ]
      : []),
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Store className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">RetailPro</h1>
            <p className="text-sm text-gray-500">POS & Inventory</p>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onModuleChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                activeModule === item.id
                  ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="px-4 py-2 border-t border-gray-200 text-xs text-gray-500">
        <div>
          Logged in as: <span className="font-semibold">{user.full_name}</span>
        </div>
        <div>
          Role: <span className="font-semibold">{user.role}</span>
        </div>
        <button
          onClick={logout}
          className="mt-2 w-full bg-red-100 text-red-700 py-1 rounded hover:bg-red-200 text-xs font-semibold"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
