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

// Request interceptor to add Authorization header
api.interceptors.request.use(
    (config) => {
        const accessToken = sessionStorage.getItem("accessToken");
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

        // If the error is due to an expired token (401)
        if (error.response && error.response.status === 401) {
            try {
                // Call the refresh endpoint through the proxy
                const refreshResponse = await api.post("/auth/refresh", null, {
                    withCredentials: true
                });

                const { accessToken } = refreshResponse.data;
                sessionStorage.setItem("accessToken", accessToken);

                // Retry the original request with the new access token
                originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (err) {
                console.error("Refresh token failed:", err);
                window.location.href = "/";
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
