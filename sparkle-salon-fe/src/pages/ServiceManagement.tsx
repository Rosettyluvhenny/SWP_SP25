import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "../components/SideBarDashboard";
import ManagementModal from "../components/ManagementModal";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaSearch, FaPlus, FaUserPlus, FaCheck } from "react-icons/fa";
import {
    deleteServiceById,
    servicesData,
    assignTherapist,
    activateService,
    deactivateService,
} from "../data/servicesData";
import axios from "../services/customizedAxios";
// import QuillTest from "../components/QuillTest";
import ServiceInfoForm from "../components/ServiceForm";
import {
    Therapist,
    getAllTherapists,
    getTherapists,
} from "../data/therapistData";
import {toast} from "react-toastify";
import AssignModal from "../components/AssignModal";

type Service = {
    id: number;
    name: string;
    price: string;
    status: string;
    category: string;
    image: string;
    duration: string;
    session: string;
};

type ServiceCategory = {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    services: Service[];
    type: string;
};

export default function ServiceManagement() {
    // Tab state
    const [activeTab, setActiveTab] = useState<"services" | "categories">(
        "services"
    );

    const types = ["CLEANSING", "TREATMENT", "RESTORATION"];
    const [isOpenCreateService, setIsOpenServiceForm] = useState(false);

    // Assign therapist state
    const [therapists, setTherapists] = useState<Therapist[]>([]);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
        null
    );
    const [selectedTherapistIds, setSelectedTherapistIds] = useState<string[]>(
        []
    );
    const [currentServiceTherapists, setCurrentServiceTherapists] = useState<
        Therapist[]
    >([]);
    const [availableTherapists, setAvailableTherapists] = useState<Therapist[]>(
        []
    );

    // Services state
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Tất Cả");
    const [services, setServices] = useState<Service[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [type, setType] = useState("");
    // Categories state
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [categorySearchTerm, setCategorySearchTerm] = useState("");
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] =
        useState<ServiceCategory | null>(null);
    const [categoryFormErrors, setCategoryFormErrors] = useState<{
        [key: string]: string;
    }>({});
    const [categoryFormValue, setCategoryFormValue] = useState<string>("");
    const [categoryFormDescription, setCategoryFormDescription] =
        useState<string>("");
    const [reload,setReload] = useState(false);
    const handleOpenServiceForm = (serviceId: string | null) => {
        setSelectedService(serviceId);
        setIsOpenServiceForm(true);
    };

    const handleCloseServiceForm = () => {
        setSelectedService(null);
        setIsOpenServiceForm(false);
    };

    useEffect(() => {
        const fetchTherapists = async () => {
            const therapistList = await getAllTherapists();
            setTherapists(therapistList);
        };

        fetchTherapists();
    }, []);

    // Services logic

    const getServiceList = useCallback(async () => {
        const services = await servicesData("?size=100");
        const serviceListData: Service[] = services.services.map((service) => ({
            id: service.id,
            name: service.name,
            price: service.price.toString(),
            status: service.active ? "Hoạt Động" : "Không Hoạt Động",
            category: service.categoryName,
            image: service.img,
            duration: service.duration,
            session: service.session.toString(),
        }));
        if (serviceListData.length > 0) {
            setServices(serviceListData);
        }
    }, []);

    useEffect(() => {
        getServiceList();
        fetchCategories();
    }, [isOpenCreateService,reload]);

    const categoryOptions = ["Tất Cả", ...categories.map((cat) => cat.name)];

    const closeServiceModal = () => {
        setIsModalOpen(false);
        setEditingService(null);
    };

    // Category Modal functions
    const openCategoryModal = (category: ServiceCategory | null = null) => {
        setEditingCategory(category);
        setCategoryFormErrors({});
        setCategoryFormValue(category?.name ?? "");
        setIsCategoryModalOpen(true);
    };

    const closeCategoryModal = () => {
        setIsCategoryModalOpen(false);
        setCategoryFormValue("");
        setEditingCategory(null);
    };

    // Service validation and save
    const validateServiceForm = () => {
        const errors: { [key: string]: string } = {};

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

    const handleServiceSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingService) return;

        if (!validateServiceForm()) return;

        setServices((prev) =>
            prev.some((s) => s.id === editingService.id)
                ? prev.map((s) =>
                      s.id === editingService.id ? editingService : s
                  )
                : [...prev, editingService]
        );
        closeServiceModal();
    };

    // Category validation and save
    const validateCategoryForm = () => {
        const errors: { [key: string]: string } = {};

        if (!categoryFormValue.trim()) {
            errors.name = "Tên danh mục không được để trống";
        }

        setCategoryFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCategorySave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateCategoryForm()) return;

        try {
            if (editingCategory) {
                await axios.put(`/category/${editingCategory.id}`, {
                    name: categoryFormValue,
                    description: categoryFormDescription,
                    type: type,
                });
            } else {
                await axios.post("/category", {
                    name: categoryFormValue,
                    description: categoryFormDescription,
                    type: type,
                });
            }
            fetchCategories();
            closeCategoryModal();
        } catch (error) {
            console.error("Error saving category:", error);
            setCategoryFormErrors({ submit: "Failed to save category" });
        }
    };

    const handleActivateService = async (id: number) => {
        const confirmDelete = window.confirm(
            "Bạn có chắc chắn muốn xóa dịch vụ này?"
        );
        if (confirmDelete) {
            const rq = await activateService(id.toString());
            console.log(rq)
            setReload(!reload)
        }
    };

    const handleDeactivateService = async (id: number) => {
        const confirmDelete = window.confirm(
            "Bạn có chắc chắn muốn xóa dịch vụ này?"
        );
        if (confirmDelete) {
            const rq = await deactivateService(id.toString());
            console.log(rq)
            setReload(!reload)
        }
    };
    

    const handleCategoryDelete = async (id: number) => {
        const confirmDelete = window.confirm(
            "Bạn có chắc chắn muốn xóa danh mục này?"
        );
        if (confirmDelete) {
            try {
                await axios.delete(`/category/${id}`);
                fetchCategories();
                toast.success("Xóa danh mục thành công");
            } catch (error) {
                console.error("Error deleting category:", error);
                toast.error("Xóa danh mục thất bại");
            }
        }
    };

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const response = await axios.get<{ result: ServiceCategory[] }>(
                "/category"
            );
            setCategories(response.result);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const openAssignModal = async (serviceId: number) => {
        const serviceIdString = serviceId.toString();
        setSelectedServiceId(serviceIdString);
        setSelectedTherapistIds([]);

        // Fetch current therapists for this service
        try {
            const currentTherapists = await getTherapists(serviceIdString);
            setCurrentServiceTherapists(currentTherapists);

            // Fetch all therapists
            const allTherapists = await getAllTherapists();

            // Filter out therapists already assigned to this service
            const filteredTherapists = allTherapists.filter(
                (therapist: Therapist) =>
                    !currentTherapists.some(
                        (currentTherapist: Therapist) =>
                            currentTherapist.id === therapist.id
                    )
            );

            setAvailableTherapists(filteredTherapists);
        } catch (error) {
            console.error("Error fetching therapists:", error);
            setCurrentServiceTherapists([]);
            setAvailableTherapists([]);
        }

        setIsAssignModalOpen(true);
    };

    const closeAssignModal = () => {
        setIsAssignModalOpen(false);
        setSelectedServiceId(null);
    };

    const handleTherapistSelection = (therapistId: string) => {
        setSelectedTherapistIds((prev) => {
            if (prev.includes(therapistId)) {
                return prev.filter((id) => id !== therapistId);
            } else {
                return [...prev, therapistId];
            }
        });
    };

    const handleAssignTherapists = async () => {
        if (!selectedServiceId || selectedTherapistIds.length === 0) return;

        const success = await assignTherapist(
            selectedServiceId,
            selectedTherapistIds
        );

        if (success) {
            toast.success("Chỉ định chuyên viên thành công");
            closeAssignModal();
        } else {
            toast.error("Chỉ định chuyên viên thất bại");
        }
    };

    const filteredServices = services.filter(
        (service) =>
            service.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedCategory === "Tất Cả" ||
                service.category === selectedCategory)
    );

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(categorySearchTerm.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-white">
            <Sidebar />
            <main className="flex-1 p-6 overflow-auto">
                <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">
                        Quản Lý Dịch Vụ & Danh Mục
                    </h1>
                    {isOpenCreateService ? (
                        <ServiceInfoForm
                            selectedService={selectedService}
                            handleCloseServiceForm={handleCloseServiceForm}
                        />
                    ) : (
                        <>
                            <div className="flex space-x-4 mb-6">
                                <button
                                    onClick={() => setActiveTab("services")}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        activeTab === "services"
                                            ? "bg-pink-500 text-white"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                                >
                                    Dịch Vụ
                                </button>
                                <button
                                    onClick={() => setActiveTab("categories")}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        activeTab === "categories"
                                            ? "bg-pink-500 text-white"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                                >
                                    Danh Mục
                                </button>
                            </div>
                            {/* Services Tab Content */}
                            {activeTab === "services" && (
                                <div>
                                    <div className="flex justify-end mb-4">
                                        <motion.button
                                            onClick={() =>
                                                handleOpenServiceForm(null)
                                            }
                                            className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600 flex items-center gap-2"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <FaPlus /> Thêm Dịch Vụ
                                        </motion.button>
                                        {/* <Link className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600 flex items-center gap-2" to="/manager/create-service">
                                    Thêm Dịch Vụ
                                </Link> */}
                                    </div>

                                    {/* Search & Filter Section */}
                                    <motion.div
                                        className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-pink-100 p-4 rounded-lg shadow"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{
                                            delay: 0.2,
                                            duration: 0.5,
                                        }}
                                    >
                                        <div className="w-full md:w-1/2 relative">
                                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Tìm kiếm dịch vụ..."
                                                value={searchTerm}
                                                onChange={(e) =>
                                                    setSearchTerm(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full p-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                                            />
                                        </div>
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) =>
                                                setSelectedCategory(
                                                    e.target.value
                                                )
                                            }
                                            className="w-full md:w-auto p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                                        >
                                            {categoryOptions.map((category) => (
                                                <option
                                                    key={category}
                                                    value={category}
                                                >
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
                                        transition={{
                                            delay: 0.4,
                                            duration: 0.5,
                                        }}
                                    >
                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse rounded-lg overflow-hidden">
                                                <thead>
                                                    <tr className="bg-white text-black">
                                                        <th className="p-3 text-left">
                                                            ID
                                                        </th>
                                                        <th className="p-3 text-left">
                                                            Tên Dịch Vụ
                                                        </th>
                                                        <th className="p-3 text-left">
                                                            Hình Ảnh
                                                        </th>
                                                        <th className="p-3 text-left">
                                                            Giá (VND)
                                                        </th>
                                                        <th className="p-3 text-left">
                                                            Thời Lượng
                                                        </th>
                                                        <th className="p-3 text-left">
                                                            Số Buổi
                                                        </th>
                                                        <th className="p-3 text-left">
                                                            Trạng Thái
                                                        </th>
                                                        <th className="p-3 text-left">
                                                            Danh Mục
                                                        </th>
                                                        <th className="p-3 text-left">
                                                            Hành Động
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white">
                                                    {filteredServices.length >
                                                    0 ? (
                                                        filteredServices.map(
                                                            (service) => (
                                                                <motion.tr
                                                                    key={
                                                                        service.id
                                                                    }
                                                                    className="border-t hover:bg-pink-50 transition-colors"
                                                                    initial={{
                                                                        opacity: 0,
                                                                    }}
                                                                    animate={{
                                                                        opacity: 1,
                                                                    }}
                                                                    transition={{
                                                                        duration: 0.3,
                                                                    }}
                                                                >
                                                                    <td className="p-3">
                                                                        {
                                                                            service.id
                                                                        }
                                                                    </td>

                                                                    <td className="p-3 font-medium">
                                                                        {
                                                                            service.name
                                                                        }
                                                                    </td>
                                                                    <td className="p-3 font-medium">
                                                                        <img
                                                                            src={
                                                                                service.image
                                                                            }
                                                                            alt={
                                                                                service.name
                                                                            }
                                                                            className="w-auto h-16"
                                                                        />
                                                                    </td>
                                                                    <td className="p-3">
                                                                        {
                                                                            service.price
                                                                        }
                                                                    </td>
                                                                    <td className="p-3">
                                                                        {
                                                                            service.duration
                                                                        }
                                                                    </td>
                                                                    <td className="p-3">
                                                                        {
                                                                            service.session
                                                                        }
                                                                    </td>
                                                                    <td className="p-3">
                                                                        <span
                                                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                                service.status ===
                                                                                "Hoạt Động"
                                                                                    ? "bg-green-100 text-green-800"
                                                                                    : "bg-yellow-100 text-yellow-800"
                                                                            }`}
                                                                        >
                                                                            {
                                                                                service.status
                                                                            }
                                                                        </span>
                                                                    </td>
                                                                    <td className="p-3">
                                                                        <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs">
                                                                            {
                                                                                service.category
                                                                            }
                                                                        </span>
                                                                    </td>
                                                                    <td className="p-3 flex space-x-2">
                                                                        <motion.button
                                                                            onClick={() =>
                                                                                handleOpenServiceForm(
                                                                                    service.id.toString()
                                                                                )
                                                                            }
                                                                            className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 flex items-center gap-1"
                                                                            whileHover={{
                                                                                scale: 1.05,
                                                                            }}
                                                                            whileTap={{
                                                                                scale: 0.95,
                                                                            }}
                                                                        >
                                                                            <FaEdit
                                                                                size={
                                                                                    14
                                                                                }
                                                                            />
                                                                            Sửa
                                                                        </motion.button>
                                                                        {service.status ===
                                                                                "Hoạt Động" &&
                                                                        <motion.button
                                                                            onClick={() =>
                                                                                handleDeactivateService(
                                                                                    service.id
                                                                                )
                                                                            }
                                                                            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 flex items-center gap-1"
                                                                            whileHover={{
                                                                                scale: 1.05,
                                                                            }}
                                                                            whileTap={{
                                                                                scale: 0.95,
                                                                            }}
                                                                        >
                                                                            <FaCheck
                                                                                size={
                                                                                    14
                                                                                }
                                                                            />{" "}
                                                                            Vô hiệu
                                                                        </motion.button>
                                                                        }
                                                                        {!(service.status ===
                                                                                "Hoạt Động") &&
                                                                        <motion.button
                                                                            onClick={() =>
                                                                                handleActivateService(
                                                                                    service.id
                                                                                )
                                                                            }
                                                                            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 flex items-center gap-1"
                                                                            whileHover={{
                                                                                scale: 1.05,
                                                                            }}
                                                                            whileTap={{
                                                                                scale: 0.95,
                                                                            }}
                                                                        >
                                                                            <FaCheck
                                                                                size={
                                                                                    14
                                                                                }
                                                                            />{" "}
                                                                            Kích hoạt
                                                                        </motion.button>
                                                                        }
                                                                        <motion.button
                                                                            onClick={() =>
                                                                                openAssignModal(
                                                                                    service.id
                                                                                )
                                                                            }
                                                                            className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 flex items-center gap-1"
                                                                            whileHover={{
                                                                                scale: 1.05,
                                                                            }}
                                                                            whileTap={{
                                                                                scale: 0.95,
                                                                            }}
                                                                        >
                                                                            <FaUserPlus
                                                                                size={
                                                                                    14
                                                                                }
                                                                            />{" "}
                                                                            Chỉ
                                                                            định
                                                                        </motion.button>
                                                                    </td>
                                                                </motion.tr>
                                                            )
                                                        )
                                                    ) : (
                                                        <tr>
                                                            <td
                                                                colSpan={9}
                                                                className="p-4 text-center text-gray-500"
                                                            >
                                                                Không tìm thấy
                                                                dịch vụ nào
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                            {/* Categories Tab Content */}
                            {activeTab === "categories" && (
                                <div>
                                    <div className="flex justify-end mb-4">
                                        <motion.button
                                            onClick={() =>
                                                openCategoryModal(null)
                                            }
                                            className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600 flex items-center gap-2"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <FaPlus /> Thêm Danh Mục
                                        </motion.button>
                                    </div>

                                    {/* Category Search */}
                                    <motion.div
                                        className="mb-6 bg-pink-100 p-4 rounded-lg shadow"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{
                                            delay: 0.2,
                                            duration: 0.5,
                                        }}
                                    >
                                        <div className="relative">
                                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Tìm kiếm danh mục..."
                                                value={categorySearchTerm}
                                                onChange={(e) =>
                                                    setCategorySearchTerm(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full p-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                                            />
                                        </div>
                                    </motion.div>

                                    {/* Categories Grid */}
                                    <motion.div
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{
                                            delay: 0.4,
                                            duration: 0.5,
                                        }}
                                    >
                                        {filteredCategories.map((category) => (
                                            <motion.div
                                                key={category.id}
                                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                            >
                                                <div className="p-4">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <h3 className="text-xl font-semibold text-gray-900">
                                                            {category.name}
                                                        </h3>
                                                        <div className="flex gap-2">
                                                            <motion.button
                                                                whileHover={{
                                                                    scale: 1.1,
                                                                }}
                                                                whileTap={{
                                                                    scale: 0.9,
                                                                }}
                                                                onClick={() =>
                                                                    openCategoryModal(
                                                                        category
                                                                    )
                                                                }
                                                                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                                                            >
                                                                <FaEdit />
                                                            </motion.button>
                                                            <motion.button
                                                                whileHover={{
                                                                    scale: 1.1,
                                                                }}
                                                                whileTap={{
                                                                    scale: 0.9,
                                                                }}
                                                                onClick={() =>
                                                                    handleCategoryDelete(
                                                                        category.id
                                                                    )
                                                                }
                                                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                                            >
                                                                <FaTrash />
                                                            </motion.button>
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        <p>
                                                            Created:{" "}
                                                            {new Date(
                                                                category.createdAt
                                                            ).toLocaleDateString()}
                                                        </p>
                                                        <p>
                                                            Updated:{" "}
                                                            {new Date(
                                                                category.updatedAt
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </div>
                            )}
                        </>
                    )}
                </motion.div>
            </main>

            {/* Service Modal */}
            {isModalOpen && editingService && (
                <ManagementModal
                    isOpen={isModalOpen}
                    onClose={closeServiceModal}
                    onSubmit={handleServiceSave}
                    title={
                        editingService.id ? "Chỉnh Sửa Dịch Vụ" : "Thêm Dịch Vụ"
                    }
                >
                    <form onSubmit={handleServiceSave}>
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
                                    formErrors.name ? "border-red-500" : ""
                                }`}
                            />
                            {formErrors.name && (
                                <p className="text-red-500 text-sm mt-1">
                                    {formErrors.name}
                                </p>
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
                                    formErrors.price ? "border-red-500" : ""
                                }`}
                                placeholder="150.000"
                            />
                            {formErrors.price && (
                                <p className="text-red-500 text-sm mt-1">
                                    {formErrors.price}
                                </p>
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
                                {categoryOptions
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

            {/* Category Modal */}
            {isCategoryModalOpen && (
                <ManagementModal
                    isOpen={isCategoryModalOpen}
                    onClose={closeCategoryModal}
                    onSubmit={handleCategorySave}
                    title={
                        editingCategory ? "Chỉnh Sửa Danh Mục" : "Thêm Danh Mục"
                    }
                >
                    <form onSubmit={handleCategorySave}>
                        <label className="block mb-4">
                            <span className="text-gray-700">Tên Danh Mục</span>
                            <input
                                type="text"
                                value={categoryFormValue}
                                onChange={(e) =>
                                    setCategoryFormValue(e.target.value)
                                }
                                className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 ${
                                    categoryFormErrors.name
                                        ? "border-red-500"
                                        : ""
                                }`}
                            />
                            {categoryFormErrors.name && (
                                <p className="text-red-500 text-sm mt-1">
                                    {categoryFormErrors.name}
                                </p>
                            )}
                        </label>
                        <label className="block mb-4">
                            <span className="text-gray-700">Mô Tả</span>
                            <textarea
                                value={categoryFormDescription}
                                onChange={(e) =>
                                    setCategoryFormDescription(e.target.value)
                                }
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                                rows={2}
                                placeholder="Mô tả danh mục"
                            />
                            {categoryFormErrors.description && (
                                <p className="text-red-500 text-sm mt-1">
                                    {categoryFormErrors.description}
                                </p>
                            )}
                        </label>
                        <select
                            onChange={(e) => {
                                setType(e.target.value);
                                console.log(e.target.value);
                            }}
                        >
                            {types &&
                                types.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                        </select>
                        {categoryFormErrors.submit && (
                            <p className="text-red-500 text-sm mb-4">
                                {categoryFormErrors.submit}
                            </p>
                        )}
                    </form>
                </ManagementModal>
            )}

            {/* Assign Therapist Modal */}
            {isAssignModalOpen && (
                <AssignModal
                    isOpen={isAssignModalOpen}
                    onClose={closeAssignModal}
                    onSubmit={handleAssignTherapists}
                    title="Chỉ định Chuyên Viên"
                >
                    {/* Current Therapists Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Chuyên Viên Hiện Tại
                        </h3>
                        {currentServiceTherapists.length > 0 ? (
                            <div className="space-y-2 mb-6 max-h-32 overflow-y-auto">
                                {currentServiceTherapists.map(
                                    (therapist: Therapist) => (
                                        <div
                                            key={therapist.id}
                                            className="bg-gray-100 p-2 rounded flex justify-between items-center"
                                        >
                                            <div>
                                                <span className="font-medium">
                                                    {therapist.fullName}
                                                </span>
                                                <span className="text-sm text-gray-500 ml-2">
                                                    {therapist.experienceYears}{" "}
                                                    năm kinh nghiệm
                                                </span>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500 mb-6">
                                Chưa có chuyên viên được chỉ định cho dịch vụ
                                này
                            </p>
                        )}
                    </div>

                    <div className="border-t pt-4">
                        <p className="text-gray-700 mb-4">
                            Chọn chuyên viên để chỉ định cho dịch vụ này:
                        </p>

                        {availableTherapists.length > 0 ? (
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {availableTherapists.map(
                                    (therapist: Therapist) => (
                                        <div
                                            key={therapist.id}
                                            className="flex items-center p-2 border rounded hover:bg-gray-50"
                                        >
                                            <input
                                                type="checkbox"
                                                id={`therapist-${therapist.id}`}
                                                checked={selectedTherapistIds.includes(
                                                    therapist.id
                                                )}
                                                onChange={() =>
                                                    handleTherapistSelection(
                                                        therapist.id
                                                    )
                                                }
                                                className="mr-3 h-5 w-5 text-pink-500 focus:ring-pink-400"
                                            />
                                            <label
                                                htmlFor={`therapist-${therapist.id}`}
                                                className="flex-1 cursor-pointer"
                                            >
                                                <div className="font-medium">
                                                    {therapist.fullName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {therapist.experienceYears}{" "}
                                                    năm kinh nghiệm •{" "}
                                                    {therapist.phone}
                                                </div>
                                            </label>
                                        </div>
                                    )
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center">
                                Không có chuyên viên để chỉ định
                            </p>
                        )}
                    </div>
                </AssignModal>
            )}
        </div>
    );
}
