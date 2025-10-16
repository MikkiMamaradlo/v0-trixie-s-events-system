"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { User, LogOut } from "lucide-react";

export function Navigation() {
  const pathname = usePathname();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  // Prevent hydration mismatch by not rendering auth-dependent content until client-side
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // On admin login page, show login/signup buttons instead of user account
  // Only apply this logic on client-side to avoid hydration mismatch
  const showUserMenu =
    isClient && isAuthenticated && !(pathname === "/admin" && !isAdmin);

  if (!isClient) {
    // Server-side render: show static navigation without auth-dependent content
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
                  pathname === "/" ? "text-foreground" : "text-muted-foreground"
                )}
              >
                Home
              </Link>
              <Link
                href="/services"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/services"
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                Services
              </Link>

              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

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
                pathname === "/" ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Home
            </Link>
            <Link
              href="/services"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/services"
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              Services
            </Link>
            {isAuthenticated && !isAdmin && (
              <Link
                href="/dashboard"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/dashboard"
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                Dashboard
              </Link>
            )}
            {isAuthenticated && !isAdmin && (
              <Link
                href="/bookings"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/bookings"
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                My Bookings
              </Link>
            )}

            {showUserMenu ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent"
                  >
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
              <div className="flex items-center gap-2">
                <Button asChild size="sm">
                  <Link href="/login">Login</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
