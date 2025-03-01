import React, { useState, useEffect } from 'react';
import { Service } from '../types/service';
import { ServiceInfo, ServiceCategory } from '../api/types';
import TextEditor from './TextEditor';
import { toast } from 'react-toastify';

interface ServiceFormProps {
  initialService?: Partial<Service & { categoryId?: number, subTitle?: string }>;
  initialServiceInfo?: Partial<ServiceInfo>;
  categories: ServiceCategory[];
  onSubmit: (service: Partial<Service & { categoryId?: number, subTitle?: string }>, serviceInfo: Partial<ServiceInfo>) => Promise<void>;
  isLoading: boolean;
}

const ServiceForm: React.FC<ServiceFormProps> = ({
  initialService = {},
  initialServiceInfo = {},
  categories,
  onSubmit,
  isLoading
}) => {
  const [service, setService] = useState<Partial<Service & { categoryId?: number, subTitle?: string }>>(initialService);
  const [serviceInfo, setServiceInfo] = useState<Partial<ServiceInfo>>(initialServiceInfo);
  const [serviceImage, setServiceImage] = useState<File | null>(null);
  const [descriptionImage, setDescriptionImage] = useState<File | null>(null);
  const [techImage, setTechImage] = useState<File | null>(null);
  const [mechanismImage, setMechanismImage] = useState<File | null>(null);

  useEffect(() => {
    setService(initialService);
    setServiceInfo(initialServiceInfo);
  }, [initialService, initialServiceInfo]);

  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setService(prev => ({ ...prev, [name]: name === 'price' || name === 'duration' ? Number(value) : value }));
  };

  const handleServiceInfoChange = (name: string, value: string) => {
    setServiceInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Prepare service info with file references
      const serviceInfoWithFiles = {
        ...serviceInfo,
        serviceImage,
        descriptionImage,
        techImage,
        mechanismImage
      };
      
      await onSubmit(service, serviceInfoWithFiles);
      toast.success('Dịch vụ đã được lưu thành công!');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Có lỗi xảy ra khi lưu dịch vụ');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Thông tin cơ bản</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên dịch vụ</label>
            <input
              type="text"
              name="name"
              value={service.name || ''}
              onChange={handleServiceChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
            <select
              name="categoryId"
              value={service.categoryId || ''}
              onChange={handleServiceChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
              required
            >
              <option value="">Chọn danh mục</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ)</label>
            <input
              type="number"
              name="price"
              value={service.price || ''}
              onChange={handleServiceChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
              required
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian (phút)</label>
            <input
              type="number"
              name="duration"
              value={service.duration || ''}
              onChange={handleServiceChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
              required
              min="1"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề phụ</label>
            <input
              type="text"
              name="subTitle"
              value={service.subTitle || ''}
              onChange={handleServiceChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh dịch vụ</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, setServiceImage)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
            />
            {(serviceInfo.serviceImgUrl || initialServiceInfo.serviceImgUrl) && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Hình ảnh hiện tại:</p>
                <img 
                  src={serviceInfo.serviceImgUrl || initialServiceInfo.serviceImgUrl} 
                  alt="Service" 
                  className="h-20 w-auto mt-1 rounded-md"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Thông tin chi tiết</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
            <div className="border border-gray-300 rounded-md">
              <TextEditor
                value={serviceInfo.description || ''}
                onChange={(value) => handleServiceInfoChange('description', value)}
                placeholder="Nhập mô tả chi tiết về dịch vụ..."
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh mô tả</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setDescriptionImage)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
              />
              {(serviceInfo.desImgUrl || initialServiceInfo.desImgUrl) && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Hình ảnh hiện tại:</p>
                  <img 
                    src={serviceInfo.desImgUrl || initialServiceInfo.desImgUrl} 
                    alt="Description" 
                    className="h-20 w-auto mt-1 rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Công nghệ</label>
            <div className="border border-gray-300 rounded-md">
              <TextEditor
                value={serviceInfo.tech || ''}
                onChange={(value) => handleServiceInfoChange('tech', value)}
                placeholder="Nhập thông tin về công nghệ sử dụng..."
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh công nghệ</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setTechImage)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
              />
              {(serviceInfo.techImgUrl || initialServiceInfo.techImgUrl) && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Hình ảnh hiện tại:</p>
                  <img 
                    src={serviceInfo.techImgUrl || initialServiceInfo.techImgUrl} 
                    alt="Technology" 
                    className="h-20 w-auto mt-1 rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cơ chế</label>
            <div className="border border-gray-300 rounded-md">
              <TextEditor
                value={serviceInfo.mechanism || ''}
                onChange={(value) => handleServiceInfoChange('mechanism', value)}
                placeholder="Nhập thông tin về cơ chế hoạt động..."
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh cơ chế</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, setMechanismImage)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
              />
              {(serviceInfo.mechaImgUrl || initialServiceInfo.mechaImgUrl) && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Hình ảnh hiện tại:</p>
                  <img 
                    src={serviceInfo.mechaImgUrl || initialServiceInfo.mechaImgUrl} 
                    alt="Mechanism" 
                    className="h-20 w-auto mt-1 rounded-md"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-md shadow-md hover:from-pink-600 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Đang lưu...' : 'Lưu dịch vụ'}
        </button>
      </div>
    </form>
  );
};

export default ServiceForm; 