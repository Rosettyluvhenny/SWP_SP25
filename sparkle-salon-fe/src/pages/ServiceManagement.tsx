import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBarDashboard";
import { motion } from "framer-motion";
import { FaEdit, FaSearch, FaPlus, FaTrash } from "react-icons/fa";
import { serviceCategoryApi, servicesApi, serviceInfoApi } from "../api";
import { ServiceCategory, Service, ServiceInfo } from "../api/types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ServiceForm from '../components/ServiceForm';
import EncodedText from '../components/EncodedText';

const ServiceManagement: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedService, setSelectedService] = useState<Partial<Service & { categoryId?: number, subTitle?: string }> | null>(null);
    const [selectedServiceInfo, setSelectedServiceInfo] = useState<Partial<ServiceInfo> | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchServices();
        fetchCategories();
    }, []);

    const fetchServices = async () => {
        try {
            setIsLoading(true);
            const data = await servicesApi.getAll();
            // Convert API services to the format expected by the component
            const adaptedServices = data.map(service => ({
                ...service,
                category: service.serviceCategory?.name || 'Không có danh mục'
            }));
            setServices(adaptedServices as any);
        } catch (error) {
            console.error("Error fetching services:", error);
            toast.error("Không thể tải danh sách dịch vụ");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await serviceCategoryApi.getAll();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Không thể tải danh mục dịch vụ");
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
            
            setSelectedService(serviceForForm as any);
            
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
                subTitle: serviceData.subTitle || '',
                session: 1, // Default value
                active: true // Default value
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
                try {
                    if (serviceInfoData.id) {
                        await serviceInfoApi.update(serviceInfoData.id, formData as any);
                    } else {
                        await serviceInfoApi.create(formData as any);
                    }
                } catch (error) {
                    console.error('Error saving service info:', error);
                    toast.warning('Dịch vụ đã được lưu nhưng thông tin chi tiết không thể lưu');
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

    const handleActivateDeactivate = async (id: number, currentStatus: boolean) => {
        try {
            if (currentStatus) {
                await servicesApi.deactivate(id);
                toast.success("Đã vô hiệu hóa dịch vụ");
            } else {
                await servicesApi.activate(id);
                toast.success("Đã kích hoạt dịch vụ");
            }
            fetchServices();
        } catch (error) {
            console.error("Error updating service status:", error);
            toast.error("Lỗi khi cập nhật trạng thái dịch vụ");
        }
    };

    const handleDeleteService = async (serviceId: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
            try {
                setIsLoading(true);
                // Since delete is not available, we'll deactivate instead
                await servicesApi.deactivate(serviceId);
                toast.success('Dịch vụ đã bị vô hiệu hóa');
                fetchServices();
            } catch (error) {
                console.error('Error deactivating service:', error);
                toast.error('Có lỗi xảy ra khi xóa dịch vụ');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const filteredServices = services.filter(
        (service) =>
            service.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) &&
            (selectedCategory === null || service.serviceCategory?.id === selectedCategory)
    );

    return (
        <div className="flex h-screen bg-white">
            <Sidebar />
            <main className="flex-1 p-6 overflow-auto">
                <ToastContainer />
                
                <motion.div 
                    className="mb-6 flex justify-between items-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-2xl font-bold text-gray-800">
                        Quản Lý Dịch Vụ
                    </h1>
                    {!isEditing && (
                        <motion.button
                            onClick={handleCreateNewService}
                            className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600 flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaPlus /> Thêm Dịch Vụ
                        </motion.button>
                    )}
                </motion.div>

                {/* Search & Filter Section */}
                {!isEditing && (
                    <motion.div 
                        className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-pink-100 p-4 rounded-lg shadow"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <div className="w-full md:w-1/2 relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm dịch vụ..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                            />
                        </div>
                        <select
                            value={selectedCategory === null ? "" : String(selectedCategory)}
                            onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                            className="w-full md:w-auto p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                        >
                            <option value="">Tất Cả Danh Mục</option>
                            {categories.map((category) => (
                                <option key={category.id} value={String(category.id)}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </motion.div>
                )}

                {/* Service Form or Table */}
                {isEditing ? (
                    <motion.div 
                        className="bg-white rounded-lg shadow-md p-6 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
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
                    </motion.div>
                ) : (
                    <motion.div 
                        className="bg-white rounded-lg shadow-md overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Dịch Vụ</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh Mục</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá (VNĐ)</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời Gian</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao Tác</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-4 text-center">
                                                <div className="flex justify-center">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredServices.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                                {searchTerm || selectedCategory ? "Không tìm thấy dịch vụ nào" : "Chưa có dịch vụ nào"}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredServices.map((service) => (
                                            <motion.tr 
                                                key={service.id} 
                                                className="hover:bg-gray-50"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                            >
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
                                                        <EncodedText text={service.category || service.serviceCategory?.name || 'Không có danh mục'} />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {service.price.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {service.duration}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span 
                                                        className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${
                                                            service.active
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-yellow-100 text-yellow-800"
                                                        }`}
                                                        onClick={() => handleActivateDeactivate(service.id, service.active)}
                                                    >
                                                        {service.active ? "Hoạt Động" : "Không Hoạt Động"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => handleEditService(service.id)}
                                                        className="text-pink-600 hover:text-pink-900 mr-4"
                                                    >
                                                        <FaEdit className="inline mr-1" /> Sửa
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteService(service.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <FaTrash className="inline mr-1" /> Xóa
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default ServiceManagement;
