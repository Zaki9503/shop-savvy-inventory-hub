import React, { createContext, useContext, useState } from "react";
import { Shop, Product, ShopInventory, Sale, Customer } from "./types";

// Mock data for development
const MOCK_SHOPS: Shop[] = [
  {
    id: "shop1",
    name: "Downtown Grocery",
    shopNo: "DT001",
    address: "123 Main St, Downtown",
    managerId: "2",
    phone: "555-123-4567",
    email: "downtown@shopsavvy.com",
    createdAt: new Date(2023, 0, 15).toISOString(),
  },
  {
    id: "shop2",
    name: "Uptown Market",
    shopNo: "UT002",
    address: "456 High St, Uptown",
    phone: "555-987-6543",
    email: "uptown@shopsavvy.com",
    createdAt: new Date(2023, 3, 10).toISOString(),
  },
  {
    id: "shop3",
    name: "Westside Mart",
    shopNo: "WS003",
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

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "cust1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "555-111-2222",
    address: "123 Maple St, Anytown",
    customerType: "cash",
    createdAt: new Date(2023, 1, 15).toISOString(),
  },
  {
    id: "cust2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "555-333-4444",
    address: "456 Oak Ave, Anytown",
    customerType: "credit",
    createdAt: new Date(2023, 2, 10).toISOString(),
  },
  {
    id: "cust3",
    name: "Michael Davis",
    email: "michael.d@example.com",
    phone: "555-555-6666",
    address: "789 Pine Rd, Anytown",
    customerType: "lease",
    createdAt: new Date(2023, 3, 5).toISOString(),
  },
];

// Generate some sales for each shop
const generateMockSales = (): Sale[] => {
  const sales: Sale[] = [];
  const saleTypes: ("cash" | "online")[] = ["cash", "online"];
  const today = new Date();
  
  // Generate 15 random sales across different shops
  for (let i = 1; i <= 15; i++) {
    const shopId = `shop${Math.floor(Math.random() * 3) + 1}`;
    const saleType = saleTypes[Math.floor(Math.random() * 2)];
    const customerId = saleType !== "cash" 
      ? `cust${Math.floor(Math.random() * 2) + 2}` 
      : undefined;
    
    // Generate 1-3 random items for this sale
    const numItems = Math.floor(Math.random() * 3) + 1;
    const items = [];
    let total = 0;
    
    for (let j = 0; j < numItems; j++) {
      const productId = `prod${Math.floor(Math.random() * 5) + 1}`;
      const quantity = Math.floor(Math.random() * 5) + 1;
      
      // Find product price
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
    
    // For credit and lease, set partial payment
    let paid = total;
    let balance = 0;
    
    if (saleType === "credit" || saleType === "lease") {
      paid = Math.round((total * (Math.random() * 0.5 + 0.1)) * 100) / 100; // 10-60% paid
      balance = total - paid;
    }
    
    // Random date within the last 30 days
    const saleDate = new Date(today);
    saleDate.setDate(today.getDate() - Math.floor(Math.random() * 30));
    
    sales.push({
      id: `sale${i}`,
      shopId,
      customerId,
      saleType,
      items,
      total,
      paid,
      balance,
      createdBy: Math.random() > 0.5 ? "2" : "3", // manager or staff
      createdAt: saleDate.toISOString(),
      status: "completed"
    });
  }
  
  return sales;
};

const MOCK_SALES = generateMockSales();

// Data Context Type
interface DataContextType {
  shops: Shop[];
  products: Product[];
  inventory: ShopInventory[];
  sales: Sale[];
  customers: Customer[];
  
  // Shop operations
  addShop: (shop: Omit<Shop, "id" | "createdAt">) => Shop;
  updateShop: (id: string, data: Partial<Shop>) => Shop | null;
  deleteShop: (id: string) => boolean;
  getShop: (id: string) => Shop | undefined;
  
  // Product operations
  addProduct: (product: Omit<Product, "id">) => Product;
  updateProduct: (id: string, data: Partial<Product>) => Product | null;
  deleteProduct: (id: string) => boolean;
  getProduct: (id: string) => Product | undefined;
  
  // Inventory operations
  updateInventory: (shopId: string, productId: string, quantity: number) => ShopInventory | null;
  getShopInventory: (shopId: string) => ShopInventory[];
  getProductInventory: (productId: string) => ShopInventory[];
  
  // Sales operations
  addSale: (sale: Omit<Sale, "id" | "createdAt">) => Sale;
  getSalesByShop: (shopId: string) => Sale[];
  getSalesByType: (type: "cash" | "online") => Sale[];
  getSalesByCustomer: (customerId: string) => Sale[];
  
  // Customer operations
  addCustomer: (customer: Omit<Customer, "id" | "createdAt">) => Customer;
  updateCustomer: (id: string, data: Partial<Customer>) => Customer | null;
  deleteCustomer: (id: string) => boolean;
  getCustomer: (id: string) => Customer | undefined;
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
  const [shops, setShops] = useState<Shop[]>(MOCK_SHOPS);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [inventory, setInventory] = useState<ShopInventory[]>(MOCK_INVENTORY);
  const [sales, setSales] = useState<Sale[]>(MOCK_SALES);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);

  // Shop operations
  const addShop = (shopData: Omit<Shop, "id" | "createdAt">) => {
    const newShop: Shop = {
      ...shopData,
      id: `shop${shops.length + 1}`,
      createdAt: new Date().toISOString(),
    };
    setShops([...shops, newShop]);
    return newShop;
  };

  const updateShop = (id: string, data: Partial<Shop>) => {
    const index = shops.findIndex(shop => shop.id === id);
    if (index === -1) return null;

    const updatedShop = { ...shops[index], ...data };
    const updatedShops = [...shops];
    updatedShops[index] = updatedShop;
    setShops(updatedShops);
    return updatedShop;
  };

  const deleteShop = (id: string) => {
    const index = shops.findIndex(shop => shop.id === id);
    if (index === -1) return false;

    const updatedShops = [...shops];
    updatedShops.splice(index, 1);
    setShops(updatedShops);
    return true;
  };

  const getShop = (id: string) => shops.find(shop => shop.id === id);

  // Product operations
  const addProduct = (productData: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...productData,
      id: `prod${products.length + 1}`,
    };
    setProducts([...products, newProduct]);
    return newProduct;
  };

  const updateProduct = (id: string, data: Partial<Product>) => {
    const index = products.findIndex(product => product.id === id);
    if (index === -1) return null;

    const updatedProduct = { ...products[index], ...data };
    const updatedProducts = [...products];
    updatedProducts[index] = updatedProduct;
    setProducts(updatedProducts);
    return updatedProduct;
  };

  const deleteProduct = (id: string) => {
    const index = products.findIndex(product => product.id === id);
    if (index === -1) return false;

    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
    return true;
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

      setInventory([...inventory, newInventoryItem]);
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
      return updatedItem;
    }
  };

  const getShopInventory = (shopId: string) => 
    inventory.filter(item => item.shopId === shopId);

  const getProductInventory = (productId: string) => 
    inventory.filter(item => item.productId === productId);

  // Sales operations
  const addSale = (saleData: Omit<Sale, "id" | "createdAt">) => {
    const newSale: Sale = {
      ...saleData,
      id: generateSaleId(sales),
      createdAt: new Date().toISOString(),
    };

    // Update inventory for sold items
    newSale.items.forEach(item => {
      const inventoryItem = inventory.find(
        inv => inv.shopId === newSale.shopId && inv.productId === item.productId
      );

      if (inventoryItem) {
        updateInventory(
          newSale.shopId,
          item.productId,
          inventoryItem.quantity - item.quantity
        );
      }
    });

    setSales([...sales, newSale]);
    return newSale;
  };

  const getSalesByShop = (shopId: string) => 
    sales.filter(sale => sale.shopId === shopId);

  const getSalesByType = (type: "cash" | "online") => 
    sales.filter(sale => sale.saleType === type);

  const getSalesByCustomer = (customerId: string) => 
    sales.filter(sale => sale.customerId === customerId);

  // Customer operations
  const addCustomer = (customerData: Omit<Customer, "id" | "createdAt">) => {
    const newCustomer: Customer = {
      ...customerData,
      id: `cust${customers.length + 1}`,
      createdAt: new Date().toISOString(),
    };
    setCustomers([...customers, newCustomer]);
    return newCustomer;
  };

  const updateCustomer = (id: string, data: Partial<Customer>) => {
    const index = customers.findIndex(customer => customer.id === id);
    if (index === -1) return null;

    const updatedCustomer = { ...customers[index], ...data };
    const updatedCustomers = [...customers];
    updatedCustomers[index] = updatedCustomer;
    setCustomers(updatedCustomers);
    return updatedCustomer;
  };

  const deleteCustomer = (id: string) => {
    const index = customers.findIndex(customer => customer.id === id);
    if (index === -1) return false;

    const updatedCustomers = [...customers];
    updatedCustomers.splice(index, 1);
    setCustomers(updatedCustomers);
    return true;
  };

  const getCustomer = (id: string) => customers.find(customer => customer.id === id);

  return (
    <DataContext.Provider
      value={{
        shops,
        products,
        inventory,
        sales,
        customers,
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
        getSalesByCustomer,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        getCustomer,
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
