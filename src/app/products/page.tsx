"use client";

import { Axios } from "@/axios";
import Loader from "@/components/Loader";
import FavoriteButton from "@/components/ui/FavoriteButton";
// import StarRating from "@/components/ui/StarRating";
import Image from "next/image";
import Link from "next/link";
import { JSX, useEffect, useState } from "react";

type TCats = {
  id: number;
  title: string;
};

type TProducts = {
  id: number;
  title: string;
  image: string;
  about: string;
  desc: string;
  category: string;
  price: number;
  discount: number;
  rate: string;
  status: string;
};

// Sorting options
type SortOption =
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc"
  | "discount-desc"
  | "rating-desc";

const ProductsPage = (): JSX.Element => {
  const [products, setProducts] = useState<TProducts[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<TProducts[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOption, setSortOption] = useState<SortOption>("name-asc");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const catsRes = await Axios.get(`/categories`);
        const categoriesData = catsRes.data.map((element: TCats) => ({
          id: element.id,
          title: element.title,
        }));

        const productsRes = await Axios.get(`/products`);

        const processedProducts = productsRes.data.map((element: {
          id: number;
          title: string;
          images?: Array<{image: string}>;
          About: string;
          description: string;
          category: number;
          price: string | number;
          discount: string | number;
          rating: string;
          average_rating?: number;
          total_ratings?: number;
          status: string;
        }) => {
          const foundCategory = categoriesData.find(
            (cat: TCats) => cat.id === element.category
          );

          return {
            id: element.id,
            title: element.title,
            image: element.images?.[0]?.image || null,
            about: element.About,
            desc: element.description,
            category: foundCategory?.title || "Unknown Category",
            price: Number(element.price) || 0,
            discount: Number(element.discount) || 0,
            rate: element.average_rating || element.rating || "0",
            status: element.status,
          };
        });

        setProducts(processedProducts);
        setFilteredProducts(processedProducts);

        // Extract unique categories for filter dropdown
        const uniqueCategories: string[] = Array.from(
          new Set(
            processedProducts.map((product: TProducts) => product.category)
          )
        );
        setCategories(uniqueCategories);
      } catch (e) {
        console.error("Error fetching data:", e);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  // Apply filters and sorting whenever dependencies change
  useEffect(() => {
    let result = [...products];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.about.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter((product) => product.category === categoryFilter);
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((product) => product.status === statusFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "discount-desc":
          return b.discount - a.discount;
        case "rating-desc":
          return Number(b.rate) - Number(a.rate);
        default:
          return 0;
      }
    });

    setFilteredProducts(result);
  }, [products, searchTerm, categoryFilter, statusFilter, sortOption]);

  if (loading) return <Loader />;

  return (
    <div className="w-full p-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
      {/* Filter and Sort Controls */}
      <div className="p-4 bg-gray-50 rounded-lg mb-4 space-y-4">
        {/* Search Input */}
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Search Products
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search by name, description, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category Filter */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="published">Available</option>
              <option value="draft">Out of Stock</option>
            </select>
          </div>

          {/* Sort Options */}
          <div>
            <label
              htmlFor="sort"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Sort By
            </label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="discount-desc">Best Discount</option>
              <option value="rating-desc">Highest Rating</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>

      {/* Products Grid */}
      <div className="w-full flex flex-wrap gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((deal: TProducts) => (
            <Link
              key={deal.id}
              href={`/products/${deal.id}`}
              className="group h-max w-full sm:w-1/3 lg:w-1/4 grow border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 hover:border-blue-300 overflow-hidden bg-white"
            >
              {/* Image Container */}
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src={deal.image || "/product-fallback.png"}
                  fill
                  alt={deal.title}
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Favorite Button */}
                <div className="absolute top-2 right-2 z-10">
                  <FavoriteButton 
                    product={deal} 
                    className="p-2 bg-white rounded-full shadow-md hover:shadow-lg"
                    size={16}
                  />
                </div>
                {/* Status Badge */}
                <div
                  className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold ${
                    deal.status == "published"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {deal.status == "published" ? "Available" : "Out of stock"}
                </div>
                {/* Rating Badge */}
                {deal.rate && (
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded-full text-xs flex items-center">
                    ⭐ {deal.rate}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                {/* Category */}
                {deal.category && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                    {deal.category}
                  </span>
                )}

                {/* Title */}
                <h2 className="font-semibold text-gray-900 text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {deal.title}
                </h2>

                {/* About */}
                {deal.about && (
                  <h3 className="text-gray-600 text-sm line-clamp-2">
                    {deal.about}
                  </h3>
                )}

                {/* Description */}
                {deal.desc && (
                  <p className="text-gray-500 text-xs line-clamp-2">
                    {deal.desc}
                  </p>
                )}

                {/* Price Section */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      {deal.discount !== 0 ? (
                        <>
                          <span className="text-2xl font-bold text-gray-900">
                            ${(deal.price - deal.discount).toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            ${deal.price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold text-gray-900">
                          ${deal.price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {deal.discount !== 0 && (
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-semibold">
                        -${deal.discount.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {deal.discount !== 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        You save ${deal.discount.toFixed(2)}
                      </span>
                      <span className="text-xs text-green-600 font-semibold">
                        {((deal.discount / deal.price) * 100).toFixed(0)}% off
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="w-full text-center py-12">
            <p className="text-gray-500 text-lg">
              No products found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
                setStatusFilter("all");
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default ProductsPage;
