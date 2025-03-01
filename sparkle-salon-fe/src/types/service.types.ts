// API Response wrapper type
export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

// Service Category
export interface ServiceCategory {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Service Info
export interface ServiceInfo {
  id: number;
  description: string;
  desImgUrl: string;
  tech: string;
  serviceImgUrl: string;
  techImgUrl: string;
  mechanism: string;
  mechaImgUrl: string;
}

// Service
export interface Service {
  id: number;
  name: string;
  serviceCategory: ServiceCategory;
  subTitle: string;
  price: number;
  duration: number; // in minutes
  createdAt: string;
  updatedAt: string;
  session: number;
  active: boolean;
  serviceInfo: ServiceInfo;
}

// Frontend Service type (for compatibility with existing components)
export interface FrontendService {
  id: number;
  name: string;
  img: string;
  price: number;
  duration: string;
  popularity: number;
  category?: string;
  description?: string;
}

// Convert API Service to Frontend Service
export const mapServiceToFrontendService = (service: Service): FrontendService => {
  return {
    id: service.id,
    name: service.name,
    img: service.serviceInfo?.serviceImgUrl || '',
    price: service.price,
    duration: `${service.duration} phút`,
    popularity: service.session || 0,
    category: service.serviceCategory?.name,
    description: service.serviceInfo?.description || '',
  };
}; 