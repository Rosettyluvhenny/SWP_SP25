import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBarDashboard";
import ManagementModal from "../components/ManagementModal";
import { motion } from "framer-motion";
import { FaEdit, FaSearch, FaPlus } from "react-icons/fa";
import { serviceCategoryApi, servicesApi } from "../api";
import { ServiceCategory, ServicesRequest, Service } from "../api/types";
import { toast } from "react-toastify";

type ServiceFormData = {
    id?: number;
    name: string;
    price: string;
    duration: string;
    session: string;
    active: boolean;
    serviceCategoryId: number;
};

export default function ServiceManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<ServiceFormData | null>(null);
    const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

    // Fetch services and categories on component mount
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
            console.error("Error fetching services:", error);
            toast.error("Failed to load services");
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
            toast.error("Failed to load service categories");
        }
    };

    const openModal = (service: Service | null = null) => {
        if (service) {
            setEditingService({
                id: service.id,
                name: service.name,
                price: service.price.toString(),
                duration: service.duration.toString(),
                session: service.session.toString(),
                active: service.active,
                serviceCategoryId: service.serviceCategory.id
            });
        } else {
            setEditingService({
                name: "",
                price: "",
                duration: "60",
                session: "1",
                active: true,
                serviceCategoryId: categories.length > 0 ? categories[0].id : 0
            });
        }
        setFormErrors({});
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingService(null);
    };

    const validateForm = () => {
        const errors: {[key: string]: string} = {};
        
        if (!editingService?.name.trim()) {
            errors.name = "Tên dịch vụ không được để trống";
        }
        
        if (!editingService?.price.trim()) {
            errors.price = "Giá dịch vụ không được để trống";
        } else if (!/^\d+(\.\d{1,3})?$/.test(editingService.price)) {
            errors.price = "Giá dịch vụ không hợp lệ";
        }

        if (!editingService?.duration.trim()) {
            errors.duration = "Thời gian dịch vụ không được để trống";
        } else if (!/^\d+$/.test(editingService.duration) || parseInt(editingService.duration) < 1) {
            errors.duration = "Thời gian dịch vụ phải là số nguyên dương";
        }

        if (!editingService?.session.trim()) {
            errors.session = "Số buổi dịch vụ không được để trống";
        } else if (!/^\d+$/.test(editingService.session) || parseInt(editingService.session) < 1) {
            errors.session = "Số buổi dịch vụ phải là số nguyên dương";
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingService) return;
        
        if (!validateForm()) return;

        try {
            const serviceData: ServicesRequest = {
                name: editingService.name,
                price: parseFloat(editingService.price),
                duration: parseInt(editingService.duration),
                session: parseInt(editingService.session),
                active: editingService.active,
                serviceCategoryId: editingService.serviceCategoryId
            };

            if (editingService.id) {
                // Update existing service
                await servicesApi.update(editingService.id, serviceData);
                toast.success("Cập nhật dịch vụ thành công");
            } else {
                await servicesApi.create(serviceData);
                toast.success("Thêm dịch vụ thành công");
            }
            
            fetchServices();
            closeModal();
        } catch (error) {
            console.error("Error saving service:", error);
            toast.error("Lỗi khi lưu dịch vụ");
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

    const filteredServices = services.filter(
        (service) =>
            service.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) &&
            (selectedCategory === null || service.serviceCategory.id === selectedCategory)
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
                        Quản Lý Dịch Vụ
                    </h1>
                    <motion.button
                        onClick={() => openModal(null)}
                        className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600 flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaPlus /> Thêm Dịch Vụ
                    </motion.button>
                </motion.div>

                {/* Search & Filter Section */}
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

                {/* Services Table */}
                <motion.div 
                    className="bg-pink-100 shadow-lg rounded-lg p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <h2 className="text-xl font-semibold mb-4">
                        Danh Sách Dịch Vụ
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
                                        <th className="p-3 text-left">Tên Dịch Vụ</th>
                                        <th className="p-3 text-left">Giá (VND)</th>
                                        <th className="p-3 text-left">Thời Gian (phút)</th>
                                        <th className="p-3 text-left">Số Buổi</th>
                                        <th className="p-3 text-left">Trạng Thái</th>
                                        <th className="p-3 text-left">Danh Mục</th>
                                        <th className="p-3 text-left">Hành Động</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {filteredServices.length > 0 ? (
                                        filteredServices.map((service) => (
                                            <motion.tr 
                                                key={service.id} 
                                                className="border-t hover:bg-pink-50 transition-colors"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <td className="p-3">{service.id}</td>
                                                <td className="p-3 font-medium">{service.name}</td>
                                                <td className="p-3">{service.price.toLocaleString()}</td>
                                                <td className="p-3">{service.duration}</td>
                                                <td className="p-3">{service.session}</td>
                                                <td className="p-3">
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
                                                <td className="p-3">
                                                    <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs">
                                                        {service.serviceCategory.name}
                                                    </span>
                                                </td>
                                                <td className="p-3 flex space-x-2">
                                                    <motion.button
                                                        onClick={() => openModal(service)}
                                                        className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 flex items-center gap-1"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <FaEdit size={14} /> Sửa
                                                    </motion.button>
                                                </td>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="p-4 text-center text-gray-500">
                                                {searchTerm || selectedCategory ? "Không tìm thấy dịch vụ nào" : "Chưa có dịch vụ nào"}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>

                {/* Modal for Adding/Editing Services */}
                {isModalOpen && editingService && (
                    <ManagementModal
                        isOpen={isModalOpen}
                        onClose={closeModal}
                        onSubmit={handleSave}
                        title={editingService.id ? "Chỉnh Sửa Dịch Vụ" : "Thêm Dịch Vụ"}
                    >
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Tên Dịch Vụ</label>
                            <input
                                type="text"
                                value={editingService.name}
                                onChange={(e) =>
                                    setEditingService({
                                        ...editingService,
                                        name: e.target.value,
                                    })
                                }
                                className={`w-full p-2 border rounded-lg ${
                                    formErrors.name ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {formErrors.name && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Giá Dịch Vụ (VND)</label>
                            <input
                                type="text"
                                value={editingService.price}
                                onChange={(e) =>
                                    setEditingService({
                                        ...editingService,
                                        price: e.target.value,
                                    })
                                }
                                className={`w-full p-2 border rounded-lg ${
                                    formErrors.price ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {formErrors.price && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Thời Gian (phút)</label>
                            <input
                                type="number"
                                min="1"
                                value={editingService.duration}
                                onChange={(e) =>
                                    setEditingService({
                                        ...editingService,
                                        duration: e.target.value,
                                    })
                                }
                                className={`w-full p-2 border rounded-lg ${
                                    formErrors.duration ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {formErrors.duration && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.duration}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Số Buổi</label>
                            <input
                                type="number"
                                min="1"
                                value={editingService.session}
                                onChange={(e) =>
                                    setEditingService({
                                        ...editingService,
                                        session: e.target.value,
                                    })
                                }
                                className={`w-full p-2 border rounded-lg ${
                                    formErrors.session ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {formErrors.session && (
                                <p className="text-red-500 text-sm mt-1">{formErrors.session}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Trạng Thái</label>
                            <select
                                value={editingService.active ? "true" : "false"}
                                onChange={(e) =>
                                    setEditingService({
                                        ...editingService,
                                        active: e.target.value === "true",
                                    })
                                }
                                className="w-full p-2 border border-gray-300 rounded-lg"
                            >
                                <option value="true">Hoạt Động</option>
                                <option value="false">Không Hoạt Động</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Danh Mục</label>
                            <select
                                value={editingService.serviceCategoryId}
                                onChange={(e) =>
                                    setEditingService({
                                        ...editingService,
                                        serviceCategoryId: parseInt(e.target.value),
                                    })
                                }
                                className="w-full p-2 border border-gray-300 rounded-lg"
                            >
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </ManagementModal>
                )}
            </main>
        </div>
    );
}
