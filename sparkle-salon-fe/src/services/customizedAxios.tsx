import axios from "axios";
import { refresh } from "../data/authData";
import { toast } from "react-toastify";

const instance = axios.create({
    baseURL: 'http://localhost:8081/swp',
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

instance.interceptors.response.use(
    (response) => {
        return response.data ? response.data : { statusCode: response.status };
    }, 
    async (error) => {
        const originalRequest = error.config;

        // If the error status is 401 and there is no originalRequest._retry flag
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshResponse = await refresh();
                
                if (refreshResponse.token) {
                    localStorage.setItem("token", refreshResponse.token);
                    
                    // Update the Authorization header with the new token
                    originalRequest.headers["Authorization"] = `Bearer ${refreshResponse.token}`;
                    
                    // Retry the original request
                    return instance(originalRequest);
                }
            } catch (refreshError) {
                console.error("Refresh token failed:", refreshError);
                
                // Clear user data and redirect to login
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                
                toast.error("Session expired. Please log in again.");
                
                // You might want to add a redirect to login page here
                // For example: window.location.href = '/login';
            }
        }

        // For other errors, show the error message
        if (error.response?.data?.message) {
            toast.error(error.response.data.message);
        }

        return Promise.reject(error);
    }
);

export default instance;