
import axios from "axios";
import { mockHandlers, handleMockAction } from "./mockData";

const normalizeBaseUrl = (value) => {
  if (!value) return "";
  const v = String(value).trim().replace(/\/+$/, "");
  if (!v) return "";
  if (!/^https?:\/\//i.test(v)) return `https://${v}`;
  return v;
};

const withApiPrefix = (base) => {
  if (!base) return "";
  const v = String(base).trim().replace(/\/+$/, "");
  if (!v) return "";
  return /\/api$/i.test(v) ? v : `${v}/api`;
};

const isDemoMode = import.meta.env.VITE_DEMO_MODE === "true" || import.meta.env.VITE_DEMO_MODE === true;

export const getDemoLoginResponse = () => {
  const role = localStorage.getItem("demo_role") || "admin";
  return {
    token: "demo_token_12345",
    role: role,
    name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
    userId: "demo_user_id"
  };
};

const API = axios.create({
  baseURL: (() => {
    const envBase = normalizeBaseUrl(import.meta.env.VITE_API_URL);
    if (envBase) return withApiPrefix(envBase);
    return "/api";
  })(),
});

// Demo Mode Interceptor
if (isDemoMode) {
  API.interceptors.request.use((config) => {
    // Normalization: Ensure relative paths for matching
    let url = config.url;
    if (config.baseURL && url.startsWith(config.baseURL)) {
      url = url.replace(config.baseURL, "");
    }
    url = url.replace(/^\/api/, "") || "/";
    if (!url.startsWith("/")) url = "/" + url;

    const fullUrlWithParams = url + (config.params ? "?" + new URLSearchParams(config.params).toString() : "");
    
    // Match handler by URL or full URL with params
    const handler = mockHandlers[url] || 
                    mockHandlers[fullUrlWithParams] || 
                    mockHandlers[url.split('?')[0]]; // Fallback to base URL
    
    if (handler && config.method.toLowerCase() === "get") {
      console.log(`[Demo Mode] Intercepting GET ${url}`);
      config.adapter = async () => {
        return new Promise((resolve) => {
          setTimeout(() => resolve(handler()), 400); 
        });
      };
    } else if (config.method.toLowerCase() !== "get") {
      console.log(`[Demo Mode] Simulating ${config.method} ${url}`);
      config.adapter = async () => {
        return new Promise((resolve) => {
          setTimeout(() => resolve(handleMockAction(config)), 400);
        });
      };
    }
    return config;
  });
}

// attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message === "Network Error" && !isDemoMode) {
      console.error("NETWORK ERROR DIAGNOSTICS:", error);
    }
    return Promise.reject(error);
  }
);

export default API;
