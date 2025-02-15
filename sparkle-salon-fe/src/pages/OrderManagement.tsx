import React, { useState } from "react";
import Sidebar from "../components/SideBarDashboard";

export default function OrderManagement() {
    const [searchTerm, setSearchTerm] = useState("");

    const orders = [
        { id: "#001", customer: "Nguyễn Văn A", date: "2025-02-16", total: "250.000", status: "Đã Đặt" },
        { id: "#002", customer: "Nguyễn Văn B", date: "2025-02-15", total: "120.000", status: "Đang Đặt" },
        { id: "#003", customer: "Nguyễn Văn C", date: "2025-02-14", total: "75.000", status: "Đã Hủy" },
        { id: "#004", customer: "Nguyễn Thị D", date: "2025-02-13", total: "300.000", status: "Đã Đặt" },
    ];

    return (
        <div className="flex h-screen bg-white">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 p-6">
                {/* Page Header */}
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Quản Lý Đơn Hàng</h1>
                    <button className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600">
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
                    <h2 className="text-xl font-semibold mb-4">Danh Sách Đơn Hàng</h2>
                    <table className="w-full border-collapse rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-white text-black">
                                <th className="p-3 text-left">Mã Đơn</th>
                                <th className="p-3 text-left">Khách Hàng</th>
                                <th className="p-3 text-left">Ngày Đặt</th>
                                <th className="p-3 text-left">Tổng Tiền(VND)</th>
                                <th className="p-3 text-left">Trạng Thái</th>
                                <th className="p-3 text-left">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {orders.map((order) => (
                                <tr key={order.id} className="border-t">
                                    <td className="p-3">{order.id}</td>
                                    <td className="p-3">{order.customer}</td>
                                    <td className="p-3">{order.date}</td>
                                    <td className="p-3">{order.total}</td>
                                    <td
                                        className={`p-3 ${
                                            order.status === "Đã Đặt"
                                                ? "text-green-600"
                                                : order.status === "Đang Đặt"
                                                ? "text-yellow-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {order.status}
                                    </td>
                                    <td className="p-3 flex space-x-2">
                                        <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                                            Xem Chi Tiết
                                        </button>
                                        {order.status !== "Đã Hủy" && (
                                            <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                                Hủy Đơn
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
