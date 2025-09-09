"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Axios } from "@/axios";
import { Star, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import ProductRating from "@/components/ui/ProductRating";
import AddToCartButton from "@/components/cart/AddToCartButton";

interface Product {
  id: string;
  title: string;
  images: string[];
  about: string;
  description: string;
  price: number;
  discount: number;
  rate: number;
  status: string;
  category: {
    id: string;
    title: string;
  };
  specifications?: {
    [key: string]: string;
  };
}

interface ImageObject {
  image: string;
}

type TCats = {
  id: number;
  title: string;
};

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const catsRes = await Axios.get(`/categories`);
      const categoriesData = catsRes.data.map((element: TCats) => ({
        id: element.id,
        title: element.title,
      }));

      console.log(`Fetching product from /product/${productId} endpoint...`);

      const res = await Axios.get(`/product/${productId}`);

      if (!res.data[0]) {
        throw new Error("Invalid response format");
      }

      // Format the product data
      const productData: Product = {
        id: res.data[0].id.toString(),
        title: res.data[0].title || res.data[0].name,
        images: res.data[0].images
          ? Array.isArray(res.data[0].images)
            ? res.data[0].images.map((img: ImageObject) => img.image)
            : [res.data[0].image]
          : "/product-fallback.png",
        about: res.data[0].About || res.data[0].about || "",
        description: res.data[0].description || res.data[0].desc || "",
        price: Number(res.data[0].price) || 0,
        discount: Number(res.data[0].discount) || 0,
        rate: Number(res.data[0].rating) || 0,
        status: res.data[0].status || "published",
        category: categoriesData.find(
          (cat: TCats) => cat.id === res.data[0].category
        ) || { id: "", title: "" },
        specifications: res.data[0].specifications || res.data[0].details || {},
      };

      console.log("Processed product:", productData);
      setProduct(productData);
    } catch (error: unknown) {
      console.error("Error fetching product:", error);

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { status: number; statusText: string } };
        setError(
          `Server error: ${axiosError.response.status} - ${axiosError.response.statusText}`
        );
      } else if (error && typeof error === 'object' && 'request' in error) {
        setError("No response from server. Check your network connection.");
      } else if (error instanceof Error) {
        setError(`Request error: ${error.message}`);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    if (product && product.images.length > 0) {
      setSelectedImageIndex((prev) =>
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product && product.images.length > 0) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="bg-red-100 text-red-800 p-6 rounded-lg">
            <svg
              className="w-12 h-12 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 className="font-semibold mb-2 text-lg">
              Error Loading Product
            </h3>
            <p className="text-sm mb-4">{error}</p>
            <button
              onClick={fetchProduct}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Product not found
          </h3>
          <p className="mt-1 text-gray-500">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <div className="mt-6">
            <Link
              href="/products"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const finalPrice = product.price - product.discount;
  const discountPercentage =
    product.discount > 0
      ? Math.round((product.discount / product.price) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 2xl:px-64 py-6">
          <nav className="flex my-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700">
                  Home
                </Link>
              </li>
              <li>
                <span className="text-gray-300">/</span>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Categories
                </Link>
              </li>
              <li>
                <span className="text-gray-300">/</span>
              </li>
              {product.category && (
                <>
                  <li>
                    <Link
                      href={`/categories/${product.category.id}`}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {product.category.title}
                    </Link>
                  </li>
                  <li>
                    <span className="text-gray-300">/</span>
                  </li>
                </>
              )}
              <li>
                <span className="text-gray-700 font-medium">
                  {product.title}
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </header>

      {/* Product Section */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 2xl:px-64 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
              {Array.isArray(product.images) ? (
                product.images.length > 0 ? (
                  <>
                    <Image
                      src={product.images[selectedImageIndex]}
                      fill
                      alt={product.title}
                      className="object-cover"
                    />

                    {/* Navigation Arrows */}
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {/* Discount Badge */}
                    {discountPercentage > 0 && (
                      <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        -{discountPercentage}%
                      </div>
                    )}

                    {/* Status Badge */}
                    <div
                      className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold ${
                        product.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {product.status === "published"
                        ? "Available"
                        : "Out of stock"}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )
              ) : (
                <Image
                  src={product.images}
                  width={200}
                  height={200}
                  alt={product.title}
                  className="object-contain"
                />
              )}
            </div>

            {/* Thumbnails */}
            {product.images[0] && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {Array.isArray(product.images) &&
                  product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square overflow-hidden rounded-lg border-2 ${
                        selectedImageIndex === index
                          ? "border-blue-500"
                          : "border-gray-200"
                      }`}
                    >
                      <Image
                        src={image}
                        width={100}
                        height={100}
                        alt={`${product.title} view ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {product.title}
              </h1>

              {/* Rating */}
              {product.rate > 0 && (
                <div className="flex items-center mt-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rate) ? "fill-current" : ""
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">({product.rate})</span>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              {product.discount > 0 ? (
                <>
                  <span className="text-3xl font-bold text-red-600">
                    ${finalPrice.toFixed(2)}
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-semibold">
                    Save ${product.discount.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* About */}
            {product.about && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  About this product
                </h2>
                <p className="text-gray-600">{product.about}</p>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h2>
                <p className="text-gray-600">{product.description}</p>
              </div>
            )}

            {/* Specifications */}
            {product.specifications &&
              Object.keys(product.specifications).length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Specifications
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between border-b border-gray-100 pb-2"
                        >
                          <span className="text-gray-600">{key}:</span>
                          <span className="text-gray-900 font-medium">
                            {value}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Action Buttons */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 sm:gap-4 mb-6">
                <AddToCartButton
                  productId={parseInt(product.id)}
                  className="flex-1"
                  showQuantitySelector={true}
                  variant="default"
                  size="lg"
                />

                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <span className="font-semibold">Free shipping</span> on orders
                  over $50
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rating Section */}
        <div className="mt-12">
          <ProductRating productId={productId} productTitle={product.title} />
        </div>
      </div>
    </div>
  );
}
