"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { User, LogOut } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()
  const { isAuthenticated, isAdmin, user, logout } = useAuth()

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">TRIXTECH</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/" ? "text-foreground" : "text-muted-foreground",
              )}
            >
              Home
            </Link>
            <Link
              href="/services"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/services" ? "text-foreground" : "text-muted-foreground",
              )}
            >
              Services
            </Link>
            <Link
              href="/bookings"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/bookings" ? "text-foreground" : "text-muted-foreground",
              )}
            >
              My Bookings
            </Link>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <User className="h-4 w-4" />
                    {user?.name || "User"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin">Admin Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/payments">Payment Management</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm">
                <Link href="/admin">Admin Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
