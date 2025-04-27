import { useState, useEffect, useCallback } from 'react';
import { 
  addProductToFirestore, 
  fetchProductsFromFirestore 
} from '../firebase/services/firestoreProduct';

// Define the Product interface
interface Product {
  id?: string;
  name: string;
  price: number;
  quantity: number;
  createdAt?: any;
  updatedAt?: any;
}

// Hook state interface
interface FirestoreProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook for managing products with Firestore
 */
export const useFirestoreProducts = () => {
  // State for products, loading status, and errors
  const [state, setState] = useState<FirestoreProductsState>({
    products: [],
    loading: false,
    error: null
  });

  // Fetch all products from Firestore
  const fetchProducts = useCallback(async () => {
    // Set loading state
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Fetch products from Firestore
      const products = await fetchProductsFromFirestore();
      
      // Update state with fetched products
      setState({
        products,
        loading: false,
        error: null
      });
      
      return products;
    } catch (error) {
      // Handle errors
      console.error('Error in fetchProducts:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to fetch products';
      
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      
      return [];
    }
  }, []);

  // Add a product to Firestore
  const addProduct = useCallback(async (product: Omit<Product, 'id'>) => {
    // Set loading state
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Add product to Firestore
      const newProduct = await addProductToFirestore(product);
      
      // Update state with the new product
      setState(prev => ({
        products: [...prev.products, newProduct],
        loading: false,
        error: null
      }));
      
      return newProduct;
    } catch (error) {
      // Handle errors
      console.error('Error in addProduct:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to add product';
      
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage 
      }));
      
      return null;
    }
  }, []);

  // Reset any error
  const resetError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Return the state and functions
  return {
    products: state.products,
    loading: state.loading,
    error: state.error,
    fetchProducts,
    addProduct,
    resetError
  };
}; 