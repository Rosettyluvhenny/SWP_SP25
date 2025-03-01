import axiosClient from './axiosClient';
import { ApiResponse, Service, ServiceCategory, ServiceInfo } from '../types/service.types';

// Get all services
export const getAllServices = async (): Promise<Service[]> => {
  try {
    const response = await axiosClient.get<ApiResponse<Service[]>>('/services');
    return response.data.result;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

// Get service by ID
export const getServiceById = async (id: number): Promise<Service> => {
  try {
    const response = await axiosClient.get<ApiResponse<Service>>(`/services/${id}`);
    return response.data.result;
  } catch (error) {
    console.error(`Error fetching service with ID ${id}:`, error);
    throw error;
  }
};

// Get service info by ID
export const getServiceInfoById = async (id: number): Promise<ServiceInfo> => {
  try {
    const response = await axiosClient.get<ApiResponse<ServiceInfo>>(`/serviceInfo/${id}`);
    return response.data.result;
  } catch (error) {
    console.error(`Error fetching service info with ID ${id}:`, error);
    throw error;
  }
};

// Get all service categories
export const getAllServiceCategories = async (): Promise<ServiceCategory[]> => {
  try {
    const response = await axiosClient.get<ApiResponse<ServiceCategory[]>>('/category');
    return response.data.result;
  } catch (error) {
    console.error('Error fetching service categories:', error);
    throw error;
  }
};

// Get service category by ID
export const getServiceCategoryById = async (id: number): Promise<ServiceCategory> => {
  try {
    const response = await axiosClient.get<ApiResponse<ServiceCategory>>(`/category/${id}`);
    return response.data.result;
  } catch (error) {
    console.error(`Error fetching service category with ID ${id}:`, error);
    throw error;
  }
}; 