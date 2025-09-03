-- MySQL Database Schema for POS System
-- Run this script to create the database structure

-- Create database
CREATE DATABASE IF NOT EXISTS pos_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pos_system;

-- Tenants table (for multi-tenant architecture)
CREATE TABLE tenants (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    company_name VARCHAR(255) NOT NULL,
    subscription_plan ENUM('starter', 'professional', 'enterprise') DEFAULT 'starter',
    subscription_status ENUM('active', 'suspended', 'cancelled') DEFAULT 'active',
    max_users INT DEFAULT 5,
    max_products INT DEFAULT 1000,
    max_locations INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_company_name (company_name),
    INDEX idx_subscription_status (subscription_status)
);

-- Users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    tenant_id VARCHAR(36) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'cashier', 'viewer') DEFAULT 'cashier',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    INDEX idx_tenant_email (tenant_id, email),
    INDEX idx_role (role)
);

-- Categories table
CREATE TABLE categories (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    tenant_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    UNIQUE KEY unique_tenant_category (tenant_id, name)
);

-- Products table
CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    tenant_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    barcode VARCHAR(100),
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    wholesale_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    retail_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    cost DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    stock INT NOT NULL DEFAULT 0,
    unit VARCHAR(50) DEFAULT 'pieces',
    minimum_order_quantity INT DEFAULT 1,
    pack_size INT DEFAULT 1,
    category_id VARCHAR(36),
    brand VARCHAR(100),
    supplier VARCHAR(255),
    description TEXT,
    reorder_level INT DEFAULT 10,
    expiry_date DATE NULL,
    batch_number VARCHAR(100),
    storage_conditions TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_tenant_barcode (tenant_id, barcode),
    INDEX idx_tenant_name (tenant_id, name),
    INDEX idx_stock_reorder (stock, reorder_level),
    INDEX idx_expiry_date (expiry_date)
);

-- Customers table
CREATE TABLE customers (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    tenant_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    business_name VARCHAR(255),
    customer_type ENUM('retailer', 'restaurant', 'distributor', 'other') DEFAULT 'retailer',
    tax_id VARCHAR(100),
    credit_limit DECIMAL(10,2) DEFAULT 0.00,
    payment_terms VARCHAR(50) DEFAULT 'Cash on Delivery',
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    billing_address TEXT,
    delivery_address TEXT,
    balance DECIMAL(10,2) DEFAULT 0.00,
    total_purchases DECIMAL(12,2) DEFAULT 0.00,
    discount_rate DECIMAL(5,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    INDEX idx_tenant_name (tenant_id, name),
    INDEX idx_tenant_email (tenant_id, email),
    INDEX idx_customer_type (customer_type)
);

-- Suppliers table
CREATE TABLE suppliers (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    tenant_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    balance DECIMAL(10,2) DEFAULT 0.00,
    total_orders DECIMAL(12,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    INDEX idx_tenant_name (tenant_id, name)
);

-- Transactions table
CREATE TABLE transactions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    tenant_id VARCHAR(36) NOT NULL,
    transaction_number VARCHAR(50) NOT NULL,
    type ENUM('sale', 'return', 'purchase') DEFAULT 'sale',
    customer_id VARCHAR(36) NULL,
    supplier_id VARCHAR(36) NULL,
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    tax DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    discount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    payment_method ENUM('cash', 'credit_card', 'debit_card', 'mobile_payment', 'bank_transfer') DEFAULT 'cash',
    status ENUM('completed', 'pending', 'cancelled') DEFAULT 'completed',
    cashier_id VARCHAR(36),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
    FOREIGN KEY (cashier_id) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_tenant_transaction (tenant_id, transaction_number),
    INDEX idx_tenant_date (tenant_id, created_at),
    INDEX idx_type_status (type, status)
);

-- Transaction items table
CREATE TABLE transaction_items (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    transaction_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_product_id (product_id)
);

-- Inventory movements table (for tracking stock changes)
CREATE TABLE inventory_movements (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    tenant_id VARCHAR(36) NOT NULL,
    product_id VARCHAR(36) NOT NULL,
    movement_type ENUM('sale', 'purchase', 'adjustment', 'return') NOT NULL,
    quantity_change INT NOT NULL,
    previous_stock INT NOT NULL,
    new_stock INT NOT NULL,
    reference_id VARCHAR(36), -- transaction_id or adjustment_id
    notes TEXT,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_tenant_product (tenant_id, product_id),
    INDEX idx_movement_type (movement_type),
    INDEX idx_created_at (created_at)
);

-- Audit logs table
CREATE TABLE audit_logs (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    tenant_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id VARCHAR(36) NOT NULL,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_tenant_table (tenant_id, table_name),
    INDEX idx_user_action (user_id, action),
    INDEX idx_created_at (created_at)
);

-- Insert default categories
INSERT INTO categories (tenant_id, name, description) VALUES
('default-tenant', 'Grains & Cereals', 'Rice, wheat, oats, and other grain products'),
('default-tenant', 'Oils & Fats', 'Cooking oils, butter, margarine'),
('default-tenant', 'Frozen Foods', 'Frozen vegetables, meat, seafood'),
('default-tenant', 'Dairy Products', 'Milk, cheese, yogurt, cream'),
('default-tenant', 'Meat & Poultry', 'Fresh and processed meat products'),
('default-tenant', 'Seafood', 'Fresh and frozen fish and seafood'),
('default-tenant', 'Fruits & Vegetables', 'Fresh produce'),
('default-tenant', 'Beverages', 'Juices, soft drinks, water'),
('default-tenant', 'Spices & Seasonings', 'Herbs, spices, condiments'),
('default-tenant', 'Canned Goods', 'Canned vegetables, fruits, soups'),
('default-tenant', 'Bakery Items', 'Bread, pastries, baked goods'),
('default-tenant', 'Snacks', 'Chips, crackers, nuts');

-- Create indexes for better performance
CREATE INDEX idx_products_low_stock ON products (tenant_id, stock, reorder_level);
CREATE INDEX idx_transactions_daily ON transactions (tenant_id, DATE(created_at));
CREATE INDEX idx_customers_purchases ON customers (tenant_id, total_purchases DESC);