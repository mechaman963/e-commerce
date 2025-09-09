"use client";

import Loading from "@/app/loading";
import { Axios } from "@/axios";
import { useParams, useRouter } from "next/navigation";
import { JSX, useEffect, useState } from "react";
import { z } from "zod";

// === ZOD BASE SCHEMA ===

const baseSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  image: z.instanceof(File).optional(),
});

// === ZOD EDIT SCHEMA ===

const editSchema = baseSchema.extend({
  id: z.string().optional(),
});

// === TYPES ===

type TInputs = {
  title: string;
  image?: File;
};

const EditCategory = (): JSX.Element => {
  const router = useRouter();

  const { id } = useParams();
  const [_, setCategory] = useState<object>({});
  const [originalCategory, setOriginalCategory] = useState<TInputs>({
    title: "",
    image: undefined,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const [newCategory, setNewCategory] = useState<TInputs>({
    title: "",
    image: undefined,
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response = await Axios.get(`/category/${id}`);
        setCategory(response.data);
        setNewCategory({
          title: response.data.title,
          image: undefined,
        });
        setOriginalCategory({
          title: response.data.title,
          image: undefined,
        });
        setLoading(false);
      } catch (err) {
        console.log(err);
        // Redirect to not-found page if the category does not exist
        if (err && typeof err === "object" && "response" in err) {
          const response = (err as { response?: { status?: number } }).response;
          if (response?.status === 404) {
            router.replace("/not-found");
            return;
          }
        }
        setError("Error fetching category");
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  if (loading)
    return (
      <div className={``}>
        <Loading />
      </div>
    );

  if (error) return <div className={``}>{error}</div>;

  // === HANDLE EDIT ===

  const validated = editSchema.safeParse(newCategory);
  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validated.success) {
      setError(validated.error.message);
      setSuccess("");
      return;
    }

    // Check if at least one field has been modified
    const hasChanges =
      (newCategory.title &&
        newCategory.title.trim() !== originalCategory.title) ||
      newCategory.image;

    if (!hasChanges) {
      setError("Please make at least one change to update the category");
      setSuccess("");
      return;
    }

    // Confirm before submitting
    const confirmUpdate = window.confirm(
      "Are you sure you want to update this category? This action cannot be undone."
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
      if (
        newCategory.title &&
        newCategory.title.trim() !== originalCategory.title
      ) {
        formData.append("title", newCategory.title.trim());
      }
      if (newCategory.image) {
        formData.append("image", newCategory.image);
      }

      const response = await Axios.post(`/category/edit/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setSuccess("Category updated successfully!");
        setError("");
        setTimeout(() => {
          router.push("/dashboard/categories");
        }, 1500);
      }
    } catch (err: unknown) {
      console.error(err);
      let errorMessage = "Error updating category";

      if (err && typeof err === "object" && "response" in err) {
        const response = (
          err as { response?: { data?: { message?: string }; status?: number } }
        ).response;
        if (response?.data?.message) {
          errorMessage = response.data.message;
        } else if (response?.status === 422) {
          errorMessage = "Validation error. Please check your input.";
        } else if (response?.status === 404) {
          errorMessage = "Category not found.";
        } else if (response?.status === 403) {
          errorMessage = "You don't have permission to edit this category.";
          router.replace("/forbidden");
        }
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
        onSubmit={handleEdit}
        noValidate
      >
        {/* === HEADING === */}

        <h1 className="text-4xl font-semibold uppercase mb-8">
          Edit Category ({id})
        </h1>

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
              className={`peer w-full lg:w-[90%] h-18 outline-0 rounded-sm bg-slate-50 pl-6 shadow-[inset_0_0_10px_0_rgba(0,0,0,0.1)] ${
                newCategory.title !== originalCategory.title
                  ? "border-2 border-blue-300"
                  : ""
              }`}
              required
            />
            <p
              className={`absolute -top-2 left-0 text-sm bg-card transition-all duration-200 ${
                newCategory.title
                  ? "opacity-100 -translate-y-2.5"
                  : "opacity-0 translate-y-2"
              }`}
            >
              Title{" "}
              {newCategory.title !== originalCategory.title && (
                <span className="text-blue-500">(modified)</span>
              )}
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
              className={`cursor-pointer w-full lg:w-[90%] h-18 outline-0 rounded-sm bg-slate-50 pl-6 pr-6 shadow-[inset_0_0_10px_0_rgba(0,0,0,0.1)] flex items-center justify-between hover:bg-slate-100 transition-colors duration-200 ${
                newCategory.image ? "border-2 border-blue-300" : ""
              }`}
            >
              <span className="text-gray-500">
                {newCategory.image
                  ? newCategory.image.name
                  : "Choose new image (optional)..."}
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
              Image (optional){" "}
              {newCategory.image && (
                <span className="text-blue-500">(modified)</span>
              )}
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
              onClick={() => {
                setNewCategory({
                  title: originalCategory.title,
                  image: undefined,
                });
                setError("");
                setSuccess("");
              }}
              className="w-1/4 cursor-pointer capitalize font-semibold h-10 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
            >
              Reset
            </button>
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
                  Updating...
                </>
              ) : (
                "Edit Category"
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

export default EditCategory;
