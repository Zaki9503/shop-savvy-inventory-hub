import React, { createContext, useContext, ReactNode } from 'react';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types';

// Define the context type
interface ProductsContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchAllProducts: () => Promise<void>;
  fetchProduct: (id: string) => Promise<Product | null>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product | null>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  searchProducts: (searchTerm: string) => Promise<Product[]>;
  getProductsByCategory: (category: string) => Promise<Product[]>;
  resetError: () => void;
}

// Create the context
const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

// Provider component
export const ProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const {
    products,
    loading,
    error,
    fetchAllProducts,
    fetchProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    getProductsByCat,
    resetError
  } = useProducts();

  // Create the context value
  const value: ProductsContextType = {
    products,
    loading,
    error,
    fetchAllProducts,
    fetchProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    getProductsByCategory: getProductsByCat,
    resetError
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

// Custom hook to use the products context
export const useProductsContext = () => {
  const context = useContext(ProductsContext);
  
  if (context === undefined) {
    throw new Error('useProductsContext must be used within a ProductsProvider');
  }
  
  return context;
}; 