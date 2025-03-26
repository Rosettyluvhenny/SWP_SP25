import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBarDashboard";
import ManagementModal from "../components/ManagementModal";
import {
    getRooms,
    createRoom,
    updateRoom,
    deleteRoom,
    assignService,
    deleteAssignedService,
    Service,
    Room,
    getRoomById,
} from "../data/roomData";
import { servicesData, Service as ServiceType } from "../data/servicesData";

export default function RoomManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [allServices, setAllServices] = useState<ServiceType[]>([]);
    const [selectedRoomServices, setSelectedRoomServices] = useState<Service[]>(
        []
    );
    const [currentRoom, setCurrentRoom] = useState<Room | null>(null);

    useEffect(() => {
        fetchRooms();
        fetchAllServices();
    }, []);

    const fetchRooms = async () => {
        setIsLoading(true);
        try {
            const data = await getRooms();
            setRooms(data);
        } catch (error) {
            console.error("Failed to fetch rooms:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAllServices = async () => {
        try {
            // Fetch all services without any filter
            const allServicesData = await servicesData("");
            setAllServices(allServicesData.services);
        } catch (error) {
            console.error("Failed to fetch all services:", error);
            setAllServices([]);
        }
    };

    const openServiceManagement = async (room: Room) => {
        try {
            const fullRoomDetails = await getRoomById(room.id);

            if (fullRoomDetails) {
                setCurrentRoom(room);
                setSelectedRoomServices(fullRoomDetails.services || []);
                setIsServiceModalOpen(true);
            } else {
                console.error("Failed to fetch room details");
                setSelectedRoomServices([]);
            }
        } catch (error) {
            console.error("Failed to fetch room services:", error);
            setSelectedRoomServices([]);
        }
    };

    const handleAssignService = async (serviceId: string) => {
        if (!currentRoom) return;

        try {
            const result = await assignService(currentRoom.id, serviceId);
            if (result) {
                await fetchRooms();
                await openServiceManagement(currentRoom);
                alert("Dịch vụ đã được gán thành công!");
            } else {
                alert("Không thể gán dịch vụ. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Failed to assign service:", error);
            alert("Có lỗi xảy ra khi gán dịch vụ.");
        }
    };

    const handleRemoveService = async (serviceId: string) => {
        if (!currentRoom) return;

        try {
            const result = await deleteAssignedService(
                currentRoom.id,
                serviceId
            );
            if (result) {
                await fetchRooms();
                await openServiceManagement(currentRoom);
                alert("Dịch vụ đã được gỡ bỏ thành công!");
            } else {
                alert("Không thể gỡ bỏ dịch vụ. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Failed to remove service:", error);
            alert("Có lỗi xảy ra khi gỡ bỏ dịch vụ.");
        }
    };

    const openModal = (room: Room | null = null) => {
        setEditingRoom(
            room ?? {
                id: "",
                name: "",
                capacity: "",
                services: [],
            }
        );
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingRoom(null);
    };

    const closeServiceModal = () => {
        setIsServiceModalOpen(false);
        setCurrentRoom(null);
        setSelectedRoomServices([]);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRoom) return;

        try {
            if (editingRoom.id) {
                await updateRoom(
                    editingRoom.id,
                    editingRoom.name,
                    editingRoom.capacity,
                    editingRoom.services
                );
            } else {
                await createRoom(
                    editingRoom.name,
                    editingRoom.capacity,
                    editingRoom.services
                );
            }
            fetchRooms();
            closeModal();
        } catch (error) {
            console.error("Failed to save room:", error);
            alert("Có lỗi xảy ra khi lưu phòng. Vui lòng thử lại.");
        }
    };

    const handleDelete = async (id: string) => {
        const confirmDelete = window.confirm(
            "Bạn có chắc chắn muốn xóa phòng này?"
        );
        if (confirmDelete) {
            try {
                await deleteRoom(id);
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
                    <h1 className="text-2xl font-bold text-gray-800">
                        Quản Lý Phòng
                    </h1>
                    <button
                        onClick={() => openModal(null)}
                        className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600"
                    >
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
                    <h2 className="text-xl font-semibold mb-4">
                        Danh Sách Phòng
                    </h2>
                    {isLoading ? (
                        <div className="text-center py-4">
                            Đang tải dữ liệu...
                        </div>
                    ) : (
                        <div className="overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-pink-100">
                            <table className="w-full border-collapse rounded-lg overflow-hidden">
                                <thead className="sticky top-0 bg-white shadow-md">
                                    <tr className="bg-white text-black">
                                        <th className="p-3 text-left">ID</th>
                                        <th className="p-3 text-left">
                                            Tên Phòng
                                        </th>
                                        <th className="p-3 text-left">
                                            Sức Chứa
                                        </th>
                                        <th className="p-3 text-left">
                                            Dịch Vụ
                                        </th>
                                        <th className="p-3 text-left">
                                            Hành Động
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {rooms
                                        .filter((room) =>
                                            room.name
                                                .toLowerCase()
                                                .includes(
                                                    searchTerm.toLowerCase()
                                                )
                                        )
                                        .map((room) => (
                                            <tr
                                                key={room.id}
                                                className="border-t"
                                            >
                                                <td className="p-3">
                                                    {room.id}
                                                </td>
                                                <td className="p-3">
                                                    {room.name}
                                                </td>
                                                <td className="p-3">
                                                    {room.capacity}
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex items-center space-x-2">
                                                        <ul className="flex-grow">
                                                            {room.services.map(
                                                                (service) => (
                                                                    <li
                                                                        key={
                                                                            service.id
                                                                        }
                                                                    >
                                                                        {
                                                                            service.name
                                                                        }
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    </div>
                                                </td>
                                                <td className="p-3 flex space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            openServiceManagement(
                                                                room
                                                            )
                                                        }
                                                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-sm"
                                                    >
                                                        Quản Lý Dịch Vụ
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            openModal(room)
                                                        }
                                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                                    >
                                                        Chỉnh Sửa
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                room.id
                                                            )
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
                    )}
                </div>

                {/* Room Management Modal */}
                <ManagementModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onSubmit={handleSave}
                    title={editingRoom?.id ? "Chỉnh Sửa Phòng" : "Thêm Phòng"}
                >
                    <div className="flex flex-col space-y-3">
                        <label className="font-semibold">Tên Phòng</label>
                        <input
                            type="text"
                            value={editingRoom?.name || ""}
                            onChange={(e) =>
                                setEditingRoom((prev) =>
                                    prev
                                        ? { ...prev, name: e.target.value }
                                        : null
                                )
                            }
                            className="p-2 border rounded"
                        />

                        <label className="font-semibold">Sức Chứa</label>
                        <input
                            type="text"
                            value={editingRoom?.capacity || ""}
                            onChange={(e) =>
                                setEditingRoom((prev) =>
                                    prev
                                        ? { ...prev, capacity: e.target.value }
                                        : null
                                )
                            }
                            className="p-2 border rounded"
                        />
                    </div>
                </ManagementModal>

                {/* Service Management Modal */}
                <ManagementModal
                    isOpen={isServiceModalOpen}
                    onClose={closeServiceModal}
                    title={`Quản Lý Dịch Vụ Phòng: ${currentRoom?.name || ""}`}
                    onSubmit={(e) => {
                        e.preventDefault();
                        closeServiceModal();
                    }}
                >
                    <div className="flex flex-col space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">
                                Dịch Vụ Hiện Tại
                            </h3>
                            {selectedRoomServices.length > 0 ? (
                                <ul className="space-y-2">
                                    {selectedRoomServices.map((service) => (
                                        <li
                                            key={service.id}
                                            className="flex justify-between items-center bg-pink-100 p-2 rounded"
                                        >
                                            <span>{service.name}</span>
                                            <button
                                                onClick={() =>
                                                    handleRemoveService(
                                                        service.id.toString()
                                                    )
                                                }
                                                className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                                            >
                                                Gỡ Bỏ
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">
                                    Không có dịch vụ nào được gán
                                </p>
                            )}
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2">
                                Thêm Dịch Vụ Mới
                            </h3>
                            <select
                                onChange={(e) =>
                                    handleAssignService(e.target.value)
                                }
                                className="w-full p-2 border rounded"
                                defaultValue=""
                            >
                                <option value="" disabled>
                                    Chọn dịch vụ
                                </option>
                                {allServices
                                    .filter(
                                        (service) =>
                                            !selectedRoomServices.some(
                                                (selectedService) =>
                                                    selectedService.id.toString() ===
                                                    service.id.toString()
                                            )
                                    )
                                    .map((service) => (
                                        <option
                                            key={service.id}
                                            value={service.id}
                                        >
                                            {service.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>
                </ManagementModal>
            </main>
        </div>
    );
}
