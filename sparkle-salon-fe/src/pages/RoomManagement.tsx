
import React, { useState } from "react";
import Sidebar from "../components/SideBarDashboard";
import ManagementModal from "../components/ManagementModal";

type Room = {
    id: number;
    name: string;
    type: string;
    status: string;
};

export default function RoomManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [rooms, setRooms] = useState<Room[]>([
        // 3 loại phòng : cơ bản, chuyên sâu, công nghệ
        { id: 1, name: "Phòng 1", type: "Cơ bản", status: "Đang Trống" },
        { id: 2, name: "Phòng 2", type: "Chuyên sâu", status: "Đang Sử Dụng" },
        { id: 3, name: "Phòng 3", type: "Công nghệ", status: "Bảo Trì" },
        { id: 4, name: "Phòng 4", type: "Chuyên sâu", status: "Đang Trống" },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);

    const openModal = (room: Room | null = null) => {
        setEditingRoom(room ?? { id: rooms.length + 1, name: "", type: "Cơ bản", status: "Đang Trống" });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingRoom(null);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRoom) return;

        setRooms((prev) =>
            prev.some((r) => r.id === editingRoom.id)
                ? prev.map((r) => (r.id === editingRoom.id ? editingRoom : r))
                : [...prev, editingRoom]
        );
        closeModal();
    };

    const handleDelete = (id: number) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa phòng này?");
        if (confirmDelete) {
            setRooms(rooms.filter((room) => room.id !== id));
        }
    };

    return (
        <div className="flex h-screen bg-white">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 p-6">
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Quản Lý Phòng</h1>
                    <button onClick={() => openModal(null)} className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600">
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
                                .filter((room) => room.name.toLowerCase().includes(searchTerm.toLowerCase()))
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
                                            <button onClick={() => openModal(room)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                                                Chỉnh Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDelete(room.id)}
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
                <ManagementModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleSave} title={editingRoom ? "Chỉnh Sửa Phòng" : "Thêm Phòng"}>
                    <div className="flex flex-col space-y-3">
                        <label className="font-semibold">Tên Phòng</label>
                        <input
                            type="text"
                            value={editingRoom?.name || ""}
                            onChange={(e) => setEditingRoom((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                            className="p-2 border rounded"
                        />

                        <label className="font-semibold">Loại Phòng</label>
                        <select
                            value={editingRoom?.type || "Cơ bản"}
                            onChange={(e) => setEditingRoom((prev) => (prev ? { ...prev, type: e.target.value } : null))}
                            className="p-2 border rounded"
                        >
                            <option value="Cơ bản">Cơ bản</option>
                            <option value="Chuyên sâu">Chuyên sâu</option>
                            <option value="Công nghệ">Công nghệ</option>
                        </select>

                        <label className="font-semibold">Trạng Thái</label>
                        <select
                            value={editingRoom?.status || "Đang Trống"}
                            onChange={(e) => setEditingRoom((prev) => (prev ? { ...prev, status: e.target.value } : null))}
                            className="p-2 border rounded"
                        >
                            <option value="Đang Trống">Đang Trống</option>
                            <option value="Đang Sử Dụng">Đang Sử Dụng</option>
                            <option value="Bảo Trì">Bảo Trì</option>
                        </select>
                    </div>
                </ManagementModal>
            </main>
        </div>
    );
}
