import mongoose, { Document, Schema } from "mongoose";

export interface IService extends Document {
  name: string;
  description: string;
  category: string; // e.g., "Party Planning", "Equipment Rental", "Catering"
  price: number;
  duration: number; // in hours
  maxGuests: number;
  includes: string[]; // array of what's included
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema: Schema = new Schema(
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
        "Party Planning",
        "Equipment Rental",
        "Catering",
        "Photography",
        "Entertainment",
      ],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    maxGuests: {
      type: Number,
      required: true,
      min: 1,
    },
    includes: [
      {
        type: String,
        trim: true,
      },
    ],
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
ServiceSchema.index({ category: 1, isActive: 1 });
ServiceSchema.index({ name: "text", description: "text" });

export default mongoose.models.Service ||
  mongoose.model<IService>("Service", ServiceSchema);
