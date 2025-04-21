
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "./types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for development
const MOCK_USERS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@shopsavvy.com",
    role: "admin" as UserRole,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
  },
  {
    id: "2",
    name: "Shop Manager",
    email: "manager@shopsavvy.com",
    role: "manager" as UserRole,
    shopId: "shop1",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Manager",
    phone: "+1 (555) 123-4567",
  },
  {
    id: "3",
    name: "Staff Member",
    email: "staff@shopsavvy.com",
    role: "staff" as UserRole,
    shopId: "shop1",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Staff",
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // This would be replaced with an actual API call in production
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user with matching email
      const matchedUser = MOCK_USERS.find(u => u.email === email);
      
      // In a real app, you would verify the password hash here
      if (matchedUser && password === "password") {
        setUser(matchedUser);
        localStorage.setItem("user", JSON.stringify(matchedUser));
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const hasPermission = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
