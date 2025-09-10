"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Axios } from "@/axios";
import Loader from "@/components/Loader";

interface Category {
  id: string;
  title: string;
  image: string;
  description?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [loading, setLoading] = useState<boolean>(true);
  // Removed unused error state to fix TypeScript warning

  const filterAndSortCategories = useCallback(() => {
    let filtered = [...categories];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (category) =>
          category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (category.description?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
      );
    }

    // Sort categories
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name-desc':
          return b.title.localeCompare(a.title);
        case 'newest':
          return parseInt(b.id) - parseInt(a.id);
        case 'oldest':
          return parseInt(a.id) - parseInt(b.id);
        case 'name':
        default:
          return a.title.localeCompare(b.title);
      }
    });

    setFilteredCategories(sorted);
  }, [categories, sortBy, searchTerm]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('Fetching categories from /categories endpoint...');

        const res = await Axios.get('/categories');
        console.log('API response:', res.data);

        if (!res.data || !Array.isArray(res.data)) {
          throw new Error('Invalid response format - expected array');
        }

        // Define interface for API response
        interface ApiCategory {
          id: string | number;
          title?: string;
          name?: string;
          image?: string;
          image_url?: string;
          img?: string;
          thumbnail?: string;
          description?: string;
          desc?: string;
        }

        // Map the response data to match your category structure
        const categoriesData = res.data.map((cat: ApiCategory) => ({
          id: cat.id.toString(),
          title: cat.title || cat.name || 'Untitled Category',
          image: cat.image || cat.image_url || cat.img || cat.thumbnail || '',
          description: cat.description || cat.desc,
        }));

        console.log('Processed categories:', categoriesData);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching categories:', err);
        // Error is already logged to console, no need for additional error state
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Update filtered categories when dependencies change
  useEffect(() => {
    filterAndSortCategories();
  }, [filterAndSortCategories]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="w-full p-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
          <h1 className="text-3xl font-bold text-gray-900">Shop by Category</h1>
          <p className="text-gray-600 mt-2">Browse our collections</p>
        </div>
      </header>

      {/* Filters and Search */}
      <div className=" w-full p-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="w-full lg:w-1/2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="w-full lg:w-1/2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="name">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredCategories.length} categor
            {filteredCategories.length === 1 ? "y" : "ies"} found
          </p>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
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
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-16M9 10h.01M15 10h.01"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No categories found
            </h3>
            <p className="mt-1 text-gray-500">
              Try adjusting your search criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/categories/${category.id}`}
      className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 hover:border-blue-400 border border-gray-200 overflow-hidden transform hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={category.image}
          fill
          alt={category.title}
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>

      {/* Content */}
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-300 mb-2">
          {category.title}
        </h2>

        {category.description && (
          <p className="text-gray-600 text-sm line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
            {category.description}
          </p>
        )}

        {/* Explore button that appears on hover */}
        <div className="mt-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <span className="inline-flex items-center text-blue-600 font-medium text-sm">
            Explore collection
            <svg
              className="ml-1 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
