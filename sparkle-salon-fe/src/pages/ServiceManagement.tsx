import React, { useState } from "react";
import Sidebar from "../components/SideBarDashboard";
import ManagementModal from "../components/ManagementModal";

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
    const [services, setServices] = useState<Service[]>([
        {
            id: 1,
            name: "Nặn Mụn Chuyên Sâu",
            price: "150.000",
            status: "Hoạt Động",
            category: "Chăm Sóc Da",
        },
        {
            id: 2,
            name: "Trị da dầu",
            price: "250.000",
            status: "Không Hoạt Động",
            category: "Trị Liệu",
        },
        {
            id: 3,
            name: "Trị da sẹo rỗ",
            price: "300.000",
            status: "Hoạt Động",
            category: "Trị Liệu",
        },
        {
            id: 4,
            name: "Thải Độc Da",
            price: "180.000",
            status: "Hoạt Động",
            category: "Chăm Sóc Da",
        },
    ]);

    const categories = ["Tất Cả", "Chăm Sóc Da", "Trị Liệu", "Dịch Vụ Khác"];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

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
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingService(null);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingService) return;

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

    return (
        <div className="flex h-screen bg-white">
            <Sidebar />
            <main className="flex-1 p-6">
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Quản Lý Dịch Vụ
                    </h1>
                    <button
                        onClick={() => openModal(null)}
                        className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600"
                    >
                        + Thêm Dịch Vụ
                    </button>
                </div>

                {/* Search & Filter Section */}
                <div className="mb-6 flex justify-between items-center bg-pink-100 p-4 rounded-lg shadow">
                    <input
                        type="text"
                        placeholder="Tìm kiếm dịch vụ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-1/2 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Services Table */}
                <div className="bg-pink-100 shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Danh Sách Dịch Vụ
                    </h2>
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
                            {services
                                .filter(
                                    (service) =>
                                        service.name
                                            .toLowerCase()
                                            .includes(
                                                searchTerm.toLowerCase()
                                            ) &&
                                        (selectedCategory === "Tất Cả" ||
                                            service.category ===
                                                selectedCategory)
                                )
                                .map((service) => (
                                    <tr key={service.id} className="border-t">
                                        <td className="p-3">{service.id}</td>
                                        <td className="p-3">{service.name}</td>
                                        <td className="p-3">{service.price}</td>
                                        <td
                                            className={`p-3 ${
                                                service.status === "Hoạt Động"
                                                    ? "text-green-600"
                                                    : "text-yellow-600"
                                            }`}
                                        >
                                            {service.status}
                                        </td>
                                        <td className="p-3">
                                            {service.category}
                                        </td>
                                        <td className="p-3 flex space-x-2">
                                            <button
                                                onClick={() =>
                                                    openModal(service)
                                                }
                                                className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(service.id)
                                                }
                                                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Modal for Adding/Editing Services */}
            {isModalOpen && editingService && (
                <ManagementModal onClose={closeModal}>
                    <h2 className="text-xl font-semibold mb-4">
                        {editingService.id
                            ? "Chỉnh Sửa Dịch Vụ"
                            : "Thêm Dịch Vụ"}
                    </h2>
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
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                                required
                            />
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
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                                required
                            />
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

                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
                            >
                                Lưu
                            </button>
                        </div>
                    </form>
                </ManagementModal>
            )}
        </div>
    );
}
