import { useState, useEffect, useCallback } from 'react';
import { Product } from '../types';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Collection reference
const productsCollection = collection(db, 'products');

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

interface ProductHook extends ProductState {
  fetchAllProducts: () => Promise<void>;
  fetchProduct: (id: string) => Promise<Product | null>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product | null>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  searchProducts: (searchTerm: string) => Promise<Product[]>;
  getProductsByCat: (category: string) => Promise<Product[]>;
  resetError: () => void;
}

export const useProducts = (): ProductHook => {
  const [state, setState] = useState<ProductState>({
    products: [],
    loading: false,
    error: null
  });

  // Reset error
  const resetError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Fetch all products
  const fetchAllProducts = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Create a query ordered by name
      const q = query(productsCollection, orderBy('name'));
      
      // Execute the query
      const querySnapshot = await getDocs(q);
      
      // Convert the query results to an array of products
      const fetchedProducts: Product[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedProducts.push({
          id: doc.id,
          name: data.name,
          sku: data.sku || `SKU-${doc.id.slice(0, 5)}`,
          category: data.category || 'Uncategorized',
          price: data.price,
          cost: data.cost || data.price * 0.7,
          description: data.description || '',
          image: data.image || '',
          isActive: data.isActive !== undefined ? data.isActive : true,
          expiryDate: data.expiryDate || null,
          stock: data.quantity || 0,
          updatedAt: data.updatedAt?.toDate?.() || new Date(),
          createdAt: data.createdAt?.toDate?.() || new Date()
        });
      });
      
      setState({
        products: fetchedProducts,
        loading: false,
        error: null
      });
      
      console.log('Fetched', fetchedProducts.length, 'products from Firestore');
    } catch (error) {
      console.error('Error fetching products:', error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch products' 
      }));
    }
  }, []);

  // Fetch a single product
  const fetchProduct = useCallback(async (id: string): Promise<Product | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      
      setState(prev => ({ ...prev, loading: false }));
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name,
          sku: data.sku || `SKU-${docSnap.id.slice(0, 5)}`,
          category: data.category || 'Uncategorized',
          price: data.price,
          cost: data.cost || data.price * 0.7,
          description: data.description || '',
          image: data.image || '',
          isActive: data.isActive !== undefined ? data.isActive : true,
          expiryDate: data.expiryDate || null,
          stock: data.quantity || 0,
          updatedAt: data.updatedAt?.toDate?.() || new Date(),
          createdAt: data.createdAt?.toDate?.() || new Date()
        };
      } else {
        setState(prev => ({ ...prev, error: 'Product not found' }));
        return null;
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch product' 
      }));
      return null;
    }
  }, []);

  // Add a product
  const addProduct = useCallback(async (product: Omit<Product, 'id'>): Promise<Product | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Prepare the product data for Firestore
      // Map from the Product type to Firestore document structure
      const firestoreProduct = {
        name: product.name,
        sku: product.sku || `SKU-${Date.now()}`,
        category: product.category || 'Uncategorized',
        price: product.price,
        cost: product.cost || product.price * 0.7,
        description: product.description || '',
        image: product.image || '',
        isActive: product.isActive !== undefined ? product.isActive : true,
        expiryDate: product.expiryDate || null,
        quantity: product.stock || 0, // Store as quantity in Firestore
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      // Add to Firestore
      const docRef = await addDoc(productsCollection, firestoreProduct);
      
      // Create the product with ID for the app
      const newProduct: Product = {
        id: docRef.id,
        ...product,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Update state with the new product
      setState(prev => ({ 
        products: [...prev.products, newProduct],
        loading: false,
        error: null
      }));
      
      console.log('Product added with ID:', docRef.id);
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to add product' 
      }));
      return null;
    }
  }, []);

  // Update a product
  const updateProduct = useCallback(async (id: string, updates: Partial<Product>): Promise<Product | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const docRef = doc(db, 'products', id);
      
      // Map from the Product type to Firestore document structure
      const firestoreUpdates: Record<string, any> = {
        updatedAt: serverTimestamp()
      };
      
      // Copy relevant fields
      if (updates.name !== undefined) firestoreUpdates.name = updates.name;
      if (updates.sku !== undefined) firestoreUpdates.sku = updates.sku;
      if (updates.category !== undefined) firestoreUpdates.category = updates.category;
      if (updates.price !== undefined) firestoreUpdates.price = updates.price;
      if (updates.cost !== undefined) firestoreUpdates.cost = updates.cost;
      if (updates.description !== undefined) firestoreUpdates.description = updates.description;
      if (updates.image !== undefined) firestoreUpdates.image = updates.image;
      if (updates.isActive !== undefined) firestoreUpdates.isActive = updates.isActive;
      if (updates.expiryDate !== undefined) firestoreUpdates.expiryDate = updates.expiryDate;
      if (updates.stock !== undefined) firestoreUpdates.quantity = updates.stock;
      
      // Update in Firestore
      await updateDoc(docRef, firestoreUpdates);
      
      // Find the product in the state
      const existingProductIndex = state.products.findIndex(p => p.id === id);
      
      if (existingProductIndex !== -1) {
        // Create an updated product object
        const updatedProduct: Product = {
          ...state.products[existingProductIndex],
          ...updates,
          updatedAt: new Date()
        };
        
        // Update the state
        const updatedProducts = [...state.products];
        updatedProducts[existingProductIndex] = updatedProduct;
        
        setState({
          products: updatedProducts,
          loading: false,
          error: null
        });
        
        return updatedProduct;
      } else {
        // Product not found in state, fetch it
        const product = await fetchProduct(id);
        
        if (product) {
          // Add to state if not already there
          setState(prev => ({
            ...prev,
            products: [...prev.products, product]
          }));
        }
        
        return product;
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to update product' 
      }));
      return null;
    }
  }, [fetchProduct, state.products]);

  // Delete a product
  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const docRef = doc(db, 'products', id);
      await deleteDoc(docRef);
      
      // Remove the product from state
      setState(prev => ({
        products: prev.products.filter(product => product.id !== id),
        loading: false,
        error: null
      }));
      
      console.log('Product deleted:', id);
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to delete product' 
      }));
      return false;
    }
  }, []);

  // Search products
  const searchProducts = useCallback(async (searchTerm: string): Promise<Product[]> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // For simplicity, we'll fetch all products and filter on the client
      // In a production app, you might want to use Firestore's array-contains or Algolia
      const result = await fetchAllProducts();
      
      // Filter products that match the search term
      const filteredProducts = state.products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setState(prev => ({ ...prev, loading: false }));
      return filteredProducts;
    } catch (error) {
      console.error('Error searching products:', error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to search products' 
      }));
      return [];
    }
  }, [fetchAllProducts, state.products]);

  // Get products by category
  const getProductsByCat = useCallback(async (category: string): Promise<Product[]> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Create a query for products in the specific category
      const q = query(
        productsCollection, 
        where('category', '==', category),
        orderBy('name')
      );
      
      // Execute the query
      const querySnapshot = await getDocs(q);
      
      // Convert the query results to an array of products
      const products: Product[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          name: data.name,
          sku: data.sku || `SKU-${doc.id.slice(0, 5)}`,
          category: data.category || 'Uncategorized',
          price: data.price,
          cost: data.cost || data.price * 0.7,
          description: data.description || '',
          image: data.image || '',
          isActive: data.isActive !== undefined ? data.isActive : true,
          expiryDate: data.expiryDate || null,
          stock: data.quantity || 0,
          updatedAt: data.updatedAt?.toDate?.() || new Date(),
          createdAt: data.createdAt?.toDate?.() || new Date()
        });
      });
      
      setState(prev => ({ ...prev, loading: false }));
      return products;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch products by category' 
      }));
      return [];
    }
  }, []);

  // Load products on mount
  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  return {
    ...state,
    fetchAllProducts,
    fetchProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    getProductsByCat,
    resetError
  };
}; 