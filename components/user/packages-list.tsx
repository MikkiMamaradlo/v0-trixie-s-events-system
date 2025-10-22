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
import { Package, Calendar, Users, Clock, Star } from "lucide-react";
import { toast } from "sonner";

interface Service {
  _id: string;
  name: string;
  category: string;
  price: number;
}

interface PackageItem {
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
}

interface PackagesListProps {
  onPackageSelect?: (pkg: PackageItem) => void;
  showBookingButton?: boolean;
}

export function PackagesList({
  onPackageSelect,
  showBookingButton = true,
}: PackagesListProps) {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    try {
      const response = await fetch("/api/packages");
      if (response.ok) {
        const data = await response.json();
        setPackages(data.packages);
      }
    } catch (error) {
      console.error("Error loading packages:", error);
      toast.error("Failed to load packages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookNow = (pkg: PackageItem) => {
    onPackageSelect?.(pkg);
    // You can add navigation logic here, e.g., router.push(`/booking?package=${pkg._id}`)
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
    <div className="space-y-6">
      {packages.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No packages available at the moment.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => {
            const discountedPrice = calculateDiscountedPrice(
              pkg.totalPrice,
              pkg.discountPercentage
            );
            const savings = pkg.totalPrice - discountedPrice;

            return (
              <Card
                key={pkg._id}
                className="hover:shadow-lg transition-shadow relative"
              >
                {pkg.discountPercentage > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    {pkg.discountPercentage}% OFF
                  </div>
                )}

                {pkg.imageUrl && (
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                    <img
                      src={pkg.imageUrl}
                      alt={pkg.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        {pkg.name}
                      </CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        Package Deal
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        ₱{discountedPrice.toLocaleString()}
                      </div>
                      {pkg.discountPercentage > 0 && (
                        <div className="text-sm text-muted-foreground line-through">
                          ₱{pkg.totalPrice.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <CardDescription className="mb-4 line-clamp-3">
                    {pkg.description}
                  </CardDescription>

                  {pkg.discountPercentage > 0 && (
                    <div className="mb-4 p-2 bg-green-50 rounded-md">
                      <div className="text-sm text-green-700 font-medium">
                        Save ₱{savings.toLocaleString()}!
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{pkg.estimatedDuration} hours</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>Up to {pkg.maxGuests} guests</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">
                      Included Services:
                    </h4>
                    <div className="space-y-1">
                      {pkg.services.slice(0, 3).map((service) => (
                        <div
                          key={service._id}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-muted-foreground">
                            {service.name}
                          </span>
                          <span className="text-muted-foreground">
                            ₱{service.price.toLocaleString()}
                          </span>
                        </div>
                      ))}
                      {pkg.services.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{pkg.services.length - 3} more services
                        </div>
                      )}
                    </div>
                  </div>

                  {showBookingButton && (
                    <Button
                      className="w-full"
                      onClick={() => handleBookNow(pkg)}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Package
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
