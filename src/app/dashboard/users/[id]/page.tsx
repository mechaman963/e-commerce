"use client";

import Loading from "@/app/loading";
import { Axios } from "@/axios";
import { useParams, useRouter } from "next/navigation";
import { JSX, useEffect, useState } from "react";
import { z } from "zod";

// === ZOD BASE SCHEMA ===

const baseSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  email: z
    .string()
    .email("Enter a valid email")
    .transform((value) => value.toLowerCase().trim())
    .optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must be at most 16 characters")
    .optional()
    .or(z.literal("")),

  role: z.string().length(4),
});

// === ZOD EDIT SCHEMA ===

const editSchema = baseSchema.extend({
  id: z.string().optional(),
});

// === TYPES ===

type TInputs = {
  name?: string;
  email: string;
  password: string;
  role: string;
};

const User = (): JSX.Element => {
  const router = useRouter();

  const { id } = useParams();
  const [_, setUser] = useState<object>({});
  const [originalUser, setOriginalUser] = useState<TInputs>({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const [newUser, setNewUser] = useState<TInputs>({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await Axios.get(`/user/${id}`);
        setUser(response.data);
        // If the target user is admin, redirect away
        if (response.data?.role === "1995") {
          router.replace("/forbidden");
          return;
        }
        setNewUser({
          name: response.data.name,
          email: response.data.email,
          password: "",
          role: response.data.role,
        });
        setOriginalUser({
          name: response.data.name,
          email: response.data.email,
          password: "",
          role: response.data.role,
        });
        setLoading(false);
      } catch (err) {
        console.log(err);
        // Redirect to not-found page if the user does not exist
        if (err && typeof err === "object" && "response" in err) {
          const response = (err as { response?: { status?: number } }).response;
          if (response?.status === 404) {
            router.replace("/not-found");
            return;
          }
        }
        setError("Error fetching user");
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading)
    return (
      <div className={``}>
        <Loading />
      </div>
    );

  if (error) return <div className={``}>{error}</div>;

  // === HANDLE EDIT ===

  const validated = editSchema.safeParse(newUser);
  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validated.success) {
      setError(validated.error.message);
      setSuccess("");
      return;
    }

    // Check if at least one field has been modified
    const hasChanges =
      (newUser.name && newUser.name.trim() !== originalUser.name) ||
      (newUser.email && newUser.email.trim() !== originalUser.email) ||
      (newUser.password && newUser.password.trim() !== "") ||
      newUser.role !== originalUser.role;

    if (!hasChanges) {
      setError("Please make at least one change to update the user");
      setSuccess("");
      return;
    }

    // Confirm before submitting
    const confirmUpdate = window.confirm(
      "Are you sure you want to update this user? This action cannot be undone."
    );

    if (!confirmUpdate) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // Only send fields that have values
      const updateData: Partial<TInputs> = {};
      if (newUser.name && newUser.name.trim())
        updateData.name = newUser.name.trim();
      if (newUser.email && newUser.email.trim())
        updateData.email = newUser.email.trim();
      if (newUser.password && newUser.password.trim())
        updateData.password = newUser.password;
      if (newUser.role) updateData.role = newUser.role;

      const response = await Axios.post(`/user/edit/${id}`, updateData);

      if (response.status === 200) {
        setSuccess("User updated successfully!");
        setError("");
        setTimeout(() => {
          router.push("/dashboard/users");
        }, 1500);
      }
    } catch (err: unknown) {
      console.error(err);
      let errorMessage = "Error updating user";

      if (err && typeof err === "object" && "response" in err) {
        const response = (
          err as { response?: { data?: { message?: string }; status?: number } }
        ).response;
        if (response?.data?.message) {
          errorMessage = response.data.message;
        } else if (response?.status === 422) {
          errorMessage = "Validation error. Please check your input.";
        } else if (response?.status === 404) {
          errorMessage = "User not found.";
        } else if (response?.status === 403) {
          errorMessage = "You don't have permission to edit this user.";
          router.replace("/forbidden");
        }
      }

      setError(errorMessage);
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-4`}>
      <form
        className="w-full lg:w-1/2 bg-card lg:bg-transparent px-4 py-6 sm:p-8 lg:px-4 lg:py-6 xl:p-8 flex flex-col justify-between  z-20"
        onSubmit={handleEdit}
        noValidate
      >
        {/* === HEADING === */}

        <h1 className="text-4xl font-semibold uppercase mb-8">
          Edit User ({id})
        </h1>

        <div className="flex flex-col justify-center gap-8 min-h-3/5">
          {/* === NAME === */}

          <div className="relative">
            <input
              type="text"
              placeholder="Name..."
              value={newUser.name || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNewUser((prev) => ({
                  ...prev,
                  name: e.target.value,
                }));
              }}
              id="Name"
              className={`peer w-full lg:w-[90%] h-18 outline-0 rounded-sm bg-slate-50 pl-6 shadow-[inset_0_0_10px_0_rgba(0,0,0,0.1)] ${
                newUser.name !== originalUser.name
                  ? "border-2 border-blue-300"
                  : ""
              }`}
              required
            />
            <p
              className={`absolute -top-2 left-0 text-sm bg-card transition-all duration-200 ${
                newUser.name
                  ? "opacity-100 -translate-y-2.5"
                  : "opacity-0 translate-y-2"
              }`}
            >
              Name{" "}
              {newUser.name !== originalUser.name && (
                <span className="text-blue-500">(modified)</span>
              )}
            </p>
            <div
              className={`absolute bottom-0 left-0 w-full lg:w-[90%] h-[3px] rounded-b-md rounded-bl-md z-30 opacity-0 peer-focus:opacity-100 duration-200 ${
                newUser.name === "" ? "bg-red" : "bg-primary"
              }`}
            />
          </div>

          {/* === EMAIL === */}

          <div className="relative">
            <input
              type="email"
              placeholder="Email..."
              value={newUser.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNewUser((prev) => ({
                  ...prev,
                  email: e.target.value,
                }));
              }}
              id="Email"
              className={`peer w-full lg:w-[90%] h-18 outline-0 rounded-sm bg-slate-50 pl-6 shadow-[inset_0_0_10px_0_rgba(0,0,0,0.1)] ${
                newUser.email !== originalUser.email
                  ? "border-2 border-blue-300"
                  : ""
              }`}
              required
            />
            <p
              className={`absolute -top-2 left-0 text-sm bg-card transition-all duration-200 ${
                newUser.email
                  ? "opacity-100 -translate-y-2.5"
                  : "opacity-0 translate-y-2"
              }`}
            >
              Email{" "}
              {newUser.email !== originalUser.email && (
                <span className="text-blue-500">(modified)</span>
              )}
            </p>
            <div
              className={`absolute bottom-0 left-0 w-full lg:w-[90%] h-[3px] rounded-b-md rounded-bl-md z-30 opacity-0 peer-focus:opacity-100 duration-200 ${
                newUser.email === "" ||
                !newUser.email.includes("@") ||
                !newUser.email.includes(".")
                  ? "bg-red"
                  : "bg-primary"
              }`}
            />
          </div>

          {/* === PASSWORD === */}

          <div className="relative">
            <input
              type="password"
              placeholder="Password (leave blank to keep current)..."
              value={newUser.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setNewUser((prev) => ({
                  ...prev,
                  password: e.target.value,
                }));
              }}
              id="Password"
              className={`peer w-full lg:w-[90%] h-18 outline-0 rounded-sm bg-slate-50 pl-6 shadow-[inset_0_0_10px_0_rgba(0,0,0,0.1)] ${
                newUser.password && newUser.password.trim() !== ""
                  ? "border-2 border-blue-300"
                  : ""
              }`}
              min={8}
              max={16}
            />
            <p
              className={`absolute -top-2 left-0 text-sm bg-card transition-all duration-200 ${
                newUser.password
                  ? "opacity-100 -translate-y-2.5"
                  : "opacity-0 translate-y-2"
              }`}
            >
              Password (optional){" "}
              {newUser.password && newUser.password.trim() !== "" && (
                <span className="text-blue-500">(modified)</span>
              )}
            </p>
            <div
              className={`absolute bottom-0 left-0 w-full lg:w-[90%] h-[3px] rounded-b-md rounded-bl-md z-30 opacity-0 peer-focus:opacity-100 duration-200 ${
                newUser.password &&
                (newUser.password.length < 8 || newUser.password.length > 16)
                  ? "bg-red"
                  : "bg-primary"
              }`}
            />
          </div>
          <select
            name="Role"
            id="Role"
            className="w-1/3 border-4 border-accent px-4 text-lg py-2"
            value={newUser.role}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setNewUser((prev) => ({
                ...prev,
                role: e.target.value,
              }));
            }}
          >
            <option value="1995">Admin</option>
            <option value="3276">Manager</option>
            <option value="2001">User</option>
          </select>
          <div className="flex justify-between items-end lg:w-[90%]">
            <button
              type="button"
              onClick={() => {
                setNewUser({
                  name: originalUser.name,
                  email: originalUser.email,
                  password: "",
                  role: originalUser.role,
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
              onClick={() => router.push("/dashboard/users")}
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
                "Edit User"
              )}
            </button>
          </div>
        </div>
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
export default User;
