"use client";

import { useState } from "react";
import { X } from "lucide-react";
import StarRating from "./StarRating";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, review: string) => void;
  productTitle: string;
  existingRating?: number;
  existingReview?: string;
  loading?: boolean;
}

export default function RatingModal({
  isOpen,
  onClose,
  onSubmit,
  productTitle,
  existingRating = 0,
  existingReview = "",
  loading = false,
}: RatingModalProps) {
  const [rating, setRating] = useState(existingRating);
  const [review, setReview] = useState(existingReview);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0) {
      onSubmit(rating, review);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      // Reset form when closing
      setRating(existingRating);
      setReview(existingReview);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {existingRating > 0 ? "Update Your Rating" : "Rate This Product"}
          </h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Title */}
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Product:</h3>
            <p className="text-gray-600 text-sm">{productTitle}</p>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Rating *
            </label>
            <div className="flex items-center gap-2">
              <StarRating
                rating={rating}
                onRatingChange={setRating}
                size="lg"
              />
              <span className="text-sm text-gray-500">
                {rating > 0 ? `${rating} star${rating !== 1 ? "s" : ""}` : "Click to rate"}
              </span>
            </div>
          </div>

          {/* Review */}
          <div>
            <label
              htmlFor="review"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your Review (Optional)
            </label>
            <textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your thoughts about this product..."
              rows={4}
              maxLength={1000}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
            <div className="text-xs text-gray-500 mt-1">
              {review.length}/1000 characters
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={rating === 0 || loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : existingRating > 0 ? (
                "Update Rating"
              ) : (
                "Submit Rating"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
