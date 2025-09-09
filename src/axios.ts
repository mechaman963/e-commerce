import axios from "axios";
import Cookies from "universal-cookie";

// Simplified caching - only in production
interface CacheEntry {
  data: unknown;
  timestamp: number;
}
const cache = new Map<string, CacheEntry>();
const CACHE_DURATION =
  process.env.NODE_ENV === "production" ? 5 * 60 * 1000 : 0; // No cache in dev

export const Axios = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for auth and caching
Axios.interceptors.request.use(
  (config) => {
    const cookies = new Cookies();
    const token = cookies.get("Bearer");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Check cache for GET requests - only in production
    if (
      process.env.NODE_ENV === "production" &&
      config.method === "get" &&
      config.url &&
      CACHE_DURATION > 0
    ) {
      const cacheKey = `${config.baseURL}${config.url}`;
      const cachedData = cache.get(cacheKey);

      if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
        config.adapter = () => {
          return Promise.resolve({
            data: cachedData.data,
            status: 200,
            statusText: "OK",
            headers: {},
            config,
          });
        };
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for caching and error handling
Axios.interceptors.response.use(
  (response) => {
    // Cache successful GET responses - only in production
    if (
      process.env.NODE_ENV === "production" &&
      response.config.method === "get" &&
      response.config.url &&
      CACHE_DURATION > 0
    ) {
      const cacheKey = `${response.config.baseURL}${response.config.url}`;
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      });
    }

    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      const cookies = new Cookies();
      cookies.remove("Bearer");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Clear cache utility
export const clearCache = () => {
  cache.clear();
};

// Clear specific cache entry
export const clearCacheEntry = (url: string) => {
  const cacheKey = `http://127.0.0.1:8000/api${url}`;
  cache.delete(cacheKey);
};
