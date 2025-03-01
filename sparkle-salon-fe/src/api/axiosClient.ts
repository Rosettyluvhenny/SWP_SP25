import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = 'http://localhost:8081/swp';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Create axios instance
const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Function to handle retries
const retryRequest = async (
  error: AxiosError, 
  retryCount: number = 0
): Promise<AxiosResponse> => {
  const config = error.config as AxiosRequestConfig & { _retry?: boolean };
  
  // If we've already retried the maximum number of times, throw the error
  if (retryCount >= MAX_RETRIES) {
    throw error;
  }
  
  // Mark this request as retried
  config._retry = true;
  
  // Wait before retrying
  await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
  
  // Retry the request
  return axiosClient(config);
};

// Add a request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // Network errors - attempt retry
    if (error.message === 'Network Error' && !originalRequest._retry) {
      try {
        return await retryRequest(error);
      } catch (retryError) {
        toast.error('Network error. Please check your connection.');
        return Promise.reject(retryError);
      }
    }
    
    // Handle specific HTTP errors
    if (error.response) {
      const status = error.response.status;
      
      // Handle authentication errors
      if (status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem('token');
        toast.error('Your session has expired. Please log in again.');
        window.location.href = '/login';
        return Promise.reject(error);
      }
      
      // Handle forbidden errors
      if (status === 403) {
        toast.error('You do not have permission to perform this action.');
        return Promise.reject(error);
      }
      
      // Handle not found
      if (status === 404) {
        toast.error('The requested resource was not found.');
        return Promise.reject(error);
      }
      
      // Handle server errors
      if (status >= 500) {
        toast.error('Server error. Please try again later.');
        
        // Retry server errors
        if (!originalRequest._retry) {
          try {
            return await retryRequest(error);
          } catch (retryError) {
            return Promise.reject(retryError);
          }
        }
      }
      
      // Handle validation errors (typically 400)
      if (status === 400) {
        const data = error.response.data as { message?: string };
        toast.error(data.message || 'Invalid request. Please check your data.');
        return Promise.reject(error);
      }
    }
    
    // Handle other errors
    console.error('API Error:', error);
    toast.error('An unexpected error occurred. Please try again.');
    return Promise.reject(error);
  }
);

export default axiosClient; 