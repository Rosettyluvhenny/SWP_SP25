import React, { useState } from "react";
import Sidebar from "../components/SideBarDashboard";

export default function ServiceManagement() {
    const [searchTerm, setSearchTerm] = useState("");

    const services = [
        { id: 1, name: "Nặn Mụn Chuyên Sâu", price: "150.000", status: "Hoạt Động" },
        { id: 2, name: "Trị da dầu", price: "250.000", status: "Không Hoạt Động" },
        { id: 3, name: "Trị da sẹo rỗ", price: "300.000", status: "Hoạt Động" },
        { id: 4, name: "thải độc da", price: "180.000", status: "Hoạt Động" },
    ];

    return (
        <div className="flex h-screen bg-white">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 p-6">
                {/* Page Header */}
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Quản Lý Dịch Vụ</h1>
                    <button className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600">
                        + Thêm Dịch Vụ
                    </button>
                </div>

                {/* Search Bar */}
                <div className="mb-6 flex justify-between items-center bg-pink-100 p-4 rounded-lg shadow">
                    <input
                        type="text"
                        placeholder="Tìm kiếm dịch vụ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                </div>

                {/* Services Table */}
                <div className="bg-pink-100 shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Danh Sách Dịch Vụ</h2>
                    <table className="w-full border-collapse rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-white text-black">
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Tên Dịch Vụ</th>
                                <th className="p-3 text-left">Giá(VND)</th>
                                <th className="p-3 text-left">Trạng Thái</th>
                                <th className="p-3 text-left">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {services.map((service) => (
                                <tr key={service.id} className="border-t">
                                    <td className="p-3">{service.id}</td>
                                    <td className="p-3">{service.name}</td>
                                    <td className="p-3">{service.price}</td>
                                    <td
                                        className={`p-3 ${
                                            service.status === "Hoạt Động" ? "text-green-600" : "text-yellow-600"
                                        }`}
                                    >
                                        {service.status}
                                    </td>
                                    <td className="p-3 flex space-x-2">
                                        <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                                            Chỉnh Sửa
                                        </button>
                                        <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                            Xóa
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
