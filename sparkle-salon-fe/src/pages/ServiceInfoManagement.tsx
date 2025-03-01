import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/SideBarDashboard";
import ManagementModal from "../components/ManagementModal";
import { motion } from "framer-motion";
import { FaEdit, FaSearch, FaPlus, FaImage } from "react-icons/fa";
import { serviceInfoApi, servicesApi } from "../api";
import { Service, ServiceInfo, ServiceInfoRequest } from "../api/types";
import { toast } from "react-toastify";

type ServiceInfoFormData = {
    serviceId: number;
    description: string;
    tech: string;
    mechanism: string;
    serviceImg?: File;
    desImg?: File;
    techImg?: File;
    mechaImg?: File;
};

export default function ServiceInfoManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [services, setServices] = useState<Service[]>([]);
    const [serviceInfos, setServiceInfos] = useState<ServiceInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingServiceInfo, setEditingServiceInfo] = useState<ServiceInfoFormData | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
    
    // File input refs
    const serviceImgRef = useRef<HTMLInputElement>(null);
    const desImgRef = useRef<HTMLInputElement>(null);
    const techImgRef = useRef<HTMLInputElement>(null);
    const mechaImgRef = useRef<HTMLInputElement>(null);

    // Fetch services on component mount
    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setIsLoading(true);
            const data = await servicesApi.getAll();
            setServices(data);
            
            // Extract service infos from services that have them
            const infos: ServiceInfo[] = [];
            data.forEach(service => {
                if (service.serviceInfo) {
                    infos.push(service.serviceInfo);
                }
            });
            setServiceInfos(infos);
        } catch (error) {
            console.error("Error fetching services:", error);
            toast.error("Failed to load services");
        } finally {
            setIsLoading(false);
        }
    };

    const openModal = (serviceInfo: ServiceInfo | null = null, service?: Service) => {
        if (serviceInfo) {
            // Edit existing service info
            setEditingServiceInfo({
                serviceId: serviceInfo.service.id,
                description: serviceInfo.description,
                tech: serviceInfo.tech,
                mechanism: serviceInfo.mechanism
            });
            setEditingId(serviceInfo.id);
        } else if (service) {
            // Create new service info for a specific service
            setEditingServiceInfo({
                serviceId: service.id,
                description: "",
                tech: "",
                mechanism: ""
            });
            setEditingId(null);
        } else {
            // Create new service info, select first service by default
            setEditingServiceInfo({
                serviceId: services.length > 0 ? services[0].id : 0,
                description: "",
                tech: "",
                mechanism: ""
            });
            setEditingId(null);
        }
        setFormErrors({});
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingServiceInfo(null);
        setEditingId(null);
    };

    const validateForm = () => {
        const errors: {[key: string]: string} = {};
        
        if (!editingServiceInfo?.description.trim()) {
            errors.description = "Mô tả không được để trống";
        }
        
        if (!editingServiceInfo?.tech.trim()) {
            errors.tech = "Công nghệ không được để trống";
        }

        if (!editingServiceInfo?.mechanism.trim()) {
            errors.mechanism = "Cơ chế không được để trống";
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof ServiceInfoFormData) => {
        if (e.target.files && e.target.files[0] && editingServiceInfo) {
            setEditingServiceInfo({
                ...editingServiceInfo,
                [field]: e.target.files[0]
            });
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingServiceInfo) return;
        
        if (!validateForm()) return;

        try {
            const serviceInfoData: ServiceInfoRequest = {
                serviceId: editingServiceInfo.serviceId,
                description: editingServiceInfo.description,
                tech: editingServiceInfo.tech,
                mechanism: editingServiceInfo.mechanism
            };

            const files = {
                serviceImg: editingServiceInfo.serviceImg,
                desImg: editingServiceInfo.desImg,
                techImg: editingServiceInfo.techImg,
                mechaImg: editingServiceInfo.mechaImg
            };

            if (editingId) {
                // Update existing service info
                await serviceInfoApi.update(editingId, serviceInfoData, files);
                toast.success("Cập nhật thông tin dịch vụ thành công");
            } else {
                // Create new service info
                await serviceInfoApi.create(serviceInfoData, files);
                toast.success("Thêm thông tin dịch vụ thành công");
            }
            
            // Refresh the services list
            fetchServices();
            closeModal();
        } catch (error) {
            console.error("Error saving service info:", error);
            toast.error("Lỗi khi lưu thông tin dịch vụ");
        }
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm(
            "Bạn có chắc chắn muốn xóa thông tin dịch vụ này?"
        );
        
        if (confirmDelete) {
            try {
                await serviceInfoApi.delete(id);
                toast.success("Xóa thông tin dịch vụ thành công");
                fetchServices();
            } catch (error) {
                console.error("Error deleting service info:", error);
                toast.error("Lỗi khi xóa thông tin dịch vụ");
            }
        }
    };

    // Filter services that don't have service info yet
    const servicesWithoutInfo = services.filter(
        service => !service.serviceInfo
    );

    // Filter service infos based on search term
    const filteredServiceInfos = serviceInfos.filter(
        (info) => 
            info.service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            info.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-white">
            <Sidebar />
            <main className="flex-1 p-6 overflow-auto">
                <motion.div 
                    className="mb-6 flex justify-between items-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-2xl font-bold text-gray-800">
                        Quản Lý Thông Tin Dịch Vụ
                    </h1>
                    <div className="flex gap-2">
                        {servicesWithoutInfo.length > 0 && (
                            <motion.button
                                onClick={() => openModal(null)}
                                className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600 flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaPlus /> Thêm Thông Tin Dịch Vụ
                            </motion.button>
                        )}
                    </div>
                </motion.div>

                {/* Search Section */}
                <motion.div 
                    className="mb-6 flex justify-between items-center gap-4 bg-pink-100 p-4 rounded-lg shadow"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <div className="w-full relative">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm thông tin dịch vụ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                    </div>
                </motion.div>

                {/* Services Without Info Section */}
                {servicesWithoutInfo.length > 0 && (
                    <motion.div 
                        className="mb-6 bg-yellow-100 shadow-lg rounded-lg p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <h2 className="text-xl font-semibold mb-4">
                            Dịch Vụ Chưa Có Thông Tin Chi Tiết
                        </h2>
                        
                        {isLoading ? (
                            <div className="text-center py-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
                                <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {servicesWithoutInfo.map((service) => (
                                    <motion.div 
                                        key={service.id}
                                        className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <h3 className="font-medium text-lg mb-2">{service.name}</h3>
                                        <p className="text-gray-600 mb-2">Giá: {service.price.toLocaleString()} VND</p>
                                        <p className="text-gray-600 mb-4">Danh mục: {service.serviceCategory.name}</p>
                                        <button
                                            onClick={() => openModal(null, service)}
                                            className="w-full bg-yellow-500 text-white px-3 py-2 rounded-lg hover:bg-yellow-600 flex items-center justify-center gap-1"
                                        >
                                            <FaPlus size={14} /> Thêm Thông Tin
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Service Infos Table */}
                <motion.div 
                    className="bg-pink-100 shadow-lg rounded-lg p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <h2 className="text-xl font-semibold mb-4">
                        Danh Sách Thông Tin Dịch Vụ
                    </h2>
                    
                    {isLoading ? (
                        <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse rounded-lg overflow-hidden">
                                <thead>
                                    <tr className="bg-white text-black">
                                        <th className="p-3 text-left">ID</th>
                                        <th className="p-3 text-left">Dịch Vụ</th>
                                        <th className="p-3 text-left">Mô Tả</th>
                                        <th className="p-3 text-left">Hình Ảnh</th>
                                        <th className="p-3 text-left">Hành Động</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {filteredServiceInfos.length > 0 ? (
                                        filteredServiceInfos.map((info) => (
                                            <motion.tr 
                                                key={info.id} 
                                                className="border-t hover:bg-pink-50 transition-colors"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <td className="p-3">{info.id}</td>
                                                <td className="p-3 font-medium">{info.service.name}</td>
                                                <td className="p-3">
                                                    <div className="max-w-xs overflow-hidden text-ellipsis">
                                                        {info.description.substring(0, 100)}
                                                        {info.description.length > 100 ? '...' : ''}
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    {info.serviceImgUrl && (
                                                        <img 
                                                            src={info.serviceImgUrl} 
                                                            alt={info.service.name}
                                                            className="w-16 h-16 object-cover rounded"
                                                        />
                                                    )}
                                                </td>
                                                <td className="p-3 flex space-x-2">
                                                    <motion.button
                                                        onClick={() => openModal(info)}
                                                        className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 flex items-center gap-1"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <FaEdit size={14} /> Sửa
                                                    </motion.button>
                                                    <motion.button
                                                        onClick={() => handleDelete(info.id)}
                                                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 flex items-center gap-1"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <FaEdit size={14} /> Xóa
                                                    </motion.button>
                                                </td>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="p-4 text-center text-gray-500">
                                                {searchTerm ? "Không tìm thấy thông tin dịch vụ nào" : "Chưa có thông tin dịch vụ nào"}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>

                {/* Modal for Adding/Editing Service Info */}
                {isModalOpen && editingServiceInfo && (
                    <ManagementModal
                        isOpen={isModalOpen}
                        onClose={closeModal}
                        onSubmit={handleSave}
                        title={editingId ? "Chỉnh Sửa Thông Tin Dịch Vụ" : "Thêm Thông Tin Dịch Vụ"}
                    >
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Dịch Vụ</label>
                            <select
                                value={editingServiceInfo.serviceId}
                                onChange={(e) =>
                                    setEditingServiceInfo({
                                        ...editingServiceInfo,
                                        serviceId: Number(e.target.value),
                                    })
                                }
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                disabled={!!editingId} // Disable if editing existing service info
                            >
                                {services.map((service) => (
                                    <option key={service.id} value={service.id}>
                                        {service.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Mô Tả</label>
                            <textarea
                                value={editingServiceInfo.description}
                                onChange={(e) =>
                                    setEditingServiceInfo({
                                        ...editingServiceInfo,
                                        description: e.target.value,
                                    })
                                }
                                rows={4}
                                className={`w-full p-2 border rounded-lg ${
                                    formErrors.description ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {formErrors.description && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Công Nghệ</label>
                            <textarea
                                value={editingServiceInfo.tech}
                                onChange={(e) =>
                                    setEditingServiceInfo({
                                        ...editingServiceInfo,
                                        tech: e.target.value,
                                    })
                                }
                                rows={3}
                                className={`w-full p-2 border rounded-lg ${
                                    formErrors.tech ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {formErrors.tech && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.tech}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Cơ Chế</label>
                            <textarea
                                value={editingServiceInfo.mechanism}
                                onChange={(e) =>
                                    setEditingServiceInfo({
                                        ...editingServiceInfo,
                                        mechanism: e.target.value,
                                    })
                                }
                                rows={3}
                                className={`w-full p-2 border rounded-lg ${
                                    formErrors.mechanism ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {formErrors.mechanism && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.mechanism}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Hình Ảnh Dịch Vụ</label>
                            <div className="flex items-center">
                                <input
                                    type="file"
                                    ref={serviceImgRef}
                                    onChange={(e) => handleFileChange(e, 'serviceImg')}
                                    className="hidden"
                                    accept="image/*"
                                />
                                <button
                                    type="button"
                                    onClick={() => serviceImgRef.current?.click()}
                                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg flex items-center gap-2"
                                >
                                    <FaImage /> Chọn Ảnh
                                </button>
                                <span className="ml-3 text-sm text-gray-600">
                                    {editingServiceInfo.serviceImg?.name || "Chưa chọn ảnh"}
                                </span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Hình Ảnh Mô Tả</label>
                            <div className="flex items-center">
                                <input
                                    type="file"
                                    ref={desImgRef}
                                    onChange={(e) => handleFileChange(e, 'desImg')}
                                    className="hidden"
                                    accept="image/*"
                                />
                                <button
                                    type="button"
                                    onClick={() => desImgRef.current?.click()}
                                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg flex items-center gap-2"
                                >
                                    <FaImage /> Chọn Ảnh
                                </button>
                                <span className="ml-3 text-sm text-gray-600">
                                    {editingServiceInfo.desImg?.name || "Chưa chọn ảnh"}
                                </span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Hình Ảnh Công Nghệ</label>
                            <div className="flex items-center">
                                <input
                                    type="file"
                                    ref={techImgRef}
                                    onChange={(e) => handleFileChange(e, 'techImg')}
                                    className="hidden"
                                    accept="image/*"
                                />
                                <button
                                    type="button"
                                    onClick={() => techImgRef.current?.click()}
                                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg flex items-center gap-2"
                                >
                                    <FaImage /> Chọn Ảnh
                                </button>
                                <span className="ml-3 text-sm text-gray-600">
                                    {editingServiceInfo.techImg?.name || "Chưa chọn ảnh"}
                                </span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Hình Ảnh Cơ Chế</label>
                            <div className="flex items-center">
                                <input
                                    type="file"
                                    ref={mechaImgRef}
                                    onChange={(e) => handleFileChange(e, 'mechaImg')}
                                    className="hidden"
                                    accept="image/*"
                                />
                                <button
                                    type="button"
                                    onClick={() => mechaImgRef.current?.click()}
                                    className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg flex items-center gap-2"
                                >
                                    <FaImage /> Chọn Ảnh
                                </button>
                                <span className="ml-3 text-sm text-gray-600">
                                    {editingServiceInfo.mechaImg?.name || "Chưa chọn ảnh"}
                                </span>
                            </div>
                        </div>
                    </ManagementModal>
                )}
            </main>
        </div>
    );
} 