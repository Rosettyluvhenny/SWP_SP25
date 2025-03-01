import axiosClient from './axiosClient';
import { ApiResponse, ServiceInfo, ServiceInfoRequest, ServiceInfoResponse, ServiceInfoUpdateRequest } from './types';

const serviceInfoApi = {
  /**
   * Get a service info by ID
   * @param id - The service info ID
   * @returns Promise with the service info
   */
  getById: async (id: number): Promise<ServiceInfo> => {
    const response = await axiosClient.get<ApiResponse<ServiceInfoResponse>>(`/serviceInfo/${id}`);
    return response.data.result;
  },

  /**
   * Get service info by service ID
   * @param serviceId - The service ID
   * @returns Promise with the service info
   */
  getByServiceId: async (serviceId: number): Promise<ServiceInfo> => {
    const response = await axiosClient.get<ApiResponse<ServiceInfoResponse>>(`/serviceInfo/service/${serviceId}`);
    return response.data.result;
  },

  /**
   * Create a new service info
   * @param data - The service info data
   * @param files - Optional files to upload
   * @returns Promise with the created service info
   */
  create: async (
    data: ServiceInfoRequest, 
    files?: { 
      serviceImg?: File, 
      desImg?: File, 
      techImg?: File, 
      mechaImg?: File 
    }
  ): Promise<ServiceInfo> => {
    // If we have files, we need to use FormData
    if (files && (files.serviceImg || files.desImg || files.techImg || files.mechaImg)) {
      const formData = new FormData();
      
      // Add files if they exist
      if (files.serviceImg) formData.append('serviceImg', files.serviceImg);
      if (files.desImg) formData.append('desImg', files.desImg);
      if (files.techImg) formData.append('techImg', files.techImg);
      if (files.mechaImg) formData.append('mechaImg', files.mechaImg);
      
      // Make the request with query parameters and FormData
      const response = await axiosClient.post<ApiResponse<ServiceInfoResponse>>(
        `/serviceInfo?serviceId=${data.serviceId}&description=${encodeURIComponent(data.description)}&tech=${encodeURIComponent(data.tech)}&mechanism=${encodeURIComponent(data.mechanism)}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.result;
    } else {
      // No files, just send the JSON data
      const response = await axiosClient.post<ApiResponse<ServiceInfoResponse>>(
        `/serviceInfo?serviceId=${data.serviceId}&description=${encodeURIComponent(data.description)}&tech=${encodeURIComponent(data.tech)}&mechanism=${encodeURIComponent(data.mechanism)}`,
        {}
      );
      return response.data.result;
    }
  },

  /**
   * Update a service info
   * @param id - The service info ID
   * @param data - The updated service info data
   * @param files - Optional files to upload
   * @returns Promise with the updated service info
   */
  update: async (
    id: number, 
    data: ServiceInfoUpdateRequest, 
    files?: { 
      serviceImg?: File, 
      desImg?: File, 
      techImg?: File, 
      mechaImg?: File 
    }
  ): Promise<ServiceInfo> => {
    // Build query parameters
    const queryParams = new URLSearchParams();
    if (data.description) queryParams.append('description', data.description);
    if (data.tech) queryParams.append('tech', data.tech);
    if (data.mechanism) queryParams.append('mechanism', data.mechanism);
    
    // If we have files, we need to use FormData
    if (files && (files.serviceImg || files.desImg || files.techImg || files.mechaImg)) {
      const formData = new FormData();
      
      // Add files if they exist
      if (files.serviceImg) formData.append('serviceImg', files.serviceImg);
      if (files.desImg) formData.append('desImg', files.desImg);
      if (files.techImg) formData.append('techImg', files.techImg);
      if (files.mechaImg) formData.append('mechaImg', files.mechaImg);
      
      // Make the request with query parameters and FormData
      const response = await axiosClient.put<ApiResponse<ServiceInfoResponse>>(
        `/serviceInfo/${id}?${queryParams.toString()}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.result;
    } else {
      // No files, just send the JSON data with query parameters
      const response = await axiosClient.put<ApiResponse<ServiceInfoResponse>>(
        `/serviceInfo/${id}?${queryParams.toString()}`,
        {}
      );
      return response.data.result;
    }
  },

  /**
   * Delete a service info
   * @param id - The service info ID
   * @returns Promise with the API response
   */
  delete: async (id: number): Promise<ApiResponse<null>> => {
    const response = await axiosClient.delete<ApiResponse<null>>(`/serviceInfo/${id}`);
    return response.data;
  },
};

export default serviceInfoApi; 