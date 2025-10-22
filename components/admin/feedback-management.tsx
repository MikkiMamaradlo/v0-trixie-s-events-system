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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, MessageSquare, Star, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface Feedback {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  bookingId?: {
    _id: string;
    serviceName: string;
    date: string;
  };
  rating: number;
  title: string;
  comment: string;
  serviceQuality: number;
  timeliness: number;
  value: number;
  wouldRecommend: boolean;
  isPublic: boolean;
  adminResponse?: string;
  adminResponseDate?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export function FeedbackManagement() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  );
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      const response = await fetch("/api/feedback?admin=true");
      if (response.ok) {
        const data = await response.json();
        setFeedback(data.feedback);
      }
    } catch (error) {
      console.error("Error loading feedback:", error);
      toast.error("Failed to load feedback");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (
    feedbackId: string,
    status: "approved" | "rejected"
  ) => {
    try {
      const response = await fetch(`/api/feedback/${feedbackId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast.success(`Feedback ${status} successfully`);
        loadFeedback();
      } else {
        toast.error("Failed to update feedback status");
      }
    } catch (error) {
      console.error("Error updating feedback status:", error);
      toast.error("Failed to update feedback status");
    }
  };

  const handleResponseSubmit = async () => {
    if (!selectedFeedback) return;

    try {
      const response = await fetch(`/api/feedback/${selectedFeedback._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({
          adminResponse: responseText,
          status: "approved", // Auto-approve when responding
        }),
      });

      if (response.ok) {
        toast.success("Response submitted successfully");
        setIsResponseDialogOpen(false);
        setResponseText("");
        setSelectedFeedback(null);
        loadFeedback();
      } else {
        toast.error("Failed to submit response");
      }
    } catch (error) {
      console.error("Error submitting response:", error);
      toast.error("Failed to submit response");
    }
  };

  const openResponseDialog = (fb: Feedback) => {
    setSelectedFeedback(fb);
    setResponseText(fb.adminResponse || "");
    setIsResponseDialogOpen(true);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      case "pending":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const filteredFeedback = feedback.filter((fb) => {
    if (filterStatus === "all") return true;
    return fb.status === filterStatus;
  });

  if (isLoading) {
    return <div className="text-center py-8">Loading feedback...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Feedback Management</CardTitle>
            <CardDescription>
              Review and moderate customer feedback
            </CardDescription>
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Feedback</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filteredFeedback.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No feedback found with the selected filter.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFeedback.map((fb) => (
              <Card key={fb._id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{fb.title}</h3>
                        <Badge variant={getStatusBadgeVariant(fb.status)}>
                          {fb.status}
                        </Badge>
                        {fb.isPublic && <Badge variant="outline">Public</Badge>}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <span>By: {fb.userId.name}</span>
                        {fb.bookingId && (
                          <span>Booking: {fb.bookingId.serviceName}</span>
                        )}
                        <span>
                          {new Date(fb.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {renderStars(fb.rating)}
                        <span className="text-sm text-muted-foreground ml-2">
                          Overall: {fb.rating}/5
                        </span>
                      </div>
                      <p className="text-sm mb-3">{fb.comment}</p>

                      <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-muted-foreground">
                            Service Quality:
                          </span>
                          <div className="flex items-center gap-1 mt-1">
                            {renderStars(fb.serviceQuality)}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Timeliness:
                          </span>
                          <div className="flex items-center gap-1 mt-1">
                            {renderStars(fb.timeliness)}
                          </div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Value:</span>
                          <div className="flex items-center gap-1 mt-1">
                            {renderStars(fb.value)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <span
                          className={`flex items-center gap-1 ${
                            fb.wouldRecommend
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {fb.wouldRecommend ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          {fb.wouldRecommend
                            ? "Would recommend"
                            : "Would not recommend"}
                        </span>
                      </div>

                      {fb.adminResponse && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-md">
                          <div className="flex items-center gap-2 mb-1">
                            <MessageSquare className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-600">
                              Admin Response
                            </span>
                          </div>
                          <p className="text-sm text-blue-800">
                            {fb.adminResponse}
                          </p>
                          {fb.adminResponseDate && (
                            <p className="text-xs text-blue-600 mt-1">
                              Responded on{" "}
                              {new Date(
                                fb.adminResponseDate
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{fb.title}</DialogTitle>
                          <DialogDescription>
                            Feedback details and ratings
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Customer</Label>
                            <p className="text-sm text-muted-foreground">
                              {fb.userId.name} ({fb.userId.email})
                            </p>
                          </div>
                          {fb.bookingId && (
                            <div>
                              <Label>Related Booking</Label>
                              <p className="text-sm text-muted-foreground">
                                {fb.bookingId.serviceName} -{" "}
                                {new Date(
                                  fb.bookingId.date
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          <div>
                            <Label>Comment</Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              {fb.comment}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Ratings</Label>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>Overall:</span>
                                  <div className="flex">
                                    {renderStars(fb.rating)}
                                  </div>
                                </div>
                                <div className="flex justify-between">
                                  <span>Service Quality:</span>
                                  <div className="flex">
                                    {renderStars(fb.serviceQuality)}
                                  </div>
                                </div>
                                <div className="flex justify-between">
                                  <span>Timeliness:</span>
                                  <div className="flex">
                                    {renderStars(fb.timeliness)}
                                  </div>
                                </div>
                                <div className="flex justify-between">
                                  <span>Value:</span>
                                  <div className="flex">
                                    {renderStars(fb.value)}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div>
                              <Label>Status</Label>
                              <div className="space-y-2">
                                <Badge
                                  variant={getStatusBadgeVariant(fb.status)}
                                >
                                  {fb.status}
                                </Badge>
                                {fb.isPublic && (
                                  <Badge variant="outline">Public</Badge>
                                )}
                                <div
                                  className={`text-sm ${
                                    fb.wouldRecommend
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {fb.wouldRecommend
                                    ? "Would recommend"
                                    : "Would not recommend"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {fb.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(fb._id, "approved")}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusUpdate(fb._id, "rejected")}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openResponseDialog(fb)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Respond
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog
          open={isResponseDialogOpen}
          onOpenChange={setIsResponseDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Respond to Feedback</DialogTitle>
              <DialogDescription>
                Provide a response to the customer's feedback
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {selectedFeedback && (
                <div className="p-3 bg-gray-50 rounded-md">
                  <h4 className="font-medium">{selectedFeedback.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedFeedback.comment}
                  </p>
                </div>
              )}
              <div>
                <Label htmlFor="response">Your Response</Label>
                <Textarea
                  id="response"
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Enter your response to the customer..."
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsResponseDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleResponseSubmit}>Submit Response</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
