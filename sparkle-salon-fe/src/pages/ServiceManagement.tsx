import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBarDashboard";
import ManagementModal from "../components/ManagementModal";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaSearch, FaPlus } from "react-icons/fa";
import { getAllServices, getAllServiceCategories } from "../api/serviceApi";
import { Service } from "../types/service.types";
import { toast } from "react-toastify";

type ServiceTableItem = {
    id: number;
    name: string;
    price: string;
    status: string;
    category: string;
};

export default function ServiceManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Tất Cả");
    const [services, setServices] = useState<ServiceTableItem[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch services and categories from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                
                // Fetch services
                const servicesData = await getAllServices();
                const tableServices = servicesData.map((service: Service) => ({
                    id: service.id,
                    name: service.name,
                    price: service.price.toLocaleString(),
                    status: service.active ? "Hoạt Động" : "Không Hoạt Động",
                    category: service.serviceCategory?.name || "Chưa phân loại",
                }));
                setServices(tableServices);
                
                // Fetch categories
                const categoriesData = await getAllServiceCategories();
                const categoryNames = ["Tất Cả", ...categoriesData.map(cat => cat.name)];
                setCategories(categoryNames);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Không thể tải dữ liệu dịch vụ. Vui lòng thử lại sau.");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<ServiceTableItem | null>(null);
    const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

    const openModal = (service: ServiceTableItem | null = null) => {
        setEditingService(
            service ?? {
                id: services.length + 1,
                name: "",
                price: "",
                status: "Hoạt Động",
                category: "Chăm Sóc Da",
            }
        );
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
        } else if (!/^\d+(\.\d{3})*$/.test(editingService.price)) {
            errors.price = "Giá dịch vụ không hợp lệ";
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingService) return;
        
        if (!validateForm()) return;

        setServices((prev) =>
            prev.some((s) => s.id === editingService.id)
                ? prev.map((s) =>
                      s.id === editingService.id ? editingService : s
                  )
                : [...prev, editingService]
        );
        closeModal();
    };

    const handleDelete = (id: number) => {
        const confirmDelete = window.confirm(
            "Bạn có chắc chắn muốn xóa dịch vụ này?"
        );
        if (confirmDelete) {
            setServices(services.filter((service) => service.id !== id));
        }
    };

    // Filter services based on search term and selected category
    const filteredServices = services.filter((service) => {
        const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "Tất Cả" || service.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Add a loading message at the top of the component if data is loading
    if (isLoading) {
        return (
            <div className="flex h-screen bg-white">
                <Sidebar />
                <main className="flex-1 p-6 overflow-auto">
                    <div className="flex justify-center items-center h-full">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

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
                        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaPlus className="mr-2" /> Thêm Dịch Vụ
                    </motion.button>
                </motion.div>

                {/* Search and Filter Section */}
                <motion.div
                    className="mb-6 bg-white p-4 rounded-lg shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm dịch vụ..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 md:w-48"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </motion.div>

                {/* Services Table */}
                <motion.div
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    {isLoading ? (
                        <div className="p-6 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tên Dịch Vụ
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Giá
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng Thái
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Danh Mục
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao Tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredServices.length > 0 ? (
                                    filteredServices.map((service) => (
                                        <tr
                                            key={service.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {service.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {service.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {service.price} vnđ
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        service.status ===
                                                        "Hoạt Động"
                                                            ? "bg-green-100 text-green-800"
                                                            : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {service.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs">
                                                    {service.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <motion.button
                                                    onClick={() => openModal(service)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <FaEdit size={16} />
                                                </motion.button>
                                                <motion.button
                                                    onClick={() => handleDelete(service.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <FaTrash size={16} />
                                                </motion.button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                            Không tìm thấy dịch vụ nào
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
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
                        <form onSubmit={handleSave}>
                            <label className="block mb-2">
                                <span className="text-gray-700">Tên Dịch Vụ</span>
                                <input
                                    type="text"
                                    value={editingService.name}
                                    onChange={(e) =>
                                        setEditingService({
                                            ...editingService,
                                            name: e.target.value,
                                        })
                                    }
                                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 ${
                                        formErrors.name ? 'border-red-500' : ''
                                    }`}
                                />
                                {formErrors.name && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                                )}
                            </label>

                            <label className="block mb-2">
                                <span className="text-gray-700">Giá (VND)</span>
                                <input
                                    type="text"
                                    value={editingService.price}
                                    onChange={(e) =>
                                        setEditingService({
                                            ...editingService,
                                            price: e.target.value,
                                        })
                                    }
                                    className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 ${
                                        formErrors.price ? 'border-red-500' : ''
                                    }`}
                                    placeholder="150.000"
                                />
                                {formErrors.price && (
                                    <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>
                                )}
                            </label>

                            <label className="block mb-2">
                                <span className="text-gray-700">Trạng Thái</span>
                                <select
                                    value={editingService.status}
                                    onChange={(e) =>
                                        setEditingService({
                                            ...editingService,
                                            status: e.target.value,
                                        })
                                    }
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                                >
                                    <option value="Hoạt Động">Hoạt Động</option>
                                    <option value="Không Hoạt Động">
                                        Không Hoạt Động
                                    </option>
                                </select>
                            </label>

                            <label className="block mb-4">
                                <span className="text-gray-700">Danh Mục</span>
                                <select
                                    value={editingService.category}
                                    onChange={(e) =>
                                        setEditingService({
                                            ...editingService,
                                            category: e.target.value,
                                        })
                                    }
                                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                                >
                                    {categories
                                        .filter((cat) => cat !== "Tất Cả")
                                        .map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                </select>
                            </label>
                        </form>
                    </ManagementModal>
                )}
            </main>
        </div>
    );
}
