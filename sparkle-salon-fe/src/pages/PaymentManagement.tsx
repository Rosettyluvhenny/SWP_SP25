import React, { useState } from "react";
import Sidebar from "../components/SideBarDashboard";

export default function PaymentManagement() {
    const [searchTerm, setSearchTerm] = useState("");

    const payments = [
        { id: 1, customer: "Nguyễn Văn A", amount: "500,000 VNĐ", method: "Chuyển Khoản", status: "Đã Thanh Toán" },
        { id: 2, customer: "Trần Thị B", amount: "1,200,000 VNĐ", method: "Tiền Mặt", status: "Chưa Thanh Toán" },
        { id: 3, customer: "Lê Văn C", amount: "750,000 VNĐ", method: "Tiền Mặt", status: "Đã Thanh Toán" },
        { id: 4, customer: "Hoàng D", amount: "300,000 VNĐ", method: "Chuyển Khoản", status: "Hoàn Tiền" },
    ];

    return (
        <div className="flex h-screen bg-white">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 p-6">
                {/* Page Title */}
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Quản Lý Thanh Toán</h1>
                    <button className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600">
                        + Thêm Thanh Toán
                    </button>
                </div>

                {/* Search Bar */}
                <div className="mb-6 flex justify-between items-center bg-pink-100 p-4 rounded-lg shadow">
                    <input
                        type="text"
                        placeholder="Tìm kiếm khách hàng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                </div>

                {/* Payment Table */}
                <div className="bg-pink-100 shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Danh Sách Thanh Toán</h2>
                    <table className="w-full border-collapse rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-white text-black">
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Khách Hàng</th>
                                <th className="p-3 text-left">Số Tiền</th>
                                <th className="p-3 text-left">Phương Thức</th>
                                <th className="p-3 text-left">Trạng Thái</th>
                                <th className="p-3 text-left">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {payments
                                .filter((payment) =>
                                    payment.customer.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((payment) => (
                                    <tr key={payment.id} className="border-t">
                                        <td className="p-3">{payment.id}</td>
                                        <td className="p-3">{payment.customer}</td>
                                        <td className="p-3">{payment.amount}</td>
                                        <td className="p-3">{payment.method}</td>
                                        <td
                                            className={`p-3 ${
                                                payment.status === "Đã Thanh Toán"
                                                    ? "text-green-600"
                                                    : payment.status === "Chưa Thanh Toán"
                                                    ? "text-yellow-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            {payment.status}
                                        </td>
                                        <td className="p-3 flex space-x-2">
                                            <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                                                Xem Chi Tiết
                                            </button>
                                            <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                                Hoàn Tiền
                                            </button>
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
