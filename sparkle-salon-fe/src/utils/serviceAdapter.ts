import { Service as ApiService } from '../api/types';
import { Service as FrontendService } from '../types/service';

/**
 * Converts API service format to frontend service format
 * We'll rely on the EncodedText component to handle encoding issues when displaying
 */
export const adaptServiceToFrontend = (apiService: ApiService): FrontendService => {
  return {
    id: apiService.id,
    name: apiService.name || 'Unnamed Service',
    img: apiService.serviceInfo?.serviceImgUrl || 'https://placehold.co/600x400?text=No+Image',
    price: apiService.price || 0,
    duration: apiService.duration ? `${apiService.duration} phút` : '30 phút',
    popularity: 50000, // Default popularity since API doesn't have this
    description: apiService.serviceInfo?.description || apiService.subTitle || '',
    category: apiService.serviceCategory?.name || 'Uncategorized'
  };
};

/**
 * Converts a list of API services to frontend service format
 */
export const adaptServicesToFrontend = (apiServices: ApiService[]): FrontendService[] => {
  if (!apiServices || !Array.isArray(apiServices) || apiServices.length === 0) {
    console.warn('No services found or invalid services data');
    return [];
  }
  
  return apiServices.map(service => {
    try {
      return adaptServiceToFrontend(service);
    } catch (error) {
      console.error('Error adapting service:', service, error);
      // Return a fallback service object
      return {
        id: service.id || 0,
        name: 'Error: Invalid Service Data',
        img: 'https://placehold.co/600x400?text=Error',
        price: 0,
        duration: 'N/A',
        popularity: 0,
        description: 'There was an error processing this service data.',
        category: 'Error'
      };
    }
  });
}; 