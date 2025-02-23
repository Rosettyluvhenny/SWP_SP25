import React, { useState } from "react";
import Sidebar from "../components/SideBarDashboard";
import ManagementModal from "../components/ManagementModal";

type Order = {
    id: number;
    customer: string;
    date: string;
    total: string;
    status: string;
};

export default function OrderManagement() {
    const [searchTerm, setSearchTerm] = useState("");

    const [orders, setOrders] = useState<Order[]>([
        {
            id: 1,
            customer: "Nguyễn Văn A",
            date: "2025-02-16",
            total: "250.000",
            status: "Đã Đặt",
        },
        {
            id: 2,
            customer: "Nguyễn Văn B",
            date: "2025-02-15",
            total: "120.000",
            status: "Đang Đặt",
        },
        {
            id: 3,
            customer: "Nguyễn Văn C",
            date: "2025-02-14",
            total: "75.000",
            status: "Đã Hủy",
        },
        {
            id: 4,
            customer: "Nguyễn Thị D",
            date: "2025-02-13",
            total: "300.000",
            status: "Đã Đặt",
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);

    const openModal = (order: Order | null = null) => {
        setEditingOrder(
            order ?? {
                id: orders.length + 1,
                customer: "",
                date: "",
                total: "",
                status: "Chờ Xác Nhận",
            }
        );
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingOrder(null);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingOrder) return;

        setOrders((prev) =>
            prev.some((o) => o.id === editingOrder.id)
                ? prev.map((o) => (o.id === editingOrder.id ? editingOrder : o))
                : [...prev, editingOrder]
        );
        closeModal();
    };

    const handleDelete = (id: number) => {
        const confirmDelete = window.confirm(
            "Bạn có chắc chắn muốn xóa đơn hàng này?"
        );
        if (confirmDelete) {
            setOrders(orders.filter((order) => order.id !== id));
        }
    };

    return (
        <div className="flex h-screen bg-white">
            <Sidebar />
            <main className="flex-1 p-6">
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Quản Lý Đơn Hàng
                    </h1>
                    <button
                        onClick={() => openModal(null)}
                        className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600"
                    >
                        + Thêm Đơn Hàng
                    </button>
                </div>

                {/* Search Bar */}
                <div className="mb-6 flex justify-between items-center bg-pink-100 p-4 rounded-lg shadow">
                    <input
                        type="text"
                        placeholder="Tìm kiếm đơn hàng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                </div>

                {/* Orders Table */}
                <div className="bg-pink-100 shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Danh Sách Đơn Hàng
                    </h2>
                    <table className="w-full border-collapse rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-white text-black">
                                <th className="p-3 text-left">Mã Đơn</th>
                                <th className="p-3 text-left">Khách Hàng</th>
                                <th className="p-3 text-left">Ngày Đặt</th>
                                <th className="p-3 text-left">
                                    Tổng Tiền(VND)
                                </th>
                                <th className="p-3 text-left">Trạng Thái</th>
                                <th className="p-3 text-left">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {orders
                                .filter((order) =>
                                    order.customer
                                        .toLowerCase()
                                        .includes(searchTerm.toLowerCase())
                                )
                                .map((order) => (
                                    <tr key={order.id} className="border-t">
                                        <td className="p-3">{order.id}</td>
                                        <td className="p-3">
                                            {order.customer}
                                        </td>
                                        <td className="p-3">{order.date}</td>
                                        <td className="p-3">{order.total}</td>
                                        <td
                                            className={`p-3 ${
                                                order.status === "Đã Đặt"
                                                    ? "text-green-600"
                                                    : order.status ===
                                                      "Đang Đặt"
                                                    ? "text-yellow-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            {order.status}
                                        </td>
                                        <td className="p-3 flex space-x-2">
                                            <button
                                                onClick={() => openModal(order)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                            >
                                                Chỉnh Sửa
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(order.id)
                                                }
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Modal */}
                <ManagementModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleSave} title={editingOrder ? "Chỉnh Sửa Đơn Hàng" : "Thêm Đơn Hàng"}>
                    <div className="flex flex-col space-y-3">
                        <label className="font-semibold">Khách Hàng</label>
                        <input
                            type="text"
                            value={editingOrder?.customer || ""}
                            onChange={(e) => setEditingOrder((prev) => (prev ? { ...prev, customer: e.target.value } : null))}
                            className="p-2 border rounded"
                        />

                        <label className="font-semibold">Date</label>
                        <input
                            type="date"
                            value={editingOrder?.date || ""}
                            onChange={(e) => setEditingOrder((prev) => (prev ? { ...prev, date: e.target.value } : null))}
                            className="p-2 border rounded"
                        />

                        <label className="font-semibold">Tổng Tiền (VNĐ)</label>
                        <input
                            type="number"
                            value={editingOrder?.total || 0}
                            onChange={(e) => setEditingOrder((prev) => (prev ? { ...prev, totalAmount: Number(e.target.value) } : null))}
                            className="p-2 border rounded"
                        />

                        <label className="font-semibold">Trạng Thái</label>
                        <select
                            value={editingOrder?.status || "Đang Đặt"}
                            onChange={(e) => setEditingOrder((prev) => (prev ? { ...prev, status: e.target.value } : null))}
                            className="p-2 border rounded"
                        >
                            <option value="Đang Đặt">Đang Đặt</option>
                            <option value="Đã Đặt">Đã Đặt</option>
                            <option value="Đã Huỷ">Đã Huỷ</option>
                        </select>
                    </div>
                </ManagementModal>
            </main>
        </div>
    );
}
