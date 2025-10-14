"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  isAdmin: boolean
  user: { name: string; email: string } | null
  login: (email: string, password: string) => Promise<boolean>
  loginAsAdmin: (password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    // Check if user is logged in from localStorage
    if (typeof window !== "undefined") {
      const storedAuth = localStorage.getItem("auth")
      if (storedAuth) {
        const authData = JSON.parse(storedAuth)
        setIsAuthenticated(true)
        setIsAdmin(authData.isAdmin || false)
        setUser(authData.user || null)
      }
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in production, this would call an API
    // For demo purposes, any email/password combination works
    if (email && password) {
      const userData = {
        name: email.split("@")[0],
        email: email,
      }
      const authData = {
        isAdmin: false,
        user: userData,
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("auth", JSON.stringify(authData))
      }
      setIsAuthenticated(true)
      setIsAdmin(false)
      setUser(userData)
      return true
    }
    return false
  }

  const loginAsAdmin = async (password: string): Promise<boolean> => {
    // Mock admin authentication - default password is "admin123"
    if (password === "admin123") {
      const authData = {
        isAdmin: true,
        user: { name: "Admin", email: "admin@trixtech.com" },
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("auth", JSON.stringify(authData))
      }
      setIsAuthenticated(true)
      setIsAdmin(true)
      setUser({ name: "Admin", email: "admin@trixtech.com" })
      return true
    }
    return false
  }

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth")
    }
    setIsAuthenticated(false)
    setIsAdmin(false)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, user, login, loginAsAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
