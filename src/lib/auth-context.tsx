import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Define user related types
interface User {
  id: string;
  username: string;
  name?: string;
  email?: string;
  role: "super_admin" | "sub_admin" | "admin" | "manager" | "staff";
  shopId?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  superAdminId?: string; // ID of the super admin who created this sub-admin
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  hasPermission: (roles: string[]) => boolean;
  login: (userData: Partial<User>) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  getAllSuperAdmins: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Function to load user data from localStorage
  const loadUserData = () => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        
        // Load additional profile data if it exists
        const profileData = localStorage.getItem(`profile_${userData.id}`);
        if (profileData) {
          const profile = JSON.parse(profileData);
          setUser({ ...userData, ...profile });
        } else {
          setUser(userData);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem('currentUser');
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setIsInitialized(true);
  };

  // Load user data from localStorage on mount
  useEffect(() => {
    loadUserData();
    
    // Set up an event listener for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'currentUser' || e.key === null) {
        loadUserData();
      }
    };

    // Also listen for the custom storage event we dispatch
    const handleCustomStorageEvent = () => {
      loadUserData();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('storage', handleCustomStorageEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('storage', handleCustomStorageEvent);
    };
  }, []);

  const login = (userData: Partial<User>) => {
    if (!userData || !userData.id) {
      console.error("Invalid user data for login");
      return;
    }
    
    // Update the state with the user data
    setUser(userData as User);
    
    // Save the user data to localStorage
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    // Dispatch a custom event to notify other tabs
    window.dispatchEvent(new Event('auth-change'));
    
    console.log("User logged in:", userData);
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    
    // Dispatch a custom event to notify other tabs
    window.dispatchEvent(new Event('auth-change'));
    console.log("User logged out");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      // Save basic user data to currentUser in localStorage
      const basicUserData = {
        id: updatedUser.id,
        username: updatedUser.username,
        role: updatedUser.role,
        shopId: updatedUser.shopId,
        superAdminId: updatedUser.superAdminId
      };
      localStorage.setItem('currentUser', JSON.stringify(basicUserData));
      
      // Save profile data separately
      const profileData = {
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        avatar: updatedUser.avatar
      };
      localStorage.setItem(`profile_${updatedUser.id}`, JSON.stringify(profileData));
      
      // Dispatch a custom event to notify other tabs
      window.dispatchEvent(new Event('auth-change'));
    }
  };

  const hasPermission = (roles: string[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  // Function to get all super admins from localStorage
  const getAllSuperAdmins = (): User[] => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      return users.filter((user: User) => user.role === 'super_admin' || user.role === 'admin');
    } catch (error) {
      console.error("Error getting super admins:", error);
      return [];
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
    hasPermission,
    getAllSuperAdmins,
  };

  return (
    <AuthContext.Provider value={value}>
      {isInitialized ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
