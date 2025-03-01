import axiosClient from './axiosClient';
import { ApiResponse, Service, ServicesRequest, ServicesResponse } from './types';

const servicesApi = {
  /**
   * Get all services
   * @returns Promise with list of services
   */
  getAll: async (): Promise<Service[]> => {
    const response = await axiosClient.get<ApiResponse<Service[]>>('/services');
    return response.data.result;
  },

  /**
   * Get a service by ID
   * @param id - The service ID
   * @returns Promise with the service
   */
  getById: async (id: number): Promise<Service> => {
    const response = await axiosClient.get<ApiResponse<ServicesResponse>>(`/services/${id}`);
    return response.data.result;
  },

  /**
   * Create a new service
   * @param data - The service data
   * @returns Promise with the created service
   */
  create: async (data: ServicesRequest): Promise<Service> => {
    const response = await axiosClient.post<ApiResponse<ServicesResponse>>('/services', data);
    return response.data.result;
  },

  /**
   * Update a service
   * @param id - The service ID
   * @param data - The updated service data
   * @returns Promise with the updated service
   */
  update: async (id: number, data: ServicesRequest): Promise<Service> => {
    const response = await axiosClient.put<ApiResponse<ServicesResponse>>(`/services/${id}`, data);
    return response.data.result;
  },

  /**
   * Activate a service
   * @param id - The service ID
   * @returns Promise with the activated service
   */
  activate: async (id: number): Promise<Service> => {
    const response = await axiosClient.put<ApiResponse<ServicesResponse>>(`/services/${id}/activate`, {});
    return response.data.result;
  },

  /**
   * Deactivate a service
   * @param id - The service ID
   * @returns Promise with the deactivated service
   */
  deactivate: async (id: number): Promise<Service> => {
    const response = await axiosClient.put<ApiResponse<ServicesResponse>>(`/services/${id}/deactivate`, {});
    return response.data.result;
  },
};

export default servicesApi; 