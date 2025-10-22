"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, Send } from "lucide-react";
import { toast } from "sonner";

interface FeedbackFormProps {
  bookingId?: string;
  onSubmit?: () => void;
}

export function FeedbackForm({ bookingId, onSubmit }: FeedbackFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    comment: "",
    rating: 0,
    serviceQuality: 0,
    timeliness: 0,
    value: 0,
    wouldRecommend: null as boolean | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingClick = (field: keyof typeof formData, rating: number) => {
    setFormData((prev) => ({ ...prev, [field]: rating }));
  };

  const renderStars = (field: keyof typeof formData, currentRating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-6 w-6 cursor-pointer transition-colors ${
          i < currentRating
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300 hover:text-yellow-400"
        }`}
        onClick={() => handleRatingClick(field, i + 1)}
      />
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.title ||
      !formData.comment ||
      formData.rating === 0 ||
      formData.serviceQuality === 0 ||
      formData.timeliness === 0 ||
      formData.value === 0 ||
      formData.wouldRecommend === null
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          bookingId,
          ...formData,
        }),
      });

      if (response.ok) {
        toast.success("Thank you for your feedback!");
        // Reset form
        setFormData({
          title: "",
          comment: "",
          rating: 0,
          serviceQuality: 0,
          timeliness: 0,
          value: 0,
          wouldRecommend: null,
        });
        onSubmit?.();
      } else {
        toast.error("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Share Your Feedback</CardTitle>
        <CardDescription>
          Help us improve by sharing your experience with our services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Feedback Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Summarize your experience"
              required
            />
          </div>

          <div>
            <Label htmlFor="comment">Your Feedback *</Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, comment: e.target.value }))
              }
              placeholder="Tell us about your experience..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Overall Rating *</Label>
              <div className="flex items-center gap-2 mt-2">
                {renderStars("rating", formData.rating)}
                <span className="text-sm text-muted-foreground ml-2">
                  {formData.rating > 0 && `${formData.rating} out of 5 stars`}
                </span>
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Service Quality *</Label>
              <div className="flex items-center gap-2 mt-2">
                {renderStars("serviceQuality", formData.serviceQuality)}
                <span className="text-sm text-muted-foreground ml-2">
                  {formData.serviceQuality > 0 &&
                    `${formData.serviceQuality} out of 5`}
                </span>
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Timeliness *</Label>
              <div className="flex items-center gap-2 mt-2">
                {renderStars("timeliness", formData.timeliness)}
                <span className="text-sm text-muted-foreground ml-2">
                  {formData.timeliness > 0 && `${formData.timeliness} out of 5`}
                </span>
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Value for Money *</Label>
              <div className="flex items-center gap-2 mt-2">
                {renderStars("value", formData.value)}
                <span className="text-sm text-muted-foreground ml-2">
                  {formData.value > 0 && `${formData.value} out of 5`}
                </span>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">
              Would you recommend us? *
            </Label>
            <div className="flex gap-4 mt-2">
              <Button
                type="button"
                variant={
                  formData.wouldRecommend === true ? "default" : "outline"
                }
                onClick={() =>
                  setFormData((prev) => ({ ...prev, wouldRecommend: true }))
                }
              >
                Yes, definitely
              </Button>
              <Button
                type="button"
                variant={
                  formData.wouldRecommend === false ? "default" : "outline"
                }
                onClick={() =>
                  setFormData((prev) => ({ ...prev, wouldRecommend: false }))
                }
              >
                No, probably not
              </Button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Feedback
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
