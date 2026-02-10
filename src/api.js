// src/api.js
import axios from "axios";

// Use /api prefix which will be proxied by Vite to the backend server
const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

import { getAccessToken, setAccessToken } from './utils/tokenManager';

// Request interceptor to add Authorization header
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

// Response interceptor to handle 401 errors globally and refresh access token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Don't retry refresh endpoint if it fails - avoid infinite loop
        if (originalRequest.url === "/auth/refresh" || originalRequest.url?.includes("/auth/refresh")) {
            return Promise.reject(error);
        }

        // If the error is due to an expired token (401) and we haven't already tried to refresh
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                // Call the refresh endpoint through the proxy
                const refreshResponse = await api.get("/auth/refresh", {
                    withCredentials: true
                });

                const { accessToken } = refreshResponse.data;
                if (accessToken) {
                    setAccessToken(accessToken);

                    // Retry the original request with the new access token
                    originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
                    return api(originalRequest);
                }
            } catch (err) {
                // Refresh failed - redirect to login
                window.location.href = "/";
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
