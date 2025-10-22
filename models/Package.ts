import mongoose, { Document, Schema } from "mongoose";

export interface IPackage extends Document {
  name: string;
  description: string;
  services: mongoose.Types.ObjectId[]; // references to Service documents
  totalPrice: number;
  discountPercentage: number; // discount when booking as package
  estimatedDuration: number; // in hours
  maxGuests: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema: Schema = new Schema(
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
    services: [
      {
        type: Schema.Types.ObjectId,
        ref: "Service",
        required: true,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },
    estimatedDuration: {
      type: Number,
      required: true,
      min: 1,
    },
    maxGuests: {
      type: Number,
      required: true,
      min: 1,
    },
    imageUrl: {
      type: String,
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
PackageSchema.index({ isActive: 1 });
PackageSchema.index({ name: "text", description: "text" });

// Virtual for calculated discounted price
PackageSchema.virtual("discountedPrice").get(function () {
  return this.totalPrice * (1 - this.discountPercentage / 100);
});

// Ensure virtual fields are serialized
PackageSchema.set("toJSON", { virtuals: true });
PackageSchema.set("toObject", { virtuals: true });

export default mongoose.models.Package ||
  mongoose.model<IPackage>("Package", PackageSchema);
