import mongoose, { Document, Schema } from "mongoose";

export interface IInventory extends Document {
  name: string;
  category: "party-planning" | "equipment-rental" | "catering";
  description?: string;
  quantity: number;
  available: number;
  price: number;
  condition: "excellent" | "good" | "fair" | "poor";
  lastMaintenance?: Date;
  location?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InventorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
      maxlength: [100, "Item name cannot be more than 100 characters"],
    },
    category: {
      type: String,
      enum: ["party-planning", "equipment-rental", "catering"],
      required: [true, "Category is required"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      default: 0,
    },
    available: {
      type: Number,
      required: [true, "Available quantity is required"],
      min: [0, "Available quantity cannot be negative"],
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    condition: {
      type: String,
      enum: ["excellent", "good", "fair", "poor"],
      required: [true, "Condition is required"],
      default: "good",
    },
    lastMaintenance: {
      type: Date,
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, "Location cannot be more than 100 characters"],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot be more than 500 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for availability status
InventorySchema.virtual("isAvailable").get(function () {
  return this.available > 0;
});

// Index for better query performance
InventorySchema.index({ category: 1, condition: 1 });
InventorySchema.index({ name: 1 });

export default mongoose.models.Inventory ||
  mongoose.model<IInventory>("Inventory", InventorySchema);
