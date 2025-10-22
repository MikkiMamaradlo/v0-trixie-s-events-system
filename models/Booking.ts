import mongoose, { Document, Schema } from "mongoose";

export interface IBooking extends Document {
  serviceId: number;
  serviceName: string;
  serviceCategory: "party-planning" | "equipment-rental" | "catering";
  customerName: string;
  email: string;
  phone: string;
  date: Date;
  guests: number;
  specialRequests?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  totalPrice: number;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema(
  {
    serviceId: {
      type: Number,
      required: [true, "Service ID is required"],
    },
    serviceName: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
    },
    serviceCategory: {
      type: String,
      enum: ["party-planning", "equipment-rental", "catering"],
      required: [true, "Service category is required"],
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
      maxlength: [100, "Customer name cannot be more than 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Booking date is required"],
    },
    guests: {
      type: Number,
      required: [true, "Number of guests is required"],
      min: [1, "At least 1 guest is required"],
      max: [1000, "Maximum 1000 guests allowed"],
    },
    specialRequests: {
      type: String,
      trim: true,
      maxlength: [500, "Special requests cannot be more than 500 characters"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Price cannot be negative"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for better query performance
BookingSchema.index({ userId: 1, createdAt: -1 });
BookingSchema.index({ status: 1, date: 1 });
BookingSchema.index({ email: 1 });

export default mongoose.models.Booking ||
  mongoose.model<IBooking>("Booking", BookingSchema);
