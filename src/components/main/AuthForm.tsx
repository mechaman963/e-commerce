"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import * as z from "zod";
import Loader from "../Loader";
import Link from "next/link";
import Cookies from "universal-cookie";
import LoginWithGoogle from "../LoginWithGoogle";
import { Axios } from "@/axios";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

// === ZOD BASE SCHEMA ===
const baseSchema = z.object({
  email: z
    .string()
    .email("Enter a valid email")
    .transform((value) => value.toLowerCase().trim()),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// === ZOD SIGNUP SCHEMA ===
const signupSchema = baseSchema.extend({
  name: z.string().min(1, "Name is required"),
});

// === TYPES ===
type TInputs = {
  name?: string;
  email: string;
  password: string;
};

const AuthForm = ({ parent }: { parent: string }) => {
  // === TOKEN HANDLING ===
  const cookies = new Cookies();

  // === ROUTING ===
  const router = useRouter();

  // === STATES ===
  const [inputs, setInputs] = useState<TInputs>({
    name: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  // === SWITCHING BETWEEN SIGN UP AND LOG IN PAGES ===
  let heading;
  switch (parent) {
    case "signup":
      heading = "Create Account";
      break;
    case "login":
      heading = "Welcome Back";
      break;
  }

  // === GET ROLE ===
  const getRole = async (id: number) => {
    try {
      const res = await Axios.get(`/user/${id}`);
      cookies.set("role", `${res.data.role}`);
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  // === HANDLING SUBMIT ===
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (parent === "signup") {
      const result = signupSchema.safeParse(inputs);
      if (!result.success) {
        setError(result.error.issues[0].message);
        return;
      }
      setIsSubmitting(true);
      try {
        const res = await Axios.post(`/register`, inputs);
        cookies.set("Bearer", res.data.token);
        cookies.set("currentUserId", res.data.user.id);
        await getRole(res.data.user.id);
        router.push("/");
      } catch (e: unknown) {
        console.log(e);
        if (
          e &&
          typeof e === "object" &&
          "response" in e &&
          e.response &&
          typeof e.response === "object" &&
          "status" in e.response
        ) {
          const response = e.response as {
            status: number;
            data?: Record<string, unknown>;
          };
          if (response.status === 422) {
            const errorData = response.data;
            if (errorData?.errors) {
              const firstError = Object.values(errorData.errors)[0];
              setError(Array.isArray(firstError) ? firstError[0] : firstError);
            } else {
              setError("Email is already taken.");
            }
          } else if (response.status === 400) {
            setError("Invalid input data. Please check your information.");
          } else {
            setError("Server error. Please try again later.");
          }
        } else {
          setError("Network error. Please check your connection.");
        }
      } finally {
        setIsSubmitting(false);
      }
    } else if (parent === "login") {
      const result = baseSchema.safeParse(inputs);
      if (!result.success) {
        setError(result.error.issues[0].message);
        return;
      }
      setIsSubmitting(true);
      try {
        const res = await Axios.post(`/login`, inputs);
        cookies.set("Bearer", res.data.token);
        cookies.set("currentUserId", res.data.user.id);
        await getRole(res.data.user.id);
        router.push("/");
      } catch (e: unknown) {
        console.log(e);
        if (
          e &&
          typeof e === "object" &&
          "response" in e &&
          e.response &&
          typeof e.response === "object" &&
          "status" in e.response
        ) {
          const response = e.response as {
            status: number;
            data?: Record<string, unknown>;
          };
          if (response.status === 401) {
            setError("Email or password is not correct.");
          } else if (response.status === 422) {
            const errorData = response.data;
            if (errorData?.errors) {
              const firstError = Object.values(errorData.errors)[0];
              setError(Array.isArray(firstError) ? firstError[0] : firstError);
            } else {
              setError("Invalid credentials.");
            }
          } else if (response.status === 400) {
            setError("Invalid input data. Please check your information.");
          } else {
            setError("Server error. Please try again later.");
          }
        } else {
          setError("Network error. Please check your connection.");
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (isSubmitting) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{heading}</h1>
            <p className="text-gray-600">
              {parent === "signup"
                ? "Create your account to get started"
                : "Sign in to your account to continue"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Name Field (only for signup) */}
            {parent === "signup" && (
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    placeholder="Enter your name"
                    value={inputs.name || ""}
                    onChange={(e) =>
                      setInputs((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={inputs.email}
                  onChange={(e) =>
                    setInputs((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  value={inputs.password}
                  onChange={(e) =>
                    setInputs((prev) => ({ ...prev, password: e.target.value }))
                  }
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  minLength={8}
                  maxLength={16}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Must be at least 8 characters
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {parent === "signup" ? "Create Account" : "Sign In"}
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-6">
              <div className="border-t border-gray-300 flex-grow"></div>
              <span className="px-3 text-gray-500 text-sm">
                Or continue with
              </span>
              <div className="border-t border-gray-300 flex-grow"></div>
            </div>

            {/* Google Login */}
            <LoginWithGoogle />

            {/* Switch Auth Mode */}
            <div className="text-center text-sm text-gray-600">
              {parent === "signup"
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <Link
                href={parent === "signup" ? "/login" : "/signup"}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {parent === "signup" ? "Sign in" : "Sign up"}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
