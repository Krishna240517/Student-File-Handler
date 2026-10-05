import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://student-file-handler-backend.vercel.app',
    withCredentials: true
});

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/api-auth/refresh") &&
            !originalRequest.url?.includes("/api-auth/me") &&
            !originalRequest.url?.includes("/api-auth/login") &&
            !originalRequest.url?.includes("/api-auth/signup")
        ) {
            originalRequest._retry = true;
            try {
                await api.post("/api-auth/refresh");
                return api(originalRequest);
            } catch (refreshError) {
                console.error("Refresh failed:", refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
