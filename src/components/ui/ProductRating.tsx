"use client";

import { useState, useEffect, useCallback } from "react";
import { Axios } from "@/axios";
import StarRating from "./StarRating";
import RatingModal from "./RatingModal";
import RatingDisplay from "./RatingDisplay";
import Cookies from "universal-cookie";

interface ProductRatingProps {
  productId: string;
  productTitle: string;
}

interface UserRating {
  id: number;
  rating: number;
  review: string;
}

export default function ProductRating({ productId, productTitle }: ProductRatingProps) {
  const [userRating, setUserRating] = useState<UserRating | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthentication();
  }, [productId]);

  const fetchUserRating = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await Axios.get(`/product/${productId}/user-rating`);
      if (response.data.success && response.data.data) {
        setUserRating(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching user rating:", error);
    }
  }, [isAuthenticated, productId]);

  useEffect(() => {
    fetchUserRating();
  }, [fetchUserRating]);

  const checkAuthentication = () => {
    const cookies = new Cookies();
    const token = cookies.get("Bearer");
    setIsAuthenticated(!!token);
  };


  const handleRatingSubmit = async (rating: number, review: string) => {
    setLoading(true);
    try {
      console.log("Submitting rating:", { product_id: productId, rating, review });
      
      const response = await Axios.post("/rating", {
        product_id: productId,
        rating,
        review,
      });

      console.log("Rating response:", response.data);

      if (response.data.success) {
        setUserRating({
          id: response.data.data.id,
          rating: response.data.data.rating,
          review: response.data.data.review,
        });
        setIsModalOpen(false);
        // Trigger a refresh of the rating display
        window.location.reload();
      } else {
        console.error("Rating submission failed:", response.data);
        alert(response.data.message || "Failed to submit rating");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      
      let errorMessage = "Failed to submit rating";
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: {
            status: number;
            data?: {
              message?: string;
              errors?: Record<string, string[]>;
            };
          };
          request?: unknown;
          message?: string;
        };
        
        console.error("Error response:", axiosError.response);
        
        if (axiosError.response) {
          const { status, data } = axiosError.response;
          
          if (status === 401) {
            errorMessage = "You must be logged in to rate products. Please log in and try again.";
          } else if (status === 422) {
            errorMessage = data?.message || "Invalid rating data. Please check your input.";
            if (data?.errors) {
              console.error("Validation errors:", data.errors);
            }
          } else if (status === 500) {
            errorMessage = "Server error. Please try again later.";
          } else {
            errorMessage = data?.message || `Server error (${status})`;
          }
        } else if (axiosError.request) {
          // Network error
          errorMessage = "Network error. Please check your connection and try again.";
        } else if (axiosError.message) {
          errorMessage = `Error: ${axiosError.message}`;
        };

        alert(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRating = async () => {
    if (!userRating || !confirm("Are you sure you want to delete your rating?")) {
      return;
    }

    setLoading(true);
    try {
      const response = await Axios.delete(`/rating/${userRating.id}`);
      if (response.data.success) {
        setUserRating(null);
      }
    } catch (error) {
      console.error("Error deleting rating:", error);
      const errorMessage = (error && typeof error === 'object' && 'response' in error)
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : "Failed to delete rating";
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* User Rating Section */}
      {isAuthenticated && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Your Rating
          </h3>
          
          {userRating ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <StarRating rating={userRating.rating} readonly />
                  <span className="text-sm text-gray-600">
                    Your rating: {userRating.rating} star{userRating.rating !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDeleteRating}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {userRating.review && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-700">{userRating.review}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-3">
                Share your experience with this product
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Write a Review
              </button>
            </div>
          )}
        </div>
      )}

      {/* All Ratings Display */}
      <RatingDisplay productId={productId} />

      {/* Rating Modal */}
      <RatingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRatingSubmit}
        productTitle={productTitle}
        existingRating={userRating?.rating || 0}
        existingReview={userRating?.review || ""}
        loading={loading}
      />
    </div>
  );
}
