import React, { createContext, useContext, ReactNode } from 'react';
import { useFirestoreProducts } from '../hooks/useFirestoreProducts';

// Define the Product interface
interface Product {
  id?: string;
  name: string;
  price: number;
  quantity: number;
  createdAt?: any;
  updatedAt?: any;
}

// Context interface
interface FirestoreProductsContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<Product[]>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product | null>;
  resetError: () => void;
}

// Create context
const FirestoreProductsContext = createContext<FirestoreProductsContextType | undefined>(undefined);

/**
 * Provider component for Firestore products
 */
export const FirestoreProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Use the hook to manage products
  const { 
    products, 
    loading, 
    error, 
    fetchProducts, 
    addProduct, 
    resetError 
  } = useFirestoreProducts();

  // Context value
  const value: FirestoreProductsContextType = {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    resetError
  };

  return (
    <FirestoreProductsContext.Provider value={value}>
      {children}
    </FirestoreProductsContext.Provider>
  );
};

/**
 * Custom hook to use the Firestore products context
 */
export const useFirestoreProductsContext = () => {
  const context = useContext(FirestoreProductsContext);
  
  if (context === undefined) {
    throw new Error('useFirestoreProductsContext must be used within a FirestoreProductsProvider');
  }
  
  return context;
}; 