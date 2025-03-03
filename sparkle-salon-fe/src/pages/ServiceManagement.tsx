import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "../components/SideBarDashboard";
import ManagementModal from "../components/ManagementModal";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaSearch, FaPlus } from "react-icons/fa";
import { deleteServiceById, servicesData } from "../data/servicesData";

type Service = {
    id: number;
    name: string;
    price: string;
    status: string;
    category: string;
};

export default function ServiceManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Tất Cả");
    const getServiceList =  useCallback(() => {
        const serviceListData: Service[] = servicesData.map((service) => ({
            id: service.id,
            name: service.name,
            price: service.price.toString(),
            status: service.active ? "Hoạt Động" : "Không Hoạt Động",
            category: service.categoryName,
        }));
        if (serviceListData.length > 0) {
            setServices(serviceListData);
        }
    }, []);
    const [services, setServices] = useState<Service[]>([]);
    useEffect(() => {
        getServiceList()
    }, [getServiceList]);

    const categories = ["Tất Cả", "Chăm Sóc Da", "Trị Liệu", "Dịch Vụ Khác"];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

    const openModal = (service: Service | null = null) => {
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

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm(
            "Bạn có chắc chắn muốn xóa dịch vụ này?"
        );
        if (confirmDelete) {
            const deletedService = await deleteServiceById(id.toString());
            if (deletedService) {
                alert("Xóa dịch vụ thành công");
                setServices(services.filter((service) => service.id !== id));
            } else {
                alert("Xóa dịch vụ thất bại");
            }
        }
    };

    const filteredServices = services.filter(
        (service) =>
            service.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) &&
            (selectedCategory === "Tất Cả" ||
                service.category === selectedCategory)
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
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full md:w-auto p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
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
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse rounded-lg overflow-hidden">
                            <thead>
                                <tr className="bg-white text-black">
                                    <th className="p-3 text-left">ID</th>
                                    <th className="p-3 text-left">Tên Dịch Vụ</th>
                                    <th className="p-3 text-left">Giá (VND)</th>
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
                                            <td className="p-3">{service.price}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    service.status === "Hoạt Động"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                }`}>
                                                    {service.status}
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs">
                                                    {service.category}
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
                                                <motion.button
                                                    onClick={() => handleDelete(service.id)}
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
                                        <td colSpan={6} className="p-4 text-center text-gray-500">
                                            Không tìm thấy dịch vụ nào
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </main>

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
        </div>
    );
}
