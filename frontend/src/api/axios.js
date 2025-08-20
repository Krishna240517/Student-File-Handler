import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:3000',
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