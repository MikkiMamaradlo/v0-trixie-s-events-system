import mongoose, { Document, Schema } from "mongoose";

export interface IPayment extends Document {
  bookingId: mongoose.Types.ObjectId;
  amount: number;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentMethod:
    | "credit_card"
    | "debit_card"
    | "bank_transfer"
    | "cash"
    | "paypal";
  transactionId?: string;
  paymentDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Booking ID is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "debit_card", "bank_transfer", "cash", "paypal"],
      required: [true, "Payment method is required"],
    },
    transactionId: {
      type: String,
      trim: true,
      sparse: true, // Allow null values but ensure uniqueness when present
    },
    paymentDate: {
      type: Date,
      default: Date.now,
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

// Index for better query performance
PaymentSchema.index({ bookingId: 1 });
PaymentSchema.index({ status: 1, paymentDate: -1 });
PaymentSchema.index({ transactionId: 1 }, { unique: true, sparse: true });

export default mongoose.models.Payment ||
  mongoose.model<IPayment>("Payment", PaymentSchema);
