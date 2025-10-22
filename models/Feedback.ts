import mongoose, { Document, Schema } from "mongoose";

export interface IFeedback extends Document {
  userId: mongoose.Types.ObjectId; // reference to User
  bookingId?: mongoose.Types.ObjectId; // reference to Booking (optional)
  rating: number; // 1-5 stars
  title: string;
  comment: string;
  serviceQuality: number; // 1-5 rating for service quality
  timeliness: number; // 1-5 rating for timeliness
  value: number; // 1-5 rating for value for money
  wouldRecommend: boolean;
  isPublic: boolean; // whether to display on website
  adminResponse?: string;
  adminResponseDate?: Date;
  status: "pending" | "approved" | "rejected"; // for moderation
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    comment: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    serviceQuality: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    timeliness: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    value: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    wouldRecommend: {
      type: Boolean,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    adminResponse: {
      type: String,
      maxlength: 500,
    },
    adminResponseDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
FeedbackSchema.index({ userId: 1 });
FeedbackSchema.index({ bookingId: 1 });
FeedbackSchema.index({ status: 1 });
FeedbackSchema.index({ isPublic: 1, status: 1 });
FeedbackSchema.index({ rating: 1 });
FeedbackSchema.index({ createdAt: -1 });

// Virtual for average rating
FeedbackSchema.virtual("averageRating").get(function (this: IFeedback) {
  return (this.serviceQuality + this.timeliness + this.value) / 3;
});

// Ensure virtual fields are serialized
FeedbackSchema.set("toJSON", { virtuals: true });
FeedbackSchema.set("toObject", { virtuals: true });

export default mongoose.models.Feedback ||
  mongoose.model<IFeedback>("Feedback", FeedbackSchema);
