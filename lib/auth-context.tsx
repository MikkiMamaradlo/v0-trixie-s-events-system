"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  createdAt: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  token: string | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  loginAsAdmin: (
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in from localStorage (for backward compatibility)
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("token") || localStorage.getItem("adminToken");
      if (token) {
        // Verify token with API
        verifyToken(token);
      }
    }
  }, []);

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setIsAdmin(data.user.role === "admin");
        setUser(data.user);
      } else {
        // Token invalid, clear it
        localStorage.removeItem("token");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("auth");
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("auth");
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        const userData = data.user;
        const tokenData = data.token;

        // Store in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("token", tokenData);
          localStorage.setItem("user", JSON.stringify(userData));
        }

        // Update state
        setToken(tokenData);
        setUser(userData);
        setIsAuthenticated(true);
        setIsAdmin(userData.role === "admin");

        return { success: true };
      } else {
        return { success: false, error: data.message || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const loginAsAdmin = async (
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        const userData = data.user;
        const tokenData = data.token;

        // Store in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("token", tokenData);
          localStorage.setItem("user", JSON.stringify(userData));
        }

        // Update state
        setToken(tokenData);
        setUser(userData);
        setIsAuthenticated(true);
        setIsAdmin(true);

        return { success: true };
      } else {
        return { success: false, error: data.message || "Admin login failed" };
      }
    } catch (error) {
      console.error("Admin login error:", error);
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      const data = await response.json();

      if (data.success) {
        const userData = data.user;
        const tokenData = data.token;

        // Store in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("token", tokenData);
          localStorage.setItem("user", JSON.stringify(userData));
        }

        // Update state
        setToken(tokenData);
        setUser(userData);
        setIsAuthenticated(true);
        setIsAdmin(userData.role === "admin");

        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  const refreshUser = async () => {
    if (!token) return;

    try {
      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
          setIsAdmin(data.user.role === "admin");
          if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(data.user));
          }
        }
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isAdmin,
        user,
        token,
        login,
        loginAsAdmin,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
