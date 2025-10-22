import mongoose, { Document, Schema } from "mongoose";

export interface ISupply extends Document {
  name: string;
  description: string;
  category: string; // e.g., "Tables & Chairs", "Decorations", "Sound Equipment"
  quantity: number;
  available: number; // current available quantity
  unitPrice: number; // cost per unit
  rentalPrice: number; // rental price per unit per day
  imageUrl?: string;
  condition: "new" | "good" | "fair" | "poor";
  location: string; // storage location
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SupplySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Tables & Chairs",
        "Decorations",
        "Sound Equipment",
        "Lighting",
        "Catering Equipment",
        "Linens",
        "Other",
      ],
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    available: {
      type: Number,
      required: true,
      min: 0,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    rentalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    condition: {
      type: String,
      required: true,
      enum: ["new", "good", "fair", "poor"],
      default: "good",
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
SupplySchema.index({ category: 1, isActive: 1 });
SupplySchema.index({ available: 1 });
SupplySchema.index({ name: "text", description: "text" });

// Virtual for checking if item is in stock
SupplySchema.virtual("inStock").get(function (this: ISupply) {
  return this.available > 0;
});

// Ensure virtual fields are serialized
SupplySchema.set("toJSON", { virtuals: true });
SupplySchema.set("toObject", { virtuals: true });

export default mongoose.models.Supply ||
  mongoose.model<ISupply>("Supply", SupplySchema);
