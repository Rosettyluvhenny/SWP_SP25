import axiosClient from './axiosClient';
import { ApiResponse, ServiceCategory, ServiceCategoryRequest, ServiceCategoryResponse } from './types';

const serviceCategoryApi = {
  /**
   * Get all service categories
   * @returns Promise with list of service categories
   */
  getAll: async (): Promise<ServiceCategory[]> => {
    const response = await axiosClient.get<ApiResponse<ServiceCategory[]>>('/category');
    return response.data.result;
  },

  /**
   * Get a service category by ID
   * @param id - The service category ID
   * @returns Promise with the service category
   */
  getById: async (id: number): Promise<ServiceCategory> => {
    const response = await axiosClient.get<ApiResponse<ServiceCategoryResponse>>(`/category/${id}`);
    return response.data.result;
  },

  /**
   * Create a new service category
   * @param data - The service category data
   * @returns Promise with the created service category
   */
  create: async (data: ServiceCategoryRequest): Promise<ServiceCategory> => {
    const response = await axiosClient.post<ApiResponse<ServiceCategoryResponse>>('/category', data);
    return response.data.result;
  },

  /**
   * Update a service category
   * @param id - The service category ID
   * @param data - The updated service category data
   * @returns Promise with the updated service category
   */
  update: async (id: number, data: ServiceCategoryRequest): Promise<ServiceCategory> => {
    const response = await axiosClient.put<ApiResponse<ServiceCategoryResponse>>(`/category/${id}`, data);
    return response.data.result;
  },

  /**
   * Delete a service category
   * @param id - The service category ID
   * @returns Promise with the API response
   */
  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await axiosClient.delete<ApiResponse<null>>(`/category/${id}`);
    return response.data;
  },
};

export default serviceCategoryApi; 