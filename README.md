# Wholesale POS System - Frontend

## 🎯 Overview
This is the **FRONTEND** portion of a complete Point of Sale and Inventory Management System designed specifically for wholesale food businesses.

## 🚀 Features
- **Dashboard** - Business overview and key metrics
- **Point of Sale** - Process wholesale transactions
- **Inventory Management** - Track products, stock levels, expiry dates
- **Customer Management** - Manage retailers, restaurants, distributors
- **Supplier Management** - Track vendors and purchase orders
- **Reports & Analytics** - Sales reports and business insights
- **Financial Overview** - Profit/loss tracking and cash flow

## 🛠 Technology Stack
- **React 18** - Modern UI framework
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Vite** - Fast build tool

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🏗 Project Structure

```
src/
├── App.tsx                 # Main application
├── components/
│   ├── Dashboard.tsx       # Business dashboard
│   ├── POSSystem.tsx      # Point of sale interface
│   ├── Inventory.tsx      # Product management
│   ├── Customers.tsx      # Customer management
│   ├── Suppliers.tsx      # Supplier management
│   ├── Reports.tsx        # Analytics reports
│   ├── Financial.tsx      # Financial overview
│   └── Sidebar.tsx        # Navigation menu
├── context/
│   └── DataContext.tsx    # State management
└── index.css             # Global styles
```

## 🎨 Features for Wholesale Food Business

### Product Management
- Wholesale vs retail pricing
- Pack sizes (kg, liters, boxes)
- Minimum order quantities
- Expiry date tracking
- Batch numbers for traceability
- Storage conditions

### Customer Types
- **Retailers** - Supermarkets, grocery stores
- **Restaurants** - Food service establishments
- **Distributors** - Secondary wholesalers
- **Others** - Specialty buyers

### Food Categories
- Grains & Cereals
- Oils & Fats
- Frozen Foods
- Dairy Products
- Meat & Poultry
- Seafood
- Fruits & Vegetables
- Beverages
- Spices & Seasonings
- Canned Goods
- Bakery Items
- Snacks

## 📊 Sample Data Included
- Premium Rice Basmati (25kg packs)
- Extra Virgin Olive Oil (5L bottles)
- Frozen Chicken Breast (10kg packs)
- Sample wholesale customers
- Transaction history

## 🔄 Data Flow
Currently uses **mock data** stored in React context. For production use, connect to a backend API and database.

## 🚀 Next Steps
1. **Download this frontend**
2. **Get the backend separately** (Node.js + MySQL)
3. **Connect frontend to backend API**
4. **Deploy for commercial use**

## 💰 Commercial Use
This system is designed for selling to wholesale food businesses:
- Charge $149-399/month per client
- Perfect for food distributors
- Scales from small to enterprise operations

## 📱 Responsive Design
Works perfectly on:
- Desktop computers
- Tablets
- Mobile devices

## 🎯 Target Market
- Food wholesalers
- Agricultural distributors
- Restaurant suppliers
- Grocery chain suppliers
- Import/export food companies

---

**This is the FRONTEND only. Backend with MySQL database available separately.**