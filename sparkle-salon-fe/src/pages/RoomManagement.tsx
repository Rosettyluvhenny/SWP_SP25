import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBarDashboard";
import ManagementModal from "../components/ManagementModal";
import { getRooms, createRoom, updateRoom, deleteRoom } from "../data/roomData";

type Room = {
    id: string;
    name: string;
    capacity: string;
    serviceIds: [];
};

export default function RoomManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        setIsLoading(true);
        try {
            const data = await getRooms();
            const formattedRooms = data.map((room: Room) => ({
                id: room.id,
                name: room.name,
                capacity: room.capacity || "",
                serviceIds: room.serviceIds || []
            }));
            setRooms(formattedRooms);
        } catch (error) {
            console.error("Failed to fetch rooms:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const openModal = (room: Room | null = null) => {
        setEditingRoom(room ?? { 
            id: "", 
            name: "", 
            capacity: "",
            serviceIds: []
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingRoom(null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRoom) return;

        try {
            if (editingRoom.id) {
                // Update existing room
                await updateRoom(
                    editingRoom.id,
                    editingRoom.name,
                    editingRoom.capacity,
                    editingRoom.serviceIds
                );
            } else {
                // Create new room
                await createRoom(
                    editingRoom.name,
                    editingRoom.capacity,
                    editingRoom.serviceIds
                );
            }
            // Refresh room list
            fetchRooms();
            closeModal();
        } catch (error) {
            console.error("Failed to save room:", error);
            alert("Có lỗi xảy ra khi lưu phòng. Vui lòng thử lại.");
        }
    };

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa phòng này?");
        if (confirmDelete) {
            try {
                await deleteRoom(id);
                // Refresh room list after deletion
                fetchRooms();
            } catch (error) {
                console.error("Failed to delete room:", error);
                alert("Có lỗi xảy ra khi xóa phòng. Vui lòng thử lại.");
            }
        }
    };

    return (
        <div className="flex h-screen bg-white">
            <Sidebar />
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
                    {isLoading ? (
                        <div className="text-center py-4">Đang tải dữ liệu...</div>
                    ) : (
                        <table className="w-full border-collapse rounded-lg overflow-hidden">
                            <thead>
                                <tr className="bg-white text-black">
                                    <th className="p-3 text-left">ID</th>
                                    <th className="p-3 text-left">Tên Phòng</th>
                                    <th className="p-3 text-left">Sức Chứa</th>
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
                                            <td className="p-3">{room.capacity}</td>

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
                    )}
                </div>

                {/* Modal */}
                <ManagementModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleSave} title={editingRoom?.id ? "Chỉnh Sửa Phòng" : "Thêm Phòng"}>
                    <div className="flex flex-col space-y-3">
                        <label className="font-semibold">Tên Phòng</label>
                        <input
                            type="text"
                            value={editingRoom?.name || ""}
                            onChange={(e) => setEditingRoom((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                            className="p-2 border rounded"
                        />

                        <label className="font-semibold">Sức Chứa</label>
                        <input
                            type="text"
                            value={editingRoom?.capacity || ""}
                            onChange={(e) => setEditingRoom((prev) => (prev ? { ...prev, capacity: e.target.value } : null))}
                            className="p-2 border rounded"
                        />
                    </div>
                </ManagementModal>
            </main>
        </div>
    );
}