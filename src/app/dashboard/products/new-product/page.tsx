"use client";

import { Axios } from "@/axios";
import { useRouter } from "next/navigation";
import { JSX, useState, useEffect } from "react";
import { z } from "zod";
import { TCategory } from "@/lib/data";

// === ZOD BASE SCHEMA ===

const baseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  discount: z.string().min(1, "Discount is required"),
  About: z.string().min(1, "About is required"),
  category: z.string().min(1, "Category is required"),
  images: z.array(z.instanceof(File)).optional(),
});

// === TYPES ===

type TInputs = {
  title: string;
  description: string;
  price: string;
  discount: string;
  About: string;
  category: string;
  images?: File[];
};

type TUploadProgress = {
  [key: string]: number;
};

const NewProduct = (): JSX.Element => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [uploadProgress, setUploadProgress] = useState<TUploadProgress>({});

  const [newProduct, setNewProduct] = useState<TInputs>({
    title: "",
    description: "",
    price: "",
    discount: "",
    About: "",
    category: "",
  });

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await Axios.get("/categories");
        setCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <div className={`p-4`}>Loading...</div>;

  if (error) return <div className={`p-4`}>{error}</div>;

  // === HANDLE SUBMIT ===

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate the form data
    const validated = baseSchema.safeParse(newProduct);

    if (!validated.success) {
      setError(validated.error.message);
      setSuccess("");
      return;
    }
    // Confirm before adding
    const confirmUpdate = window.confirm(
      "Are you sure you want to add this product?"
    );

    if (!confirmUpdate) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("title", newProduct.title);
      formData.append("description", newProduct.description);
      formData.append("price", newProduct.price);
      formData.append("discount", newProduct.discount);
      formData.append("About", newProduct.About);
      formData.append("category", newProduct.category);

      if (newProduct.images && newProduct.images.length > 0) {
        // Append each file individually to FormData
        // Use only the 'images' field name that the backend expects
        for (let i = 0; i < newProduct.images.length; i++) {
          formData.append("images", newProduct.images[i]);
        }
        console.log("Images being uploaded:", newProduct.images);
      }

      // Debug: Log FormData contents
      for (const [key, value] of formData.entries()) {
        console.log(`FormData - ${key}:`, value);
      }

      const response = await Axios.post(`/product/add`, formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress({ overall: progress });
          }
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response);
      console.log("Response data:", response.data);

      if (response.status === 200) {
        setSuccess("Product added successfully!");
        setError("");
        setTimeout(() => {
          router.push("/dashboard/products");
        }, 1500);
      }
    } catch (err: unknown) {
      let errorMessage = "Error adding product";

      if (err && typeof err === "object" && "response" in err) {
        const response = (
          err as { response?: { data?: { message?: string }; status?: number } }
        ).response;
        if (response?.data?.message) {
          errorMessage = response.data.message;
        } else if (response?.status === 422) {
          errorMessage = "Title is already taken.";
        } else errorMessage = "Server error.";
      }

      setError(errorMessage);
      setSuccess("");
    } finally {
      setLoading(false);
      setUploadProgress({});
    }
  };

  // === HANDLE FILE CHANGE ===

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setNewProduct((prev) => ({
        ...prev,
        images: fileArray,
      }));
    }
  };

  // === REMOVE IMAGE ===

  const removeImage = (index: number) => {
    setNewProduct((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index),
    }));
  };

  // === PREVIEW IMAGE ===

  const getImagePreview = (file: File) => {
    return URL.createObjectURL(file);
  };

  return (
    <div className={`p-4`}>
      <form
        className="w-full lg:w-1/2 bg-card lg:bg-transparent px-4 py-6 sm:p-8 lg:px-4 lg:py-6 xl:p-8 flex flex-col justify-between z-20"
        onSubmit={handleSubmit}
        noValidate
      >
        {/* === HEADING === */}

        <h1 className="text-4xl font-semibold uppercase mb-8">Add Product</h1>

        <div className="flex flex-col justify-center gap-8 min-h-3/5">
          {/* === TITLE === */}

          <div className="relative">
            <input
              type="text"
              placeholder="Title..."
              value={newProduct.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNewProduct((prev) => ({
                  ...prev,
                  title: e.target.value,
                }));
              }}
              id="Title"
              className={`peer w-full lg:w-[90%] h-18 outline-0 rounded-sm bg-slate-50 pl-6 shadow-[inset_0_0_10px_0_rgba(0,0,0,0.1)]`}
              required
            />
            <p
              className={`absolute -top-2 left-0 text-sm bg-card transition-all duration-200 ${
                newProduct.title
                  ? "opacity-100 -translate-y-2.5"
                  : "opacity-0 translate-y-2"
              }`}
            >
              Title
            </p>
            <div
              className={`absolute bottom-0 left-0 w-full lg:w-[90%] h-[3px] rounded-b-md rounded-bl-md z-30 opacity-0 peer-focus:opacity-100 duration-200 ${
                newProduct.title === "" ? "bg-red" : "bg-primary"
              }`}
            />
          </div>

          {/* === DESCRIPTION === */}

          <div className="relative">
            <textarea
              placeholder="Description..."
              value={newProduct.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setNewProduct((prev) => ({
                  ...prev,
                  description: e.target.value,
                }));
              }}
              id="Description"
              rows={3}
              className={`peer w-full lg:w-[90%] h-18 outline-0 rounded-sm bg-slate-50 pl-6 pr-6 pt-6 shadow-[inset_0_0_10px_0_rgba(0,0,0,0.1)] resize-none`}
              required
            />
            <p
              className={`absolute -top-2 left-0 text-sm bg-card transition-all duration-200 ${
                newProduct.description
                  ? "opacity-100 -translate-y-2.5"
                  : "opacity-0 translate-y-2"
              }`}
            >
              Description
            </p>
            <div
              className={`absolute bottom-0 left-0 w-full lg:w-[90%] h-[3px] rounded-b-md rounded-bl-md z-30 opacity-0 peer-focus:opacity-100 duration-200 ${
                newProduct.description === "" ? "bg-red" : "bg-primary"
              }`}
            />
          </div>

          {/* === PRICE AND DISCOUNT === */}

          <div className="flex gap-4 w-full lg:w-[90%]">
            <div className="relative flex-1">
              <input
                type="number"
                placeholder="Price..."
                value={newProduct.price}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setNewProduct((prev) => ({
                    ...prev,
                    price: e.target.value,
                  }));
                }}
                id="Price"
                className={`peer w-full h-18 outline-0 rounded-sm bg-slate-50 pl-6 shadow-[inset_0_0_10px_0_rgba(0,0,0,0.1)]`}
                required
              />
              <p
                className={`absolute -top-2 left-0 text-sm bg-card transition-all duration-200 ${
                  newProduct.price
                    ? "opacity-100 -translate-y-2.5"
                    : "opacity-0 translate-y-2"
                }`}
              >
                Price
              </p>
              <div
                className={`absolute bottom-0 left-0 w-full h-[3px] rounded-b-md rounded-bl-md z-30 opacity-0 peer-focus:opacity-100 duration-200 ${
                  newProduct.price === "" ? "bg-red" : "bg-primary"
                }`}
              />
            </div>

            <div className="relative flex-1">
              <input
                type="number"
                placeholder="Discount..."
                value={newProduct.discount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setNewProduct((prev) => ({
                    ...prev,
                    discount: e.target.value,
                  }));
                }}
                id="Discount"
                className={`peer w-full h-18 outline-0 rounded-sm bg-slate-50 pl-6 shadow-[inset_0_0_10px_0_rgba(0,0,0,0.1)]`}
                required
              />
              <p
                className={`absolute -top-2 left-0 text-sm bg-card transition-all duration-200 ${
                  newProduct.discount
                    ? "opacity-100 -translate-y-2.5"
                    : "opacity-0 translate-y-2"
                }`}
              >
                Discount
              </p>
              <div
                className={`absolute bottom-0 left-0 w-full h-[3px] rounded-b-md rounded-bl-md z-30 opacity-0 peer-focus:opacity-100 duration-200 ${
                  newProduct.discount === "" ? "bg-red" : "bg-primary"
                }`}
              />
            </div>
          </div>

          {/* === ABOUT === */}

          <div className="relative">
            <textarea
              placeholder="About..."
              value={newProduct.About}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setNewProduct((prev) => ({
                  ...prev,
                  About: e.target.value,
                }));
              }}
              id="About"
              rows={3}
              className={`peer w-full lg:w-[90%] h-18 outline-0 rounded-sm bg-slate-50 pl-6 pr-6 pt-6 shadow-[inset_0_0_10px_0_rgba(0,0,0,0.1)] resize-none`}
              required
            />
            <p
              className={`absolute -top-2 left-0 text-sm bg-card transition-all duration-200 ${
                newProduct.About
                  ? "opacity-100 -translate-y-2.5"
                  : "opacity-0 translate-y-2"
              }`}
            >
              About
            </p>
            <div
              className={`absolute bottom-0 left-0 w-full lg:w-[90%] h-[3px] rounded-b-md rounded-bl-md z-30 opacity-0 peer-focus:opacity-100 duration-200 ${
                newProduct.About === "" ? "bg-red" : "bg-primary"
              }`}
            />
          </div>

          {/* === CATEGORY DROPDOWN === */}

          <div className="relative">
            <select
              value={newProduct.category}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setNewProduct((prev) => ({
                  ...prev,
                  category: e.target.value,
                }));
              }}
              id="Category"
              className={`peer w-full lg:w-[90%] h-18 outline-0 rounded-sm bg-slate-50 pl-6 shadow-[inset_0_0_10px_0_rgba(0,0,0,0.1)] cursor-pointer`}
              required
            >
              <option value="">Select a category...</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id.toString()}>
                  {category.title}
                </option>
              ))}
            </select>
            <p
              className={`absolute -top-2 left-0 text-sm bg-card transition-all duration-200 ${
                newProduct.category
                  ? "opacity-100 -translate-y-2.5"
                  : "opacity-0 translate-y-2"
              }`}
            >
              Category
            </p>
            <div
              className={`absolute bottom-0 left-0 w-full lg:w-[90%] h-[3px] rounded-b-md rounded-bl-md z-30 opacity-0 peer-focus:opacity-100 duration-200 ${
                newProduct.category === "" ? "bg-red" : "bg-primary"
              }`}
            />
          </div>

          {/* === IMAGES UPLOAD === */}

          <div className="relative">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              id="Images"
              className="hidden"
            />
            <label
              htmlFor="Images"
              className={`cursor-pointer w-full lg:w-[90%] h-18 outline-0 rounded-sm bg-slate-50 pl-6 pr-6 shadow-[inset_0_0_10px_0_rgba(0,0,0,0.1)] flex items-center justify-between hover:bg-slate-100 transition-colors duration-200`}
            >
              <span className="text-gray-500">
                {newProduct.images && newProduct.images.length > 0
                  ? `${newProduct.images.length} image(s) selected`
                  : "Choose images (optional)..."}
              </span>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </label>
            <p
              className={`absolute -top-2 left-0 text-sm bg-card transition-all duration-200 ${
                newProduct.images && newProduct.images.length > 0
                  ? "opacity-100 -translate-y-2.5"
                  : "opacity-0 translate-y-2"
              }`}
            >
              Images (optional)
            </p>
            <div
              className={`absolute bottom-0 left-0 w-full lg:w-[90%] h-[3px] rounded-b-md rounded-bl-md z-30 opacity-0 peer-focus:opacity-100 duration-200 ${
                newProduct.images && newProduct.images.length > 0
                  ? "bg-primary"
                  : "bg-red"
              }`}
            />
          </div>

          {/* === IMAGE PREVIEWS === */}

          {newProduct.images && newProduct.images.length > 0 && (
            <div className="w-full lg:w-[90%]">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Selected Images:
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {newProduct.images.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={getImagePreview(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-300 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {file.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* === UPLOAD PROGRESS === */}

          {uploadProgress.overall !== undefined && (
            <div className="w-full lg:w-[90%]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Upload Progress:
                </span>
                <span className="text-sm text-gray-500">
                  {uploadProgress.overall}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress.overall}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* === BUTTONS === */}

          <div className="flex justify-between items-end lg:w-[90%]">
            <button
              type="button"
              onClick={() => router.push("/dashboard/products")}
              className="w-1/4 cursor-pointer capitalize font-semibold h-10 rounded-md bg-gray-500 text-white hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/4 cursor-pointer capitalize font-semibold h-10 rounded-md bg-primary text-primary-foreground disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding...
                </>
              ) : (
                "Add Product"
              )}
            </button>
          </div>
        </div>

        {/* === MESSAGES === */}

        <div className="h-14 sm:h-20 w-full lg:w-[90%]">
          {error && (
            <p className="w-full h-full mt-4 rounded-md text-sm sm:text-base text-red-600 bg-red-100 p-6 leading-2 sm:leading-8 duration-200 transition-all">
              {error}
            </p>
          )}
          {success && (
            <p className="w-full h-full mt-4 rounded-md text-sm sm:text-base text-green-600 bg-green-100 p-6 leading-2 sm:leading-8 duration-200 transition-all">
              {success}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default NewProduct;
