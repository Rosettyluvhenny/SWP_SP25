import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBarDashboard";
import ManagementModal from "../components/ManagementModal";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaSearch, FaPlus } from "react-icons/fa";
import { serviceCategoryApi } from "../api";
import { ServiceCategory, ServiceCategoryRequest } from "../api/types";
import { toast } from "react-toastify";

export default function ServiceCategoryManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<ServiceCategoryRequest | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

    // Fetch all categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const data = await serviceCategoryApi.getAll();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Failed to load service categories");
        } finally {
            setIsLoading(false);
        }
    };

    const openModal = (category: ServiceCategory | null = null) => {
        if (category) {
            setEditingCategory({ name: category.name });
            setEditingId(category.id);
        } else {
            setEditingCategory({ name: "" });
            setEditingId(null);
        }
        setFormErrors({});
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        setEditingId(null);
    };

    const validateForm = () => {
        const errors: {[key: string]: string} = {};
        
        if (!editingCategory?.name.trim()) {
            errors.name = "Tên danh mục không được để trống";
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory) return;
        
        if (!validateForm()) return;

        try {
            if (editingId) {
                // Update existing category
                await serviceCategoryApi.update(editingId, editingCategory);
                toast.success("Cập nhật danh mục thành công");
            } else {
                // Create new category
                await serviceCategoryApi.create(editingCategory);
                toast.success("Thêm danh mục thành công");
            }
            
            // Refresh the categories list
            fetchCategories();
            closeModal();
        } catch (error) {
            console.error("Error saving category:", error);
            toast.error("Lỗi khi lưu danh mục dịch vụ");
        }
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm(
            "Bạn có chắc chắn muốn xóa danh mục dịch vụ này?"
        );
        
        if (confirmDelete) {
            try {
                await serviceCategoryApi.delete(id);
                toast.success("Xóa danh mục thành công");
                fetchCategories();
            } catch (error) {
                console.error("Error deleting category:", error);
                toast.error("Lỗi khi xóa danh mục dịch vụ");
            }
        }
    };

    const filteredCategories = categories.filter(
        (category) => category.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                        Quản Lý Danh Mục Dịch Vụ
                    </h1>
                    <motion.button
                        onClick={() => openModal(null)}
                        className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600 flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaPlus /> Thêm Danh Mục
                    </motion.button>
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
                            placeholder="Tìm kiếm danh mục..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                        />
                    </div>
                </motion.div>

                {/* Categories Table */}
                <motion.div 
                    className="bg-pink-100 shadow-lg rounded-lg p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <h2 className="text-xl font-semibold mb-4">
                        Danh Sách Danh Mục
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
                                        <th className="p-3 text-left">Tên Danh Mục</th>
                                        <th className="p-3 text-left">Ngày Tạo</th>
                                        <th className="p-3 text-left">Hành Động</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {filteredCategories.length > 0 ? (
                                        filteredCategories.map((category) => (
                                            <motion.tr 
                                                key={category.id} 
                                                className="border-t hover:bg-pink-50 transition-colors"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <td className="p-3">{category.id}</td>
                                                <td className="p-3 font-medium">{category.name}</td>
                                                <td className="p-3">
                                                    {new Date(category.createdAt).toLocaleDateString('vi-VN')}
                                                </td>
                                                <td className="p-3 flex space-x-2">
                                                    <motion.button
                                                        onClick={() => openModal(category)}
                                                        className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 flex items-center gap-1"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <FaEdit size={14} /> Sửa
                                                    </motion.button>
                                                    <motion.button
                                                        onClick={() => handleDelete(category.id)}
                                                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 flex items-center gap-1"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <FaTrash size={14} /> Xóa
                                                    </motion.button>
                                                </td>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="p-4 text-center text-gray-500">
                                                {searchTerm ? "Không tìm thấy danh mục nào" : "Chưa có danh mục nào"}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>

                {/* Modal for Adding/Editing Categories */}
                {isModalOpen && editingCategory && (
                    <ManagementModal
                        isOpen={isModalOpen}
                        onClose={closeModal}
                        onSubmit={handleSave}
                        title={editingId ? "Chỉnh Sửa Danh Mục" : "Thêm Danh Mục"}
                    >
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Tên Danh Mục</label>
                            <input
                                type="text"
                                value={editingCategory.name}
                                onChange={(e) =>
                                    setEditingCategory({
                                        ...editingCategory,
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
                    </ManagementModal>
                )}
            </main>
        </div>
    );
} 