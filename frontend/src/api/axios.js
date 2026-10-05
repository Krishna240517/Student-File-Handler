import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://student-file-handler-backend.vercel.app',
    withCredentials: true
})

//response interceptors
api.interceptors.response.use((response) => response,
async(error) => {
    const originalRequest = error.config;

    if(error.response?.status === 401 && !originalRequest._retry){
        originalRequest._retry = true;
    }

    try {
        await api.post("/api-auth/refresh");
        return api(originalRequest);
    } catch(error) {
         console.error("Refresh failed:", error);
            window.location.href = "/login";
    }
    return Promise.reject(error);
})

export default api;
