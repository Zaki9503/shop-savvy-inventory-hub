
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define user related types
interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "staff";
  shopId?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  hasPermission: (roles: string[]) => boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

// Create a mock user for development without login
const defaultUser: User = {
  id: "user1",
  name: "John Doe",
  email: "john@example.com",
  role: "admin",
  phone: "+1 234 567 890",
  address: "123 Main St, City, Country",
  avatar: "",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(defaultUser);

  const login = async (email: string, password: string) => {
    // Mock login function
    console.log("Login attempt with:", email, password);
    setUser(defaultUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const hasPermission = (roles: string[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
