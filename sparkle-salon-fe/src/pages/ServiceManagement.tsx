import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBarDashboard";
import ManagementModal from "../components/ManagementModal";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaSearch, FaPlus, FaSync } from "react-icons/fa";
import { 
    createService, 
    updateService, 
    deleteService,
    getServicesPaginated,
    getAllServiceCategories
} from "../api/serviceApi";
import { Service } from "../types/service.types";
import { toast } from "react-toastify";

type ServiceTableItem = {
    id: number;
    name: string;
    price: string;
    status: string;
    category: string;
    categoryId?: number;
};

export default function ServiceManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Tất Cả");
    const [services, setServices] = useState<ServiceTableItem[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [categoryMap, setCategoryMap] = useState<Map<string, number>>(new Map());
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itemsPerPage] = useState(10);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Fetch services and categories from API
    useEffect(() => {
        fetchData();
    }, [currentPage, searchTerm, selectedCategory]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            
            // Fetch categories first (we need them for filtering)
            const categoriesData = await getAllServiceCategories();
            const categoryNames = ["Tất Cả", ...categoriesData.map(cat => cat.name)];
            setCategories(categoryNames);
            
            // Create a map of category names to IDs for later use
            const catMap = new Map<string, number>();
            categoriesData.forEach(cat => {
                catMap.set(cat.name, cat.id);
            });
            setCategoryMap(catMap);
            
            // Prepare filters for pagination
            const filters: {
                categoryId?: number;
                search?: string;
                active?: boolean;
            } = {};
            
            if (searchTerm) {
                filters.search = searchTerm;
            }
            
            if (selectedCategory !== "Tất Cả") {
                const categoryId = catMap.get(selectedCategory);
                if (categoryId) {
                    filters.categoryId = categoryId;
                }
            }
            
            // Fetch services with pagination and filters
            const { services: servicesData, pages } = await getServicesPaginated(
                currentPage,
                itemsPerPage,
                filters
            );
            
            // Transform services for the table
            const tableServices = servicesData.map((service: Service) => ({
                id: service.id,
                name: service.name,
                price: service.price.toLocaleString(),
                status: service.active ? "Hoạt Động" : "Không Hoạt Động",
                category: service.serviceCategory?.name || "Chưa phân loại",
                categoryId: service.serviceCategory?.id
            }));
            
            setServices(tableServices);
            setTotalPages(pages);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Không thể tải dữ liệu dịch vụ. Vui lòng thử lại sau.");
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchData();
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<ServiceTableItem | null>(null);
    const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

    const openModal = (service: ServiceTableItem | null = null) => {
        setEditingService(
            service ?? {
                id: 0, // Will be assigned by the server
                name: "",
                price: "",
                status: "Hoạt Động",
                category: categories.length > 1 ? categories[1] : "Chưa phân loại",
                categoryId: categories.length > 1 ? categoryMap.get(categories[1]) : undefined
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
        } else if (!/^\d+(\.\d{3})*$/.test(editingService.price.replace(/\s/g, ''))) {
            errors.price = "Giá dịch vụ không hợp lệ";
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingService) return;
        
        if (!validateForm()) return;

        try {
            setIsLoading(true);
            
            // Convert price string to number
            const priceValue = parseInt(editingService.price.replace(/\D/g, ''));
            
            // Prepare service data for API
            const serviceData = {
                name: editingService.name,
                price: priceValue,
                active: editingService.status === "Hoạt Động",
                serviceCategoryId: editingService.categoryId || categoryMap.get(editingService.category)
            };
            
            if (editingService.id === 0) {
                // Create new service
                await createService(serviceData as Partial<Service>);
                toast.success("Dịch vụ đã được tạo thành công!");
            } else {
                // Update existing service
                await updateService(editingService.id, serviceData as Partial<Service>);
                toast.success("Dịch vụ đã được cập nhật thành công!");
            }
            
            // Refresh the service list
            fetchData();
            closeModal();
        } catch (error) {
            console.error("Error saving service:", error);
            toast.error("Không thể lưu dịch vụ. Vui lòng thử lại sau.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm(
            "Bạn có chắc chắn muốn xóa dịch vụ này?"
        );
        
        if (confirmDelete) {
            try {
                setIsLoading(true);
                await deleteService(id);
                toast.success("Dịch vụ đã được xóa thành công!");
                
                // Refresh the service list
                fetchData();
            } catch (error) {
                console.error("Error deleting service:", error);
                toast.error("Không thể xóa dịch vụ. Vui lòng thử lại sau.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(e.target.value);
        setCurrentPage(1); // Reset to first page when changing category
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Add a loading message at the top of the component if data is loading
    if (isLoading && services.length === 0) {
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
                    <div className="flex gap-2">
                        <motion.button
                            onClick={handleRefresh}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={isRefreshing}
                        >
                            <FaSync className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} /> Làm Mới
                        </motion.button>
                        <motion.button
                            onClick={() => openModal(null)}
                            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaPlus className="mr-2" /> Thêm Dịch Vụ
                        </motion.button>
                    </div>
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
                                onChange={handleSearch}
                            />
                        </div>
                        <select
                            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 md:w-48"
                            value={selectedCategory}
                            onChange={handleCategoryChange}
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
                        <>
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
                                    {services.length > 0 ? (
                                        services.map((service) => (
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
                            
                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="px-6 py-4 flex justify-center">
                                    <nav className="flex items-center">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className={`px-3 py-1 rounded-md mr-2 ${
                                                currentPage === 1
                                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                            }`}
                                        >
                                            Trước
                                        </button>
                                        
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`px-3 py-1 rounded-md mx-1 ${
                                                    currentPage === page
                                                        ? "bg-pink-500 text-white"
                                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className={`px-3 py-1 rounded-md ml-2 ${
                                                currentPage === totalPages
                                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                            }`}
                                        >
                                            Tiếp
                                        </button>
                                    </nav>
                                </div>
                            )}
                        </>
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
                                    onChange={(e) => {
                                        const selectedCategory = e.target.value;
                                        setEditingService({
                                            ...editingService,
                                            category: selectedCategory,
                                            categoryId: categoryMap.get(selectedCategory)
                                        });
                                    }}
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
