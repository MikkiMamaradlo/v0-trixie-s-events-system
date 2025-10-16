"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Package } from "lucide-react";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  available: number;
  condition: "excellent" | "good" | "fair";
  lastMaintenance: string;
}

export function InventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    category: string;
    quantity: string;
    available: string;
    condition: "excellent" | "good" | "fair";
    lastMaintenance: string;
  }>({
    name: "",
    category: "equipment",
    quantity: "",
    available: "",
    condition: "excellent",
    lastMaintenance: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = () => {
    if (typeof window !== "undefined") {
      const storedInventory = JSON.parse(
        localStorage.getItem("inventory") || "[]"
      );
      if (storedInventory.length === 0) {
        // Initialize with default items
        const defaultInventory = [
          {
            id: 1,
            name: 'Round Tables (60")',
            category: "furniture",
            quantity: 50,
            available: 45,
            condition: "excellent" as const,
            lastMaintenance: "2024-01-15",
          },
          {
            id: 2,
            name: "Folding Chairs",
            category: "furniture",
            quantity: 200,
            available: 180,
            condition: "good" as const,
            lastMaintenance: "2024-01-10",
          },
          {
            id: 3,
            name: "Sound System",
            category: "audio",
            quantity: 5,
            available: 4,
            condition: "excellent" as const,
            lastMaintenance: "2024-02-01",
          },
          {
            id: 4,
            name: "Party Tents (20x20)",
            category: "outdoor",
            quantity: 10,
            available: 8,
            condition: "good" as const,
            lastMaintenance: "2024-01-20",
          },
          {
            id: 5,
            name: "Chafing Dishes",
            category: "catering",
            quantity: 30,
            available: 28,
            condition: "excellent" as const,
            lastMaintenance: "2024-02-05",
          },
        ];
        localStorage.setItem("inventory", JSON.stringify(defaultInventory));
        setInventory(defaultInventory);
      } else {
        setInventory(storedInventory);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newItem: InventoryItem = {
      id: editingItem?.id || Date.now(),
      name: formData.name,
      category: formData.category,
      quantity: Number.parseInt(formData.quantity),
      available: Number.parseInt(formData.available),
      condition: formData.condition,
      lastMaintenance: formData.lastMaintenance,
    };

    let updatedInventory;
    if (editingItem) {
      updatedInventory = inventory.map((item) =>
        item.id === editingItem.id ? newItem : item
      );
    } else {
      updatedInventory = [...inventory, newItem];
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("inventory", JSON.stringify(updatedInventory));
    }
    setInventory(updatedInventory);
    resetForm();
  };

  const deleteItem = (id: number) => {
    const updatedInventory = inventory.filter((item) => item.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem("inventory", JSON.stringify(updatedInventory));
    }
    setInventory(updatedInventory);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "equipment",
      quantity: "",
      available: "",
      condition: "excellent",
      lastMaintenance: new Date().toISOString().split("T")[0],
    });
    setEditingItem(null);
    setIsAddDialogOpen(false);
  };

  const startEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity.toString(),
      available: item.available.toString(),
      condition: item.condition,
      lastMaintenance: item.lastMaintenance,
    });
    setIsAddDialogOpen(true);
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "excellent":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "good":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      case "fair":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Inventory Management</CardTitle>
            <CardDescription>
              Track and manage equipment and supplies
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
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "Edit Item" : "Add New Item"}
                </DialogTitle>
                <DialogDescription>
                  {editingItem
                    ? "Update inventory item details"
                    : "Add a new item to your inventory"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name</Label>
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
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="furniture">Furniture</SelectItem>
                      <SelectItem value="audio">Audio Equipment</SelectItem>
                      <SelectItem value="outdoor">Outdoor Equipment</SelectItem>
                      <SelectItem value="catering">
                        Catering Supplies
                      </SelectItem>
                      <SelectItem value="decoration">Decorations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Total Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      required
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="available">Available</Label>
                    <Input
                      id="available"
                      type="number"
                      required
                      value={formData.available}
                      onChange={(e) =>
                        setFormData({ ...formData, available: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value: "excellent" | "good" | "fair") =>
                      setFormData({ ...formData, condition: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastMaintenance">Last Maintenance</Label>
                  <Input
                    id="lastMaintenance"
                    type="date"
                    required
                    value={formData.lastMaintenance}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        lastMaintenance: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingItem ? "Update" : "Add"} Item
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Inventory Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {inventory.length}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              Total Products
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {inventory.reduce((sum, item) => sum + item.quantity, 0)}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">
              Total Items
            </div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-950/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {inventory.reduce((sum, item) => sum + item.available, 0)}
            </div>
            <div className="text-sm text-orange-600 dark:text-orange-400">
              Available Items
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {inventory.reduce(
                (sum, item) => sum + (item.quantity - item.available),
                0
              )}
            </div>
            <div className="text-sm text-red-600 dark:text-red-400">
              Items In Use
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {inventory.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {item.category}
                    </p>
                  </div>
                </div>
                <Badge className={getConditionColor(item.condition)}>
                  {item.condition}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Quantity</p>
                  <p className="font-semibold">{item.quantity}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Available</p>
                  <p className="font-semibold text-green-600">
                    {item.available}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">In Use</p>
                  <p className="font-semibold text-orange-600">
                    {item.quantity - item.available}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <p className="text-sm text-muted-foreground">
                  Last maintained:{" "}
                  {new Date(item.lastMaintenance).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => startEdit(item)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
