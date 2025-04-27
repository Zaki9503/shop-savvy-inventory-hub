import { Shop, Product, ShopInventory, Sale } from "./types";

// Check if code is running in browser environment
const isBrowser = typeof window !== 'undefined';

// Storage keys
const STORAGE_KEYS = {
  SHOPS: 'shops',
  PRODUCTS: 'products',
  INVENTORY: 'inventory',
  SALES: 'sales',
  ACTIVE_SHOP: 'activeShop'
};

// Load data from localStorage
export const loadShops = (): Shop[] => {
  if (!isBrowser) return [];
  
  try {
    const storedShops = localStorage.getItem(STORAGE_KEYS.SHOPS);
    return storedShops ? JSON.parse(storedShops) : [];
  } catch (error) {
    console.error('Error loading shops from localStorage:', error);
    return [];
  }
};

export const loadProducts = (): Product[] => {
  if (!isBrowser) return [];
  
  try {
    const storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return storedProducts ? JSON.parse(storedProducts) : [];
  } catch (error) {
    console.error('Error loading products from localStorage:', error);
    return [];
  }
};

export const loadInventory = (): ShopInventory[] => {
  if (!isBrowser) return [];
  
  try {
    const storedInventory = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    return storedInventory ? JSON.parse(storedInventory) : [];
  } catch (error) {
    console.error('Error loading inventory from localStorage:', error);
    return [];
  }
};

export const loadSales = (): Sale[] => {
  if (!isBrowser) return [];
  
  try {
    const storedSales = localStorage.getItem(STORAGE_KEYS.SALES);
    return storedSales ? JSON.parse(storedSales) : [];
  } catch (error) {
    console.error('Error loading sales from localStorage:', error);
    return [];
  }
};

export const loadActiveShop = (): string | null => {
  if (!isBrowser) return null;
  
  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_SHOP);
  } catch (error) {
    console.error('Error loading active shop from localStorage:', error);
    return null;
  }
};

// Save data to localStorage
export const saveShops = (shops: Shop[]): void => {
  if (!isBrowser) return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.SHOPS, JSON.stringify(shops));
  } catch (error) {
    console.error('Error saving shops to localStorage:', error);
  }
};

export const saveProducts = (products: Product[]): void => {
  if (!isBrowser) return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (error) {
    console.error('Error saving products to localStorage:', error);
  }
};

export const saveInventory = (inventory: ShopInventory[]): void => {
  if (!isBrowser) return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  } catch (error) {
    console.error('Error saving inventory to localStorage:', error);
  }
};

export const saveSales = (sales: Sale[]): void => {
  if (!isBrowser) return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  } catch (error) {
    console.error('Error saving sales to localStorage:', error);
  }
};

export const saveActiveShop = (shopId: string | null): void => {
  if (!isBrowser) return;
  
  try {
    if (shopId) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SHOP, shopId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SHOP);
    }
  } catch (error) {
    console.error('Error saving active shop to localStorage:', error);
  }
}; 