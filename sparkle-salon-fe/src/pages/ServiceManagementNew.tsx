import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ServiceForm from '../components/ServiceForm';
import { servicesApi, serviceCategoryApi, serviceInfoApi } from '../api';
import { Service } from '../types/service';
import { ServiceInfo, ServiceCategory } from '../api/types';
import EncodedText from '../components/EncodedText';

const ServiceManagementNew: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [selectedService, setSelectedService] = useState<Partial<Service & { categoryId?: number, subTitle?: string }> | null>(null);
  const [selectedServiceInfo, setSelectedServiceInfo] = useState<Partial<ServiceInfo> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const data = await servicesApi.getAll();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Không thể tải danh sách dịch vụ');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await serviceCategoryApi.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Không thể tải danh mục dịch vụ');
    }
  };

  const handleEditService = async (serviceId: number) => {
    try {
      setIsLoading(true);
      const serviceData = await servicesApi.getById(serviceId);
      
      // Prepare service data for the form
      const serviceForForm = {
        ...serviceData,
        categoryId: serviceData.serviceCategory?.id
      };
      
      setSelectedService(serviceForForm);
      
      // Fetch service info if available
      try {
        const serviceInfoData = await serviceInfoApi.getByServiceId(serviceId);
        setSelectedServiceInfo(serviceInfoData);
      } catch (error) {
        console.warn('No service info found:', error);
        setSelectedServiceInfo(null);
      }
      
      setIsEditing(true);
    } catch (error) {
      console.error('Error fetching service details:', error);
      toast.error('Không thể tải thông tin dịch vụ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewService = () => {
    setSelectedService({});
    setSelectedServiceInfo({});
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setSelectedService(null);
    setSelectedServiceInfo(null);
    setIsEditing(false);
  };

  const handleSubmit = async (
    serviceData: Partial<Service & { categoryId?: number, subTitle?: string }>,
    serviceInfoData: Partial<ServiceInfo & { 
      serviceImage?: File, 
      descriptionImage?: File, 
      techImage?: File, 
      mechanismImage?: File 
    }>
  ) => {
    try {
      setIsLoading(true);
      
      // Prepare service data for API
      const apiServiceData = {
        name: serviceData.name || '',
        price: serviceData.price || 0,
        duration: serviceData.duration || 0,
        serviceCategoryId: serviceData.categoryId || 0,
        subTitle: serviceData.subTitle || ''
      };
      
      let savedService;
      
      // Create or update service
      if (serviceData.id) {
        // Update existing service
        savedService = await servicesApi.update(serviceData.id, apiServiceData);
      } else {
        // Create new service
        savedService = await servicesApi.create(apiServiceData);
      }
      
      // Handle service info with file uploads
      if (savedService) {
        const formData = new FormData();
        
        // Add service ID
        formData.append('serviceId', savedService.id.toString());
        
        // Add text fields
        if (serviceInfoData.description) {
          formData.append('description', serviceInfoData.description);
        }
        if (serviceInfoData.tech) {
          formData.append('tech', serviceInfoData.tech);
        }
        if (serviceInfoData.mechanism) {
          formData.append('mechanism', serviceInfoData.mechanism);
        }
        
        // Add files if present
        if (serviceInfoData.serviceImage) {
          formData.append('serviceImage', serviceInfoData.serviceImage);
        }
        if (serviceInfoData.descriptionImage) {
          formData.append('descriptionImage', serviceInfoData.descriptionImage);
        }
        if (serviceInfoData.techImage) {
          formData.append('techImage', serviceInfoData.techImage);
        }
        if (serviceInfoData.mechanismImage) {
          formData.append('mechanismImage', serviceInfoData.mechanismImage);
        }
        
        // Save service info
        if (serviceInfoData.id) {
          await serviceInfoApi.update(serviceInfoData.id, formData);
        } else {
          await serviceInfoApi.create(formData);
        }
      }
      
      toast.success(serviceData.id ? 'Cập nhật dịch vụ thành công' : 'Tạo dịch vụ mới thành công');
      
      // Reset form and refresh data
      setIsEditing(false);
      setSelectedService(null);
      setSelectedServiceInfo(null);
      fetchServices();
      
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('Có lỗi xảy ra khi lưu dịch vụ');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteService = async (serviceId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
      try {
        setIsLoading(true);
        await servicesApi.delete(serviceId);
        toast.success('Xóa dịch vụ thành công');
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
        toast.error('Có lỗi xảy ra khi xóa dịch vụ');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20 pb-10">
      <ToastContainer />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Quản lý dịch vụ</h1>
          
          {!isEditing && (
            <button
              onClick={handleCreateNewService}
              className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
            >
              Thêm dịch vụ mới
            </button>
          )}
        </div>
        
        {isEditing ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {selectedService?.id ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
              </h2>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              >
                Hủy
              </button>
            </div>
            
            <ServiceForm
              initialService={selectedService || {}}
              initialServiceInfo={selectedServiceInfo || {}}
              categories={categories}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên dịch vụ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá (VNĐ)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thời gian
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : services.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Không có dịch vụ nào. Hãy thêm dịch vụ mới.
                    </td>
                  </tr>
                ) : (
                  services.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {service.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          <EncodedText text={service.name} />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          <EncodedText text={service.category || 'Không có danh mục'} />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {service.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {service.duration}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditService(service.id)}
                          className="text-pink-600 hover:text-pink-900 mr-4"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceManagementNew; 