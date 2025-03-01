import axiosClient from './axiosClient';
import { ApiResponse, Service, ServiceCategory, ServiceInfo } from '../types/service.types';

// Simple cache implementation
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const getFromCache = <T>(key: string): T | null => {
  const cachedItem = cache.get(key);
  if (!cachedItem) return null;
  
  const now = Date.now();
  if (now - cachedItem.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  
  return cachedItem.data as T;
};

const setCache = <T>(key: string, data: T): void => {
  cache.set(key, { data, timestamp: Date.now() });
};

const clearCache = (keyPattern?: string): void => {
  if (keyPattern) {
    // Clear specific cache entries that match the pattern
    for (const key of cache.keys()) {
      if (key.includes(keyPattern)) {
        cache.delete(key);
      }
    }
  } else {
    // Clear all cache
    cache.clear();
  }
};

// Get all services
export const getAllServices = async (useCache = true): Promise<Service[]> => {
  const cacheKey = 'services:all';
  
  if (useCache) {
    const cachedData = getFromCache<Service[]>(cacheKey);
    if (cachedData) return cachedData;
  }
  
  try {
    const response = await axiosClient.get<ApiResponse<Service[]>>('/services');
    const data = response.data.result;
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

// Get services with pagination and filters
export const getServicesPaginated = async (
  page = 1, 
  limit = 10, 
  filters?: { 
    categoryId?: number; 
    search?: string; 
    minPrice?: number; 
    maxPrice?: number;
    active?: boolean;
  }
): Promise<{ services: Service[]; total: number; pages: number }> => {
  try {
    const response = await axiosClient.get<ApiResponse<{ services: Service[]; total: number; pages: number }>>('/services', {
      params: {
        page,
        limit,
        ...filters
      }
    });
    return response.data.result;
  } catch (error) {
    console.error('Error fetching paginated services:', error);
    throw error;
  }
};

// Get service by ID
export const getServiceById = async (id: number, useCache = true): Promise<Service> => {
  const cacheKey = `services:${id}`;
  
  if (useCache) {
    const cachedData = getFromCache<Service>(cacheKey);
    if (cachedData) return cachedData;
  }
  
  try {
    const response = await axiosClient.get<ApiResponse<Service>>(`/services/${id}`);
    const data = response.data.result;
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Error fetching service with ID ${id}:`, error);
    throw error;
  }
};

// Create a new service
export const createService = async (serviceData: Partial<Service>): Promise<Service> => {
  try {
    const response = await axiosClient.post<ApiResponse<Service>>('/services', serviceData);
    // Clear relevant caches
    clearCache('services:');
    return response.data.result;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};

// Update a service
export const updateService = async (id: number, serviceData: Partial<Service>): Promise<Service> => {
  try {
    const response = await axiosClient.put<ApiResponse<Service>>(`/services/${id}`, serviceData);
    // Clear specific caches
    clearCache(`services:${id}`);
    clearCache('services:all');
    return response.data.result;
  } catch (error) {
    console.error(`Error updating service with ID ${id}:`, error);
    throw error;
  }
};

// Delete a service
export const deleteService = async (id: number): Promise<void> => {
  try {
    await axiosClient.delete<ApiResponse<void>>(`/services/${id}`);
    // Clear specific caches
    clearCache(`services:${id}`);
    clearCache('services:all');
  } catch (error) {
    console.error(`Error deleting service with ID ${id}:`, error);
    throw error;
  }
};

// Get service info by ID
export const getServiceInfoById = async (id: number, useCache = true): Promise<ServiceInfo> => {
  const cacheKey = `serviceInfo:${id}`;
  
  if (useCache) {
    const cachedData = getFromCache<ServiceInfo>(cacheKey);
    if (cachedData) return cachedData;
  }
  
  try {
    const response = await axiosClient.get<ApiResponse<ServiceInfo>>(`/serviceInfo/${id}`);
    const data = response.data.result;
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Error fetching service info with ID ${id}:`, error);
    throw error;
  }
};

// Create service info
export const createServiceInfo = async (serviceInfoData: Partial<ServiceInfo>): Promise<ServiceInfo> => {
  try {
    const response = await axiosClient.post<ApiResponse<ServiceInfo>>('/serviceInfo', serviceInfoData);
    return response.data.result;
  } catch (error) {
    console.error('Error creating service info:', error);
    throw error;
  }
};

// Update service info
export const updateServiceInfo = async (id: number, serviceInfoData: Partial<ServiceInfo>): Promise<ServiceInfo> => {
  try {
    const response = await axiosClient.put<ApiResponse<ServiceInfo>>(`/serviceInfo/${id}`, serviceInfoData);
    // Clear specific cache
    clearCache(`serviceInfo:${id}`);
    return response.data.result;
  } catch (error) {
    console.error(`Error updating service info with ID ${id}:`, error);
    throw error;
  }
};

// Get all service categories
export const getAllServiceCategories = async (useCache = true): Promise<ServiceCategory[]> => {
  const cacheKey = 'categories:all';
  
  if (useCache) {
    const cachedData = getFromCache<ServiceCategory[]>(cacheKey);
    if (cachedData) return cachedData;
  }
  
  try {
    const response = await axiosClient.get<ApiResponse<ServiceCategory[]>>('/category');
    const data = response.data.result;
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching service categories:', error);
    throw error;
  }
};

// Get service category by ID
export const getServiceCategoryById = async (id: number, useCache = true): Promise<ServiceCategory> => {
  const cacheKey = `categories:${id}`;
  
  if (useCache) {
    const cachedData = getFromCache<ServiceCategory>(cacheKey);
    if (cachedData) return cachedData;
  }
  
  try {
    const response = await axiosClient.get<ApiResponse<ServiceCategory>>(`/category/${id}`);
    const data = response.data.result;
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Error fetching service category with ID ${id}:`, error);
    throw error;
  }
};

// Create a new category
export const createServiceCategory = async (categoryData: Partial<ServiceCategory>): Promise<ServiceCategory> => {
  try {
    const response = await axiosClient.post<ApiResponse<ServiceCategory>>('/category', categoryData);
    // Clear categories cache
    clearCache('categories:');
    return response.data.result;
  } catch (error) {
    console.error('Error creating service category:', error);
    throw error;
  }
};

// Update a category
export const updateServiceCategory = async (id: number, categoryData: Partial<ServiceCategory>): Promise<ServiceCategory> => {
  try {
    const response = await axiosClient.put<ApiResponse<ServiceCategory>>(`/category/${id}`, categoryData);
    // Clear specific caches
    clearCache(`categories:${id}`);
    clearCache('categories:all');
    return response.data.result;
  } catch (error) {
    console.error(`Error updating service category with ID ${id}:`, error);
    throw error;
  }
};

// Delete a category
export const deleteServiceCategory = async (id: number): Promise<void> => {
  try {
    await axiosClient.delete<ApiResponse<void>>(`/category/${id}`);
    // Clear specific caches
    clearCache(`categories:${id}`);
    clearCache('categories:all');
  } catch (error) {
    console.error(`Error deleting service category with ID ${id}:`, error);
    throw error;
  }
}; 