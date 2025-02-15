import React, { useState } from "react";
import Sidebar from "../components/SideBarDashboard";

export default function UserManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const users = [
        {
            id: 1,
            name: "Nguyễn Văn A",
            email: "a@email.com",
            role: "Admin",
            status: "Hoạt Động",
        },
        {
            id: 2,
            name: "Trần Thị B",
            email: "b@email.com",
            role: "Member",
            status: "Không Hoạt Động",
        },
        {
            id: 3,
            name: "Lê Văn C",
            email: "c@email.com",
            role: "Shop Owner",
            status: "Hoạt Động",
        },
        {
            id: 4,
            name: "Hoàng D",
            email: "d@email.com",
            role: "Member",
            status: "Bị Xoá",
        },
    ];

    return (
        <div className="flex h-screen bg-white">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 p-6">
                {/* Page Title */}
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Quản Lý Người Dùng
                    </h1>
                    <button className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600">
                        + Thêm Người Dùng
                    </button>
                </div>

                {/* Search Bar */}
                <div className="mb-6 flex justify-between items-center bg-pink-100 p-4 rounded-lg shadow">
                    <input
                        type="text"
                        placeholder="Tìm kiếm người dùng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                </div>

                {/* User Table */}
                <div className="bg-pink-100 shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Danh Sách Người Dùng
                    </h2>
                    <table className="w-full border-collapse rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-white text-black">
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Họ Tên</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Vai Trò</th>
                                <th className="p-3 text-left">Trạng Thái</th>
                                <th className="p-3 text-left">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {users.map((user) => (
                                <tr key={user.id} className="border-t">
                                    <td className="p-3">{user.id}</td>
                                    <td className="p-3">{user.name}</td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">{user.role}</td>
                                    <td
                                        className={`p-3 ${
                                            user.status === "Hoạt Động"
                                                ? "text-green-600"
                                                : user.status === "Không Hoạt Động"
                                                ? "text-yellow-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {user.status}
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
