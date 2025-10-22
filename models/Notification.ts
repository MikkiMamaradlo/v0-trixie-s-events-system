import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  userId?: mongoose.Types.ObjectId; // reference to User (null for admin notifications)
  type:
    | "booking_created"
    | "booking_confirmed"
    | "booking_cancelled"
    | "payment_received"
    | "feedback_received"
    | "system_alert";
  title: string;
  message: string;
  isRead: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  relatedId?: mongoose.Types.ObjectId; // ID of related document (booking, payment, etc.)
  relatedModel?: string; // Model name of related document
  metadata?: Record<string, any>; // additional data
  expiresAt?: Date; // optional expiration date
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      required: true,
      enum: [
        "booking_created",
        "booking_confirmed",
        "booking_cancelled",
        "payment_received",
        "feedback_received",
        "system_alert",
      ],
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    message: {
      type: String,
      required: true,
      maxlength: 500,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      required: true,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    relatedId: {
      type: Schema.Types.ObjectId,
    },
    relatedModel: {
      type: String,
      enum: ["Booking", "Payment", "Feedback", "User"],
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
NotificationSchema.index({ userId: 1, isRead: 1 });
NotificationSchema.index({ type: 1 });
NotificationSchema.index({ priority: 1 });
NotificationSchema.index({ createdAt: -1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index for auto-expiration

// Virtual for checking if notification is expired
NotificationSchema.virtual("isExpired").get(function (this: INotification) {
  return this.expiresAt && new Date() > this.expiresAt;
});

// Ensure virtual fields are serialized
NotificationSchema.set("toJSON", { virtuals: true });
NotificationSchema.set("toObject", { virtuals: true });

export default mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);
