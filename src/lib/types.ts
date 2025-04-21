// Authentication Types
export type UserRole = 'admin' | 'manager' | 'staff';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  shopId?: string;
  avatar?: string;
  phone?: string;
  idProof?: string;
  address?: string;
  instagram?: string;
}

// Shop Types
export interface Shop {
  id: string;
  name: string;
  shopNo: string;
  address: string;
  managerId?: string;
  phone?: string;
  email?: string;
  createdAt: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  description?: string;
  image?: string;
  isActive: boolean;
}

// Inventory Types
export interface ShopInventory {
  shopId: string;
  productId: string;
  quantity: number;
  minStockLevel: number;
  lastUpdated: string;
}

// Sales Types
export type SaleType = 'cash' | 'credit' | 'lease';

export interface Sale {
  id: string;
  shopId: string;
  customerId?: string;
  saleType: SaleType;
  items: SaleItem[];
  total: number;
  paid: number;
  balance: number;
  createdBy: string;
  createdAt: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface SaleItem {
  productId: string;
  quantity: number;
  price: number;
  total: number;
}

// Customer Types
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  customerType: SaleType;
  createdAt: string;
}
