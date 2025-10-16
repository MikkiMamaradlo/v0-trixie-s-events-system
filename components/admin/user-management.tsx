"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Mail,
  Calendar,
  Shield,
  Search,
  Edit,
  Trash2,
  UserPlus,
} from "lucide-react";
import { format } from "date-fns";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "customer";
  status: "active" | "inactive";
  createdAt: string;
  lastLogin?: string;
  bookingsCount: number;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "customer" as "admin" | "customer",
    status: "active" as "active" | "inactive",
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    if (typeof window !== "undefined") {
      const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const storedBookings = JSON.parse(
        localStorage.getItem("bookings") || "[]"
      );

      // Calculate bookings count for each user
      const usersWithBookings = storedUsers.map((user: any) => ({
        ...user,
        bookingsCount: storedBookings.filter(
          (booking: any) => booking.email === user.email
        ).length,
      }));

      if (usersWithBookings.length === 0) {
        // Initialize with default admin user
        const defaultUsers = [
          {
            id: 1,
            name: "Admin User",
            email: "admin@trixtech.com",
            role: "admin" as const,
            status: "active" as const,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            bookingsCount: 0,
          },
        ];
        localStorage.setItem("users", JSON.stringify(defaultUsers));
        setUsers(defaultUsers);
      } else {
        setUsers(usersWithBookings);
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newUser: User = {
      id: editingUser?.id || Date.now(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: formData.status,
      createdAt: editingUser?.createdAt || new Date().toISOString(),
      bookingsCount: editingUser?.bookingsCount || 0,
    };

    let updatedUsers;
    if (editingUser) {
      updatedUsers = users.map((user) =>
        user.id === editingUser.id ? newUser : user
      );
    } else {
      updatedUsers = [...users, newUser];
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("users", JSON.stringify(updatedUsers));
    }
    setUsers(updatedUsers);
    resetForm();
  };

  const deleteUser = (id: number) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem("users", JSON.stringify(updatedUsers));
    }
    setUsers(updatedUsers);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "customer",
      status: "active",
    });
    setEditingUser(null);
    setIsAddDialogOpen(false);
  };

  const startEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setIsAddDialogOpen(true);
  };

  const getRoleColor = (role: string) => {
    return role === "admin"
      ? "bg-purple-500/10 text-purple-700 dark:text-purple-400"
      : "bg-blue-500/10 text-blue-700 dark:text-blue-400";
  };

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-500/10 text-green-700 dark:text-green-400"
      : "bg-gray-500/10 text-gray-700 dark:text-gray-400";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Manage customer and admin accounts
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetForm();
                  setIsAddDialogOpen(true);
                }}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingUser ? "Edit User" : "Add New User"}
                </DialogTitle>
                <DialogDescription>
                  {editingUser
                    ? "Update user account details"
                    : "Create a new user account"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value: "admin" | "customer") =>
                        setFormData({ ...formData, role: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: "active" | "inactive") =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingUser ? "Update" : "Create"} User
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                  <Badge className={getStatusColor(user.status)}>
                    {user.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Joined</p>
                  <p className="font-semibold">
                    {format(new Date(user.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Login</p>
                  <p className="font-semibold">
                    {user.lastLogin
                      ? format(new Date(user.lastLogin), "MMM d, yyyy")
                      : "Never"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Bookings</p>
                  <p className="font-semibold">{user.bookingsCount}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      Member since {format(new Date(user.createdAt), "yyyy")}
                    </span>
                  </div>
                  {user.role === "admin" && (
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      <span>Administrator</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(user)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteUser(user.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No users found matching your criteria
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
