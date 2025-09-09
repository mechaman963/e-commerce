"use client";

import { useState, useEffect } from "react";
import { Axios } from "@/axios";
import StarRating from "./StarRating";
// Simple date formatting function
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return date.toLocaleDateString();
};

interface Rating {
  id: number;
  rating: number;
  review: string;
  created_at: string;
  user: {
    id: number;
    name: string;
  };
}

interface RatingStats {
  average_rating: number;
  total_ratings: number;
  rating_breakdown: {
    [key: number]: number;
  };
}

interface RatingDisplayProps {
  productId: string;
}

export default function RatingDisplay({ productId }: RatingDisplayProps) {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [stats, setStats] = useState<RatingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchRatings();
    fetchStats();
  }, [productId]);

  const fetchRatings = async () => {
    try {
      const response = await Axios.get(`/product/${productId}/ratings`);
      if (response.data.success) {
        setRatings(response.data.data.ratings);
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await Axios.get(`/product/${productId}/rating-stats`);
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching rating stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const displayedRatings = showAll ? ratings : ratings.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      {stats && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Customer Reviews
            </h3>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <StarRating rating={stats.average_rating} readonly showValue />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Based on {stats.total_ratings} review
                {stats.total_ratings !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 w-8">
                  {star.toFixed(1)}★
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{
                      width:
                        stats.total_ratings > 0
                          ? `${
                              (stats.rating_breakdown[star] /
                                stats.total_ratings) *
                              100
                            }%`
                          : "0%",
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">
                  {stats.rating_breakdown[star]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Individual Reviews */}
      {ratings.length > 0 ? (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Reviews</h4>
          <div className="space-y-4">
            {displayedRatings.map((rating) => (
              <div
                key={rating.id}
                className="border border-gray-200 rounded-lg p-4 bg-white"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <StarRating rating={rating.rating} readonly size="sm" />
                      <span className="font-medium text-gray-900">
                        {rating.user.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatTimeAgo(rating.created_at)}
                    </p>
                  </div>
                </div>
                {rating.review && (
                  <p className="text-gray-700 text-sm mt-2 leading-relaxed">
                    {rating.review}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Show More/Less Button */}
          {ratings.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {showAll ? "Show Less" : `Show All ${ratings.length} Reviews`}
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            No reviews yet. Be the first to review this product!
          </p>
        </div>
      )}
    </div>
  );
}
