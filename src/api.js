// src/api.js
import axios from "axios";
import { getAccessToken, setAccessToken, clearAuth } from "./store/auth/authStorage";

// Use /api prefix which will be proxied by Vite to the backend server
const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add Authorization header (persisted so login survives browser close)
api.interceptors.request.use(
    (config) => {
        const accessToken = getAccessToken();
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Single in-flight refresh: only one /auth/refresh at a time, others wait and then retry
let refreshPromise = null;

function isRefreshRequest(config) {
    const url = config?.url ?? "";
    return url.includes("auth/refresh");
}

function doRefresh() {
    if (refreshPromise) return refreshPromise;
    refreshPromise = api
        .post("/auth/refresh", null, { withCredentials: true })
        .then((res) => {
            const token = res.data?.accessToken;
            if (!token) throw new Error("No token");
            setAccessToken(token);
            return token;
        })
        .finally(() => {
            refreshPromise = null;
        });
    return refreshPromise;
}

function redirectToLogin() {
    clearAuth();
    if (typeof window !== "undefined") window.location.replace("/");
}

// Response interceptor: on 401, refresh once then retry; if refresh fails, redirect to login
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config;
        if (error.response?.status !== 401 || !config) {
            return Promise.reject(error);
        }

        // Never intercept the refresh request itself — go straight to login
        if (isRefreshRequest(config)) {
            redirectToLogin();
            return Promise.reject(error);
        }

        // Already retried this request — don’t loop
        if (config._retry) {
            return Promise.reject(error);
        }

        config._retry = true;

        try {
            const newToken = await doRefresh();
            config.headers.Authorization = `Bearer ${newToken}`;
            return api(config);
        } catch (err) {
            redirectToLogin();
            return Promise.reject(err);
        }
    }
);

export default api;
