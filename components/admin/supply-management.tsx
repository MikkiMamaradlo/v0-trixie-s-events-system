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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, Eye, Package } from "lucide-react";
import { toast } from "sonner";

interface Supply {
  _id: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
  available: number;
  unitPrice: number;
  rentalPrice: number;
  imageUrl?: string;
  condition: "new" | "good" | "fair" | "poor";
  location: string;
  isActive: boolean;
  createdAt: string;
}

export function SupplyManagement() {
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupply, setEditingSupply] = useState<Supply | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    quantity: "",
    available: "",
    unitPrice: "",
    rentalPrice: "",
    imageUrl: "",
    condition: "good",
    location: "",
  });

  useEffect(() => {
    loadSupplies();
  }, []);

  const loadSupplies = async () => {
    try {
      const response = await fetch("/api/supplies");
      if (response.ok) {
        const data = await response.json();
        setSupplies(data.supplies);
      }
    } catch (error) {
      console.error("Error loading supplies:", error);
      toast.error("Failed to load supplies");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const supplyData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        quantity: parseInt(formData.quantity),
        available: parseInt(formData.available),
        unitPrice: parseFloat(formData.unitPrice),
        rentalPrice: parseFloat(formData.rentalPrice),
        imageUrl: formData.imageUrl || undefined,
        condition: formData.condition,
        location: formData.location,
      };

      const url = editingSupply
        ? `/api/supplies/${editingSupply._id}`
        : "/api/supplies";
      const method = editingSupply ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify(supplyData),
      });

      if (response.ok) {
        toast.success(
          editingSupply
            ? "Supply updated successfully"
            : "Supply created successfully"
        );
        setIsDialogOpen(false);
        resetForm();
        loadSupplies();
      } else {
        toast.error("Failed to save supply");
      }
    } catch (error) {
      console.error("Error saving supply:", error);
      toast.error("Failed to save supply");
    }
  };

  const handleEdit = (supply: Supply) => {
    setEditingSupply(supply);
    setFormData({
      name: supply.name,
      description: supply.description,
      category: supply.category,
      quantity: supply.quantity.toString(),
      available: supply.available.toString(),
      unitPrice: supply.unitPrice.toString(),
      rentalPrice: supply.rentalPrice.toString(),
      imageUrl: supply.imageUrl || "",
      condition: supply.condition,
      location: supply.location,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (supplyId: string) => {
    if (!confirm("Are you sure you want to delete this supply?")) return;

    try {
      const response = await fetch(`/api/supplies/${supplyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (response.ok) {
        toast.success("Supply deleted successfully");
        loadSupplies();
      } else {
        toast.error("Failed to delete supply");
      }
    } catch (error) {
      console.error("Error deleting supply:", error);
      toast.error("Failed to delete supply");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      quantity: "",
      available: "",
      unitPrice: "",
      rentalPrice: "",
      imageUrl: "",
      condition: "good",
      location: "",
    });
    setEditingSupply(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const getConditionBadgeVariant = (condition: string) => {
    switch (condition) {
      case "new":
        return "default";
      case "good":
        return "secondary";
      case "fair":
        return "outline";
      case "poor":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStockStatus = (available: number, quantity: number) => {
    const percentage = (available / quantity) * 100;
    if (percentage === 0)
      return { status: "Out of Stock", variant: "destructive" as const };
    if (percentage < 25)
      return { status: "Low Stock", variant: "outline" as const };
    if (percentage < 50)
      return { status: "Medium Stock", variant: "secondary" as const };
    return { status: "In Stock", variant: "default" as const };
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading supplies...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Supply Management</CardTitle>
            <CardDescription>
              Manage equipment and supplies inventory
            </CardDescription>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Supply
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {supplies.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No supplies found. Create your first supply item to get started.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {supplies.map((supply) => {
              const stockStatus = getStockStatus(
                supply.available,
                supply.quantity
              );
              return (
                <Card
                  key={supply._id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Package className="h-5 w-5" />
                          {supply.name}
                        </CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {supply.category}
                        </Badge>
                      </div>
                      <Badge
                        variant={supply.isActive ? "default" : "secondary"}
                      >
                        {supply.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {supply.description}
                    </p>
                    <div className="space-y-1 text-sm mb-4">
                      <div className="flex justify-between">
                        <span>Stock:</span>
                        <span>
                          {supply.available}/{supply.quantity}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Unit Price:</span>
                        <span className="font-medium">
                          ₱{supply.unitPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rental Price:</span>
                        <span>₱{supply.rentalPrice.toLocaleString()}/day</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Location:</span>
                        <span>{supply.location}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <Badge variant={stockStatus.variant} className="text-xs">
                        {stockStatus.status}
                      </Badge>
                      <Badge
                        variant={getConditionBadgeVariant(supply.condition)}
                        className="text-xs"
                      >
                        {supply.condition}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{supply.name}</DialogTitle>
                            <DialogDescription>
                              Supply details and inventory information
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Description</Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {supply.description}
                              </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <Label>Category</Label>
                                <p className="text-muted-foreground">
                                  {supply.category}
                                </p>
                              </div>
                              <div>
                                <Label>Condition</Label>
                                <Badge
                                  variant={getConditionBadgeVariant(
                                    supply.condition
                                  )}
                                >
                                  {supply.condition}
                                </Badge>
                              </div>
                              <div>
                                <Label>Total Quantity</Label>
                                <p className="text-muted-foreground">
                                  {supply.quantity}
                                </p>
                              </div>
                              <div>
                                <Label>Available</Label>
                                <p className="text-muted-foreground">
                                  {supply.available}
                                </p>
                              </div>
                              <div>
                                <Label>Unit Price</Label>
                                <p className="text-muted-foreground">
                                  ₱{supply.unitPrice.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <Label>Rental Price</Label>
                                <p className="text-muted-foreground">
                                  ₱{supply.rentalPrice.toLocaleString()}/day
                                </p>
                              </div>
                              <div className="col-span-2">
                                <Label>Location</Label>
                                <p className="text-muted-foreground">
                                  {supply.location}
                                </p>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(supply)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(supply._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSupply ? "Edit Supply" : "Create New Supply"}
              </DialogTitle>
              <DialogDescription>
                {editingSupply
                  ? "Update the supply information below."
                  : "Fill in the details to create a new supply item."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Supply Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tables & Chairs">
                        Tables & Chairs
                      </SelectItem>
                      <SelectItem value="Decorations">Decorations</SelectItem>
                      <SelectItem value="Sound Equipment">
                        Sound Equipment
                      </SelectItem>
                      <SelectItem value="Lighting">Lighting</SelectItem>
                      <SelectItem value="Catering Equipment">
                        Catering Equipment
                      </SelectItem>
                      <SelectItem value="Linens">Linens</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="condition">Condition *</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) =>
                      setFormData({ ...formData, condition: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Total Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="available">Available Quantity *</Label>
                  <Input
                    id="available"
                    type="number"
                    min="0"
                    value={formData.available}
                    onChange={(e) =>
                      setFormData({ ...formData, available: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="unitPrice">Unit Price (₱) *</Label>
                  <Input
                    id="unitPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.unitPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, unitPrice: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="rentalPrice">Rental Price (₱/day) *</Label>
                  <Input
                    id="rentalPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.rentalPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, rentalPrice: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="imageUrl">Image URL (optional)</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingSupply ? "Update Supply" : "Create Supply"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
