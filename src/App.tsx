import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import POSSystem from "./components/POSSystem";
import Inventory from "./components/Inventory";
import Customers from "./components/Customers";
import Suppliers from "./components/Suppliers";
import Reports from "./components/Reports";
import Financial from "./components/Financial";
import PurchaseOrdersDashboard from "./components/PurchaseOrdersDashboard";
import SupplierPaymentsDashboard from "./components/SupplierPaymentsDashboard";
import ReturnsDashboard from "./components/ReturnsDashboard";
import SupplierStatementsDashboard from "./components/SupplierStatementsDashboard";
import Login from "./components/Login";
import { DataProvider } from "./context/DataContext";
// Update the import path to the correct AuthContext file
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";

function AppContent() {
  const [activeModule, setActiveModule] = useState("dashboard");
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  const renderActiveModule = () => {
    switch (activeModule) {
      case "dashboard":
        return <Dashboard />;
      case "pos":
        return <POSSystem />;
      case "inventory":
        return <Inventory />;
      case "customers":
        return <Customers />;
      case "suppliers":
        return <Suppliers />;
      case "reports":
        return <Reports />;
      case "financial":
        return <Financial />;
      case "purchase_orders":
        return <PurchaseOrdersDashboard />;
      case "supplier_payments":
        return <SupplierPaymentsDashboard />;
      case "returns":
        return <ReturnsDashboard />;
      case "supplier_statements":
        return <SupplierStatementsDashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <DataProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar
          activeModule={activeModule}
          onModuleChange={setActiveModule}
          user={user}
        />
        <div className="flex-1 overflow-hidden">
          <main className="h-full overflow-y-auto">{renderActiveModule()}</main>
        </div>
      </div>
    </DataProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
