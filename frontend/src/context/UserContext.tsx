import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

// Define the User interface
interface User {
  userId: string;
  name: string;
  email: string;
  mobileNum?: string;
  sleepCycle?: string;
  dailyLimit?: number;
  taskCompletionPercentage?: number;
  token: string;
}

// Create the context
interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  console.log("asifs user", user);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Actions
  const login = (userData: User) => {
    setUser(userData);
    setError(null);
    setLoading(false);
    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setError(null);
    setLoading(false);
    // Clear from localStorage
    localStorage.removeItem("user");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      setError(null);
      // Update localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Initialize user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.log("Error parsing saved user data:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const value: UserContextType = {
    user,
    loading,
    error,
    setUser,
    setLoading,
    setError,
    login,
    logout,
    updateUser,
    clearError,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use the context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Export the context for direct access if needed
export { UserContext };
