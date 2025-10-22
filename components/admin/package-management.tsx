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

interface Service {
  _id: string;
  name: string;
  category: string;
  price: number;
}

interface Package {
  _id: string;
  name: string;
  description: string;
  services: Service[];
  totalPrice: number;
  discountPercentage: number;
  discountedPrice?: number;
  estimatedDuration: number;
  maxGuests: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export function PackageManagement() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    services: [] as string[],
    totalPrice: "",
    discountPercentage: "",
    estimatedDuration: "",
    maxGuests: "",
    imageUrl: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [packagesResponse, servicesResponse] = await Promise.all([
        fetch("/api/packages"),
        fetch("/api/services"),
      ]);

      if (packagesResponse.ok) {
        const packagesData = await packagesResponse.json();
        setPackages(packagesData.packages);
      }

      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json();
        setServices(servicesData.services);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const packageData = {
        name: formData.name,
        description: formData.description,
        services: formData.services,
        totalPrice: parseFloat(formData.totalPrice),
        discountPercentage: parseInt(formData.discountPercentage),
        estimatedDuration: parseInt(formData.estimatedDuration),
        maxGuests: parseInt(formData.maxGuests),
        imageUrl: formData.imageUrl || undefined,
      };

      const url = editingPackage
        ? `/api/packages/${editingPackage._id}`
        : "/api/packages";
      const method = editingPackage ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify(packageData),
      });

      if (response.ok) {
        toast.success(
          editingPackage
            ? "Package updated successfully"
            : "Package created successfully"
        );
        setIsDialogOpen(false);
        resetForm();
        loadData();
      } else {
        toast.error("Failed to save package");
      }
    } catch (error) {
      console.error("Error saving package:", error);
      toast.error("Failed to save package");
    }
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description,
      services: pkg.services.map((s) => s._id),
      totalPrice: pkg.totalPrice.toString(),
      discountPercentage: pkg.discountPercentage.toString(),
      estimatedDuration: pkg.estimatedDuration.toString(),
      maxGuests: pkg.maxGuests.toString(),
      imageUrl: pkg.imageUrl || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (packageId: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;

    try {
      const response = await fetch(`/api/packages/${packageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (response.ok) {
        toast.success("Package deleted successfully");
        loadData();
      } else {
        toast.error("Failed to delete package");
      }
    } catch (error) {
      console.error("Error deleting package:", error);
      toast.error("Failed to delete package");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      services: [],
      totalPrice: "",
      discountPercentage: "",
      estimatedDuration: "",
      maxGuests: "",
      imageUrl: "",
    });
    setEditingPackage(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const calculateDiscountedPrice = (
    totalPrice: number,
    discountPercentage: number
  ) => {
    return totalPrice * (1 - discountPercentage / 100);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading packages...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Package Management</CardTitle>
            <CardDescription>
              Create and manage service packages for customers
            </CardDescription>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Package
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {packages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No packages found. Create your first package to get started.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <Card key={pkg._id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        {pkg.name}
                      </CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {pkg.discountPercentage}% off
                      </Badge>
                    </div>
                    <Badge variant={pkg.isActive ? "default" : "secondary"}>
                      {pkg.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {pkg.description}
                  </p>
                  <div className="space-y-1 text-sm mb-4">
                    <div className="flex justify-between">
                      <span>Original Price:</span>
                      <span className="line-through text-muted-foreground">
                        ₱{pkg.totalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discounted Price:</span>
                      <span className="font-medium text-green-600">
                        ₱
                        {pkg.discountedPrice?.toLocaleString() ||
                          calculateDiscountedPrice(
                            pkg.totalPrice,
                            pkg.discountPercentage
                          ).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{pkg.estimatedDuration} hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Guests:</span>
                      <span>{pkg.maxGuests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Services:</span>
                      <span>{pkg.services.length}</span>
                    </div>
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
                          <DialogTitle>{pkg.name}</DialogTitle>
                          <DialogDescription>
                            Package details and included services
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Description</Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              {pkg.description}
                            </p>
                          </div>
                          <div>
                            <Label>Included Services</Label>
                            <div className="mt-1 space-y-2">
                              {pkg.services.map((service) => (
                                <div
                                  key={service._id}
                                  className="flex justify-between text-sm"
                                >
                                  <span>{service.name}</span>
                                  <span className="text-muted-foreground">
                                    ₱{service.price.toLocaleString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <Label>Original Price</Label>
                              <p className="text-muted-foreground line-through">
                                ₱{pkg.totalPrice.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <Label>Discounted Price</Label>
                              <p className="text-green-600 font-medium">
                                ₱
                                {pkg.discountedPrice?.toLocaleString() ||
                                  calculateDiscountedPrice(
                                    pkg.totalPrice,
                                    pkg.discountPercentage
                                  ).toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <Label>Duration</Label>
                              <p className="text-muted-foreground">
                                {pkg.estimatedDuration} hours
                              </p>
                            </div>
                            <div>
                              <Label>Max Guests</Label>
                              <p className="text-muted-foreground">
                                {pkg.maxGuests}
                              </p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(pkg)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(pkg._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPackage ? "Edit Package" : "Create New Package"}
              </DialogTitle>
              <DialogDescription>
                {editingPackage
                  ? "Update the package information below."
                  : "Fill in the details to create a new package."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Package Name *</Label>
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
                  <Label htmlFor="discountPercentage">
                    Discount Percentage *
                  </Label>
                  <Input
                    id="discountPercentage"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discountPercentage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountPercentage: e.target.value,
                      })
                    }
                    required
                  />
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

              <div>
                <Label htmlFor="services">Included Services *</Label>
                <div className="space-y-2">
                  {services.map((service) => (
                    <div
                      key={service._id}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        id={`service-${service._id}`}
                        checked={formData.services.includes(service._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              services: [...formData.services, service._id],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              services: formData.services.filter(
                                (id) => id !== service._id
                              ),
                            });
                          }
                        }}
                      />
                      <label
                        htmlFor={`service-${service._id}`}
                        className="text-sm"
                      >
                        {service.name} - ₱{service.price.toLocaleString()} (
                        {service.category})
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="totalPrice">Total Price (₱) *</Label>
                  <Input
                    id="totalPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.totalPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, totalPrice: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="estimatedDuration">Duration (hours) *</Label>
                  <Input
                    id="estimatedDuration"
                    type="number"
                    min="1"
                    value={formData.estimatedDuration}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        estimatedDuration: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="maxGuests">Max Guests *</Label>
                  <Input
                    id="maxGuests"
                    type="number"
                    min="1"
                    value={formData.maxGuests}
                    onChange={(e) =>
                      setFormData({ ...formData, maxGuests: e.target.value })
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
                  {editingPackage ? "Update Package" : "Create Package"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
