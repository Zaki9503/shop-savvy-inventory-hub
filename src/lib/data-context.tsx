import React, { createContext, useContext, useState, useEffect } from "react";
import { Shop, Product, ShopInventory, Sale, SaleType, SaleItem } from "./types";
import {
  loadShops,
  loadProducts,
  loadInventory,
  loadSales,
  loadActiveShop,
  saveShops,
  saveProducts,
  saveInventory,
  saveSales,
  saveActiveShop
} from "./storage-utils";

// Mock data for development
const MOCK_SHOPS: Shop[] = [
  {
    id: "shop1",
    name: "Downtown Grocery",
    storeNumber: "DT001",
    address: "123 Main St, Downtown",
    managerId: "2",
    phone: "555-123-4567",
    email: "downtown@shopsavvy.com",
    createdAt: new Date(2023, 0, 15).toISOString(),
  },
  {
    id: "shop2",
    name: "Uptown Market",
    storeNumber: "UT002",
    address: "456 High St, Uptown",
    phone: "555-987-6543",
    email: "uptown@shopsavvy.com",
    createdAt: new Date(2023, 3, 10).toISOString(),
  },
  {
    id: "shop3",
    name: "Westside Mart",
    storeNumber: "WS003",
    address: "789 West Ave, Westside",
    phone: "555-456-7890",
    email: "westside@shopsavvy.com",
    createdAt: new Date(2023, 5, 22).toISOString(),
  },
];

const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod1",
    name: "Organic Milk",
    sku: "OM001",
    category: "Dairy",
    price: 4.99,
    cost: 3.50,
    description: "Fresh organic whole milk, 1 gallon",
    image: "https://placehold.co/200x200?text=Milk",
    isActive: true,
    expiryDate: new Date(2024, 0, 15).toISOString(),
    stock: 100
  },
  {
    id: "prod2",
    name: "Whole Wheat Bread",
    sku: "WB002",
    category: "Bakery",
    price: 3.99,
    cost: 2.25,
    description: "Artisan whole wheat bread, 1 loaf",
    image: "https://placehold.co/200x200?text=Bread",
    isActive: true,
    expiryDate: new Date(2024, 2, 10).toISOString(),
    stock: 75
  },
  {
    id: "prod3",
    name: "Organic Eggs",
    sku: "OE003",
    category: "Dairy",
    price: 5.99,
    cost: 4.25,
    description: "Free-range organic eggs, dozen",
    image: "https://placehold.co/200x200?text=Eggs",
    isActive: true,
    expiryDate: new Date(2023, 11, 22).toISOString(),
    stock: 120
  },
  {
    id: "prod4",
    name: "Avocados",
    sku: "AV004",
    category: "Produce",
    price: 2.50,
    cost: 1.75,
    description: "Ripe Hass avocados, each",
    image: "https://placehold.co/200x200?text=Avocado",
    isActive: true,
    expiryDate: new Date(2024, 3, 5).toISOString(),
    stock: 200
  },
  {
    id: "prod5",
    name: "Ground Coffee",
    sku: "GC005",
    category: "Beverages",
    price: 11.99,
    cost: 8.50,
    description: "Premium ground coffee, 12 oz bag",
    image: "https://placehold.co/200x200?text=Coffee",
    isActive: true,
    expiryDate: new Date(2024, 4, 18).toISOString(),
    stock: 85
  },
];

const MOCK_INVENTORY: ShopInventory[] = [
  // Downtown Grocery
  { shopId: "shop1", productId: "prod1", quantity: 50, minStockLevel: 10, lastUpdated: new Date().toISOString() },
  { shopId: "shop1", productId: "prod2", quantity: 35, minStockLevel: 5, lastUpdated: new Date().toISOString() },
  { shopId: "shop1", productId: "prod3", quantity: 28, minStockLevel: 8, lastUpdated: new Date().toISOString() },
  { shopId: "shop1", productId: "prod4", quantity: 40, minStockLevel: 10, lastUpdated: new Date().toISOString() },
  { shopId: "shop1", productId: "prod5", quantity: 12, minStockLevel: 5, lastUpdated: new Date().toISOString() },
  
  // Uptown Market
  { shopId: "shop2", productId: "prod1", quantity: 35, minStockLevel: 10, lastUpdated: new Date().toISOString() },
  { shopId: "shop2", productId: "prod2", quantity: 20, minStockLevel: 5, lastUpdated: new Date().toISOString() },
  { shopId: "shop2", productId: "prod3", quantity: 15, minStockLevel: 8, lastUpdated: new Date().toISOString() },
  { shopId: "shop2", productId: "prod4", quantity: 25, minStockLevel: 10, lastUpdated: new Date().toISOString() },
  { shopId: "shop2", productId: "prod5", quantity: 8, minStockLevel: 5, lastUpdated: new Date().toISOString() },
  
  // Westside Mart
  { shopId: "shop3", productId: "prod1", quantity: 25, minStockLevel: 10, lastUpdated: new Date().toISOString() },
  { shopId: "shop3", productId: "prod2", quantity: 15, minStockLevel: 5, lastUpdated: new Date().toISOString() },
  { shopId: "shop3", productId: "prod3", quantity: 22, minStockLevel: 8, lastUpdated: new Date().toISOString() },
  { shopId: "shop3", productId: "prod4", quantity: 35, minStockLevel: 10, lastUpdated: new Date().toISOString() },
  { shopId: "shop3", productId: "prod5", quantity: 10, minStockLevel: 5, lastUpdated: new Date().toISOString() },
];

// Generate some sales for each shop
const generateMockSales = (): Sale[] => {
  const sales: Sale[] = [];
  const saleTypes: SaleType[] = ["cash", "online"];
  const today = new Date();
  
  // Generate 15 random sales
  for (let i = 1; i <= 15; i++) {
    const shopId = `shop${Math.floor(Math.random() * 3) + 1}`;
    const saleType = saleTypes[Math.floor(Math.random() * 2)];
    
    // Generate 1-3 random items for this sale
    const numItems = Math.floor(Math.random() * 3) + 1;
    const items = [];
    let total = 0;
    
    for (let j = 0; j < numItems; j++) {
      const productId = `prod${Math.floor(Math.random() * 5) + 1}`;
      const quantity = Math.floor(Math.random() * 5) + 1;
      
      const product = MOCK_PRODUCTS.find(p => p.id === productId);
      if (product) {
        const price = product.price;
        const itemTotal = price * quantity;
        total += itemTotal;
        
        items.push({
          productId,
          quantity,
          price,
          total: itemTotal
        });
      }
    }
    
    // Random date within the last 30 days
    const saleDate = new Date(today);
    saleDate.setDate(today.getDate() - Math.floor(Math.random() * 30));
    
    sales.push({
      id: `sale${i}`,
      shopId,
      saleType,
      items,
      total,
      paid: total,
      balance: 0,
      createdBy: Math.random() > 0.5 ? "2" : "3",
      createdAt: saleDate.toISOString(),
      status: "completed"
    });
  }
  
  return sales;
};

const MOCK_SALES = generateMockSales();

// Improved return types for shop and product operations
interface ShopOperationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Data Context Type
interface DataContextType {
  shops: Shop[];
  products: Product[];
  inventory: ShopInventory[];
  sales: Sale[];
  
  // Shop operations with improved return types
  addShop: (shop: Omit<Shop, "id" | "createdAt">) => ShopOperationResult<Shop>;
  updateShop: (id: string, data: Partial<Shop>) => ShopOperationResult<Shop>;
  deleteShop: (id: string) => ShopOperationResult<boolean>;
  getShop: (id: string) => Shop | undefined;
  
  // Product operations with improved return types
  addProduct: (product: Omit<Product, "id">) => ShopOperationResult<Product>;
  updateProduct: (id: string, data: Partial<Product>) => ShopOperationResult<Product>;
  deleteProduct: (id: string) => ShopOperationResult<boolean>;
  getProduct: (id: string) => Product | undefined;
  getShopProducts: (shopId: string) => Product[];
  
  // Inventory operations
  updateInventory: (shopId: string, productId: string, quantity: number) => ShopInventory | null;
  getShopInventory: (shopId: string) => ShopInventory[];
  getProductInventory: (productId: string) => ShopInventory[];
  removeProductFromShop: (shopId: string, productId: string) => boolean;
  isProductInAnyShop: (productId: string) => boolean;
  
  // Sales operations
  addSale: (sale: Omit<Sale, "id" | "createdAt">) => Sale;
  getSalesByShop: (shopId: string) => Sale[];
  getSalesByType: (type: SaleType) => Sale[];

  activeShopId: string | null;
  setActiveShop: (shopId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const generateSaleId = (sales: Sale[]): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  
  // Filter sales from current month
  const monthSales = sales.filter(sale => {
    const saleDate = new Date(sale.createdAt);
    return saleDate.getMonth() === today.getMonth() && 
           saleDate.getFullYear() === today.getFullYear();
  });
  
  // Get sequence number
  const sequence = (monthSales.length + 1).toString().padStart(3, '0');
  
  // Format: INV-YYYYMM-XXX (e.g., INV-202504-001)
  return `INV-${year}${month}-${sequence}`;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with data from localStorage or fallback to mock data if empty
  const [shops, setShops] = useState<Shop[]>(() => {
    const storedShops = loadShops();
    return storedShops.length > 0 ? storedShops : MOCK_SHOPS;
  });
  
  const [products, setProducts] = useState<Product[]>(() => {
    const storedProducts = loadProducts();
    return storedProducts.length > 0 ? storedProducts : MOCK_PRODUCTS;
  });
  
  const [inventory, setInventory] = useState<ShopInventory[]>(() => {
    const storedInventory = loadInventory();
    return storedInventory.length > 0 ? storedInventory : MOCK_INVENTORY;
  });
  
  const [sales, setSales] = useState<Sale[]>(() => {
    const storedSales = loadSales();
    return storedSales.length > 0 ? storedSales : MOCK_SALES;
  });
  
  const [activeShopId, setActiveShopId] = useState<string | null>(() => {
    return loadActiveShop();
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveShops(shops);
  }, [shops]);
  
  useEffect(() => {
    saveProducts(products);
  }, [products]);
  
  useEffect(() => {
    saveInventory(inventory);
  }, [inventory]);
  
  useEffect(() => {
    saveSales(sales);
  }, [sales]);
  
  useEffect(() => {
    saveActiveShop(activeShopId);
  }, [activeShopId]);

  // Shop operations
  const addShop = (shopData: Omit<Shop, "id" | "createdAt">) => {
    // Check if a shop with the same name already exists
    const shopWithSameName = shops.find(
      shop => shop.name.toLowerCase() === shopData.name.toLowerCase()
    );
    
    if (shopWithSameName) {
      console.error("A shop with this name already exists");
      return { success: false, error: "A shop with this name already exists" };
    }

    // Check if a shop with the same store number already exists
    const shopWithSameNumber = shops.find(
      shop => shop.storeNumber === shopData.storeNumber
    );
    
    if (shopWithSameNumber) {
      console.error("A shop with this store number already exists");
      return { success: false, error: "A shop with this store number already exists" };
    }

    const newShop: Shop = {
      ...shopData,
      id: `shop${shops.length + 1}`,
      createdAt: new Date().toISOString(),
    };
    
    const updatedShops = [...shops, newShop];
    setShops(updatedShops);
    
    // Immediately save to localStorage
    saveShops(updatedShops);
    
    return { success: true, data: newShop };
  };

  const updateShop = (id: string, data: Partial<Shop>) => {
    const index = shops.findIndex(shop => shop.id === id);
    if (index === -1) return { success: false, error: "Shop not found" };

    // If name is being updated, check for duplicates
    if (data.name) {
      const shopWithSameName = shops.find(
        shop => shop.id !== id && shop.name.toLowerCase() === data.name!.toLowerCase()
      );
      
      if (shopWithSameName) {
        console.error("A shop with this name already exists");
        return { success: false, error: "A shop with this name already exists" };
      }
    }

    // If store number is being updated, check for duplicates
    if (data.storeNumber) {
      const shopWithSameNumber = shops.find(
        shop => shop.id !== id && shop.storeNumber === data.storeNumber
      );
      
      if (shopWithSameNumber) {
        console.error("A shop with this store number already exists");
        return { success: false, error: "A shop with this store number already exists" };
      }
    }

    const updatedShop = { ...shops[index], ...data };
    const updatedShops = [...shops];
    updatedShops[index] = updatedShop;
    setShops(updatedShops);
    
    // Immediately save to localStorage
    saveShops(updatedShops);
    
    return { success: true, data: updatedShop };
  };

  const deleteShop = (id: string) => {
    const index = shops.findIndex(shop => shop.id === id);
    if (index === -1) return { success: false, error: "Shop not found" };

    // Check if there are any sales associated with this shop
    if (sales.some(sale => sale.shopId === id)) {
      console.error("Cannot delete shop with existing sales records");
      return { success: false, error: "Cannot delete shop with existing sales records" };
    }

    // Get shop before removing it to access managerId
    const shopToDelete = shops[index];
    
    // Remove shop from state
    const updatedShops = [...shops];
    updatedShops.splice(index, 1);
    setShops(updatedShops);
    
    // Save to localStorage
    saveShops(updatedShops);
    
    // Handle inventory cleanup
    const updatedInventory = inventory.filter(item => item.shopId !== id);
    if (updatedInventory.length !== inventory.length) {
      setInventory(updatedInventory);
      saveInventory(updatedInventory);
    }
    
    // If this shop was the active shop, clear the active shop
    if (activeShopId === id) {
      setActiveShopId(null);
      saveActiveShop(null);
    }
    
    // Clean up users associated with this shop
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.filter((user: any) => user.shopId !== id);
      
      // If we have a specific managerId, ensure we remove their profile data too
      if (shopToDelete.managerId) {
        localStorage.removeItem(`profile_${shopToDelete.managerId}`);
      }
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    } catch (error) {
      console.error("Error cleaning up user data:", error);
      // Don't fail the deletion if user cleanup fails
    }

    return { success: true, data: true };
  };

  const getShop = (id: string) => shops.find(shop => shop.id === id);

  // Product operations
  const addProduct = (productData: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...productData,
      id: `prod${products.length + 1}`,
    };
    
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    
    // Immediately save to localStorage
    saveProducts(updatedProducts);
    
    return { success: true, data: newProduct };
  };

  const updateProduct = (id: string, data: Partial<Product>) => {
    const index = products.findIndex(product => product.id === id);
    if (index === -1) return { success: false, error: "Product not found" };

    const updatedProduct = { ...products[index], ...data };
    const updatedProducts = [...products];
    updatedProducts[index] = updatedProduct;
    setProducts(updatedProducts);
    
    // Immediately save to localStorage
    saveProducts(updatedProducts);
    
    return { success: true, data: updatedProduct };
  };

  const deleteProduct = (id: string) => {
    const index = products.findIndex(product => product.id === id);
    if (index === -1) return { success: false, error: "Product not found" };

    // Check if product is used in any shop's inventory
    const isProductInUse = inventory.some(item => item.productId === id);
    if (isProductInUse) {
      // If product is in use, we should remove it from all shops' inventory first
      const updatedInventory = inventory.filter(item => item.productId !== id);
      setInventory(updatedInventory);
      
      // Save updated inventory to localStorage
      saveInventory(updatedInventory);
    }

    // Check if product is referenced in any sales
    const isProductInSales = sales.some(sale => 
      sale.items.some(item => item.productId === id)
    );

    if (isProductInSales) {
      console.warn("Product is referenced in sales history. Deleting anyway but sales records will be affected.");
    }

    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
    
    // Immediately save to localStorage
    saveProducts(updatedProducts);
    
    return { success: true, data: true };
  };

  const getProduct = (id: string) => products.find(product => product.id === id);

  // Inventory operations
  const updateInventory = (shopId: string, productId: string, quantity: number) => {
    const index = inventory.findIndex(
      item => item.shopId === shopId && item.productId === productId
    );

    if (index === -1) {
      // Create new inventory entry if it doesn't exist
      const product = products.find(p => p.id === productId);
      if (!product) return null;

      const shop = shops.find(s => s.id === shopId);
      if (!shop) return null;

      const newInventoryItem: ShopInventory = {
        shopId,
        productId,
        quantity,
        minStockLevel: 5, // Default value
        lastUpdated: new Date().toISOString(),
      };

      const updatedInventory = [...inventory, newInventoryItem];
      setInventory(updatedInventory);
      
      // Immediately save to localStorage
      saveInventory(updatedInventory);
      
      return newInventoryItem;
    } else {
      // Update existing inventory entry
      const updatedItem = {
        ...inventory[index],
        quantity,
        lastUpdated: new Date().toISOString(),
      };

      const updatedInventory = [...inventory];
      updatedInventory[index] = updatedItem;
      setInventory(updatedInventory);
      
      // Immediately save to localStorage
      saveInventory(updatedInventory);
      
      return updatedItem;
    }
  };

  const getShopInventory = (shopId: string) => 
    inventory.filter(item => item.shopId === shopId);

  const getProductInventory = (productId: string) => 
    inventory.filter(item => item.productId === productId);

  // Update product stock when a sale is made
  const updateProductStock = (shopId: string, items: SaleItem[]) => {
    items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        const updatedProduct = {
          ...product,
          stock: Math.max(0, product.stock - item.quantity)
        };
        const result = updateProduct(product.id, updatedProduct);
        if (!result.success) {
          console.error(`Failed to update stock for product ${product.id}: ${result.error}`);
        }
      }
    });
  };

  // Sales operations
  const addSale = (saleData: Omit<Sale, "id" | "createdAt">) => {
    const newSale: Sale = {
      ...saleData,
      id: generateSaleId(sales),
      createdAt: new Date().toISOString(),
    };

    // Update product stock levels
    updateProductStock(newSale.shopId, newSale.items);

    const updatedSales = [...sales, newSale];
    setSales(updatedSales);
    
    // Save to localStorage
    saveSales(updatedSales);
    
    return newSale;
  };

  const getSalesByShop = (shopId: string) => 
    sales.filter(sale => sale.shopId === shopId);

  const getSalesByType = (type: SaleType) => 
    sales.filter(sale => sale.saleType === type);

  const setActiveShop = (shopId: string) => {
    setActiveShopId(shopId);
    saveActiveShop(shopId);
  };

  const removeProductFromShop = (shopId: string, productId: string) => {
    // Find the inventory entry for this shop and product
    const index = inventory.findIndex(
      item => item.shopId === shopId && item.productId === productId
    );
    
    if (index === -1) return false; // Inventory item not found
    
    // Remove item from inventory
    const updatedInventory = [...inventory];
    updatedInventory.splice(index, 1);
    setInventory(updatedInventory);
    
    // Save to localStorage
    saveInventory(updatedInventory);
    
    return true;
  };

  const isProductInAnyShop = (productId: string) => {
    return inventory.some(item => item.productId === productId);
  };

  const getShopProducts = (shopId: string) => {
    // Get all inventory items for this shop
    const shopInventory = inventory.filter(item => item.shopId === shopId);
    
    // Get the product IDs from the inventory
    const productIds = shopInventory.map(item => item.productId);
    
    // Filter products to only include those in the shop's inventory
    return products.filter(product => productIds.includes(product.id));
  };

  return (
    <DataContext.Provider
      value={{
        shops,
        products,
        inventory,
        sales,
        activeShopId,
        setActiveShop,
        addShop,
        updateShop,
        deleteShop,
        getShop,
        addProduct,
        updateProduct,
        deleteProduct,
        getProduct,
        updateInventory,
        getShopInventory,
        getProductInventory,
        addSale,
        getSalesByShop,
        getSalesByType,
        removeProductFromShop,
        isProductInAnyShop,
        getShopProducts,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
