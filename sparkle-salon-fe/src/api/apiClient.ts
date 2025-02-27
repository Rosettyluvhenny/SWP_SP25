import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8081/swp", 
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth Token Interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
