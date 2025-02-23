import React, { useState } from "react";
import Sidebar from "../components/SideBarDashboard";

export default function RoomManagement() {
    const [searchTerm, setSearchTerm] = useState("");

    // 3 loại phòng : cơ bản, chuyên sâu, công nghệ
    const rooms = [
        { id: 1, name: "Phòng 1", type: "Cơ bản", status: "Đang Trống" },
        { id: 2, name: "Phòng 2", type: "Chuyên sâu", status: "Đang Sử Dụng" },
        { id: 3, name: "Phòng 3", type: "Công nghệ", status: "Bảo Trì" },
        { id: 4, name: "Phòng 4", type: "Chuyên sâu", status: "Đang Trống" },
    ];

    return (
        <div className="flex h-screen bg-white">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 p-6">
                {/* Page Title */}
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Quản Lý Phòng Khám</h1>
                    <button className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600">
                        + Thêm Phòng
                    </button>
                </div>

                {/* Search Bar */}
                <div className="mb-6 flex justify-between items-center bg-pink-100 p-4 rounded-lg shadow">
                    <input
                        type="text"
                        placeholder="Tìm kiếm phòng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                </div>

                {/* Room Table */}
                <div className="bg-pink-100 shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Danh Sách Phòng</h2>
                    <table className="w-full border-collapse rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-white text-black">
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Tên Phòng</th>
                                <th className="p-3 text-left">Loại Phòng</th>
                                <th className="p-3 text-left">Trạng Thái</th>
                                <th className="p-3 text-left">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {rooms
                                .filter((room) =>
                                    room.name.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((room) => (
                                    <tr key={room.id} className="border-t">
                                        <td className="p-3">{room.id}</td>
                                        <td className="p-3">{room.name}</td>
                                        <td className="p-3">{room.type}</td>
                                        <td
                                            className={`p-3 ${
                                                room.status === "Đang Trống"
                                                    ? "text-green-600"
                                                    : room.status === "Đang Sử Dụng"
                                                    ? "text-yellow-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            {room.status}
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
