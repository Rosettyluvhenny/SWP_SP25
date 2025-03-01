// Common API response wrapper
export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

// Service Category Types
export interface ServiceCategory {
  id: number;
  name: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ServiceCategoryRequest {
  name: string;
}

export type ServiceCategoryResponse = ServiceCategory;

// Services Types
export interface Service {
  id: number;
  name: string;
  serviceCategory: ServiceCategory;
  subTitle?: string;
  price: number;
  duration: number;
  createdAt: string;
  updatedAt?: string;
  session: number;
  active: boolean;
  serviceInfo?: ServiceInfo;
}

export interface ServicesRequest {
  name: string;
  serviceCategoryId: number;
  subTitle?: string;
  price: number;
  duration: number;
  session: number;
  active: boolean;
}

export type ServicesResponse = Service;

// Service Info Types
export interface ServiceInfo {
  id: number;
  service: Service;
  description: string;
  desImgUrl?: string;
  tech: string;
  techImgUrl?: string;
  mechanism: string;
  mechaImgUrl?: string;
  serviceImgUrl?: string;
}

export interface ServiceInfoRequest {
  serviceId: number;
  description: string;
  tech: string;
  mechanism: string;
}

export interface ServiceInfoUpdateRequest {
  description?: string;
  tech?: string;
  mechanism?: string;
}

export type ServiceInfoResponse = ServiceInfo; 