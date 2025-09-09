"use client";

import { Axios } from "@/axios";
import { useRouter } from "next/navigation";
import { JSX, useState } from "react";
import { z } from "zod";

// === ZOD BASE SCHEMA ===

const baseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  image: z.instanceof(File).optional(),
});

// === TYPES ===

type TInputs = {
  title: string;
  image?: File;
};

const NewCategory = (): JSX.Element => {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const [newCategory, setNewCategory] = useState<TInputs>({
    title: "",
    image: undefined,
  });

  if (loading) return <div className={`p-4`}>Loading...</div>;

  if (error) return <div className={`p-4`}>{error}</div>;

  // === HANDLE SUBMIT ===

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate the form data
    const validated = baseSchema.safeParse(newCategory);

    if (!validated.success) {
      setError(validated.error.message);
      setSuccess("");
      return;
    }

    // Confirm before adding
    const confirmUpdate = window.confirm(
      "Are you sure you want to add this category?"
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
      formData.append("title", newCategory.title);
      if (newCategory.image) {
        formData.append("image", newCategory.image);
      }

      const response = await Axios.post(`/category/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        setSuccess("Category added successfully!");
        setError("");
        setTimeout(() => {
          router.push("/dashboard/categories");
        }, 1500);
      }
    } catch (err: unknown) {
      let errorMessage = "Error adding category";

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
    }
  };

  // === HANDLE FILE CHANGE ===

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewCategory((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  return (
    <div className={`p-4`}>
      <form
        className="w-full lg:w-1/2 bg-card lg:bg-transparent px-4 py-6 sm:p-8 lg:px-4 lg:py-6 xl:p-8 flex flex-col justify-between z-20"
        onSubmit={handleSubmit}
        noValidate
      >
        {/* === HEADING === */}

        <h1 className="text-4xl font-semibold uppercase mb-8">Add Category</h1>

        <div className="flex flex-col justify-center gap-8 min-h-3/5">
          {/* === TITLE === */}

          <div className="relative">
            <input
              type="text"
              placeholder="Title..."
              value={newCategory.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNewCategory((prev) => ({
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
                newCategory.title
                  ? "opacity-100 -translate-y-2.5"
                  : "opacity-0 translate-y-2"
              }`}
            >
              Title
            </p>
            <div
              className={`absolute bottom-0 left-0 w-full lg:w-[90%] h-[3px] rounded-b-md rounded-bl-md z-30 opacity-0 peer-focus:opacity-100 duration-200 ${
                newCategory.title === "" ? "bg-red" : "bg-primary"
              }`}
            />
          </div>

          {/* === IMAGE UPLOAD === */}

          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              id="Image"
              className="hidden"
            />
            <label
              htmlFor="Image"
              className={`cursor-pointer w-full lg:w-[90%] h-18 outline-0 rounded-sm bg-slate-50 pl-6 pr-6 shadow-[inset_0_0_10px_0_rgba(0,0,0,0.1)] flex items-center justify-between hover:bg-slate-100 transition-colors duration-200`}
            >
              <span className="text-gray-500">
                {newCategory.image ? newCategory.image.name : "Choose image..."}
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
                newCategory.image
                  ? "opacity-100 -translate-y-2.5"
                  : "opacity-0 translate-y-2"
              }`}
            >
              Image
            </p>
            <div
              className={`absolute bottom-0 left-0 w-full lg:w-[90%] h-[3px] rounded-b-md rounded-bl-md z-30 opacity-0 peer-focus:opacity-100 duration-200 ${
                newCategory.image ? "bg-primary" : "bg-red"
              }`}
            />
          </div>

          {/* === BUTTONS === */}

          <div className="flex justify-between items-end lg:w-[90%]">
            <button
              type="button"
              onClick={() => router.push("/dashboard/categories")}
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
                "Add Category"
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

export default NewCategory;
