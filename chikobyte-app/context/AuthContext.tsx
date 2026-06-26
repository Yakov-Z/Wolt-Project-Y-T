import React, { createContext, useState, useContext } from 'react';

// Define the shape of our user object
interface User {
  id: string;
  realname: string;
  address: any;
  isadmin: boolean;
  image?: string;
}

// Define what our Context will hold
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, authToken: string) => void;
  logout: () => void;
}

// Create the actual context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component that wraps our app and holds the state
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Function to call when user successfully logs in
  const login = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
  };

  // Function to call when user logs out
  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to make it easy to use this context in other files
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};