import React, { useState } from "react";
import Sidebar from "../components/SideBarDashboard";
import ManagementModal from "../components/ManagementModal";

type User = {
    id: number;
    username: string;
    fullname: string;
    email: string;
    phone: string;
    dob: string;
    role: string;
};

export default function UserManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState<User[]>([
        { id: 1, username: "Văn A", email: "a@email.com", role: "Admin", fullname: "Nguyễn Văn A", phone: "0909090909", dob: "1990-01-01" },
        { id: 2, username: "Thị B", email: "b@email.com", role: "Staff", fullname: "Trần Thị B", phone: "0909090909", dob: "1990-01-01" },
        { id: 3, username: "Văn C", email: "c@email.com", role: "Skin Therapist", fullname: "Lê Văn C", phone: "0909090909", dob: "1990-01-01" },
        { id: 4, username: "Hoàng D", email: "d@email.com", role: "Customer", fullname: "Hoàng Văn D", phone: "0909090909", dob: "1990-01-01" },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const openModal = (user: User | null = null) => {
        setEditingUser(user ?? { id: users.length + 1, username: "", email: "", role: "User", fullname: "", phone: "", dob: "" });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        setUsers((prev) =>
            prev.some((u) => u.id === editingUser.id)
                ? prev.map((u) => (u.id === editingUser.id ? editingUser : u))
                : [...prev, editingUser]
        );
        closeModal();
    };

    const handleDelete = (id: number) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa người dùng này?");
        if (confirmDelete) {
            setUsers(users.filter((user) => user.id !== id));
        }
    };

    return (
        <div className="flex h-screen bg-white">
            <Sidebar />
            <main className="flex-1 p-6">
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Quản Lý Người Dùng</h1>
                    <button onClick={() => openModal(null)} className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600">
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
                    <h2 className="text-xl font-semibold mb-4">Danh Sách Người Dùng</h2>
                    <table className="w-full border-collapse rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-white text-black">
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Tên Người Dùng</th>
                                <th className="p-3 text-left">Họ Tên</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Vai Trò</th>
                                <th className="p-3 text-left">Số Điện Thoại</th>
                                <th className="p-3 text-left">Ngày Sinh</th>
                                <th className="p-3 text-left">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {users
                                .filter((user) => user.username.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map((user) => (
                                    <tr key={user.id} className="border-t">
                                        <td className="p-3">{user.id}</td>
                                        <td className="p-3">{user.username}</td>
                                        <td className="p-3">{user.fullname}</td>
                                        <td className="p-3">{user.email}</td>
                                        <td className="p-3">{user.role}</td>
                                        <td className="p-3">{user.phone}</td>
                                        <td className="p-3">{user.dob}</td>
                                        <td className="p-3 flex space-x-2">
                                            <button onClick={() => openModal(user)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                                                Chỉnh Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
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
                <ManagementModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleSave} title={editingUser ? "Chỉnh Sửa Người Dùng" : "Thêm Người Dùng"}>
                    <div className="flex flex-col space-y-3">
                        <label className="font-semibold">Họ Tên</label>
                        <input
                            type="text"
                            value={editingUser?.username || ""}
                            onChange={(e) => setEditingUser((prev) => (prev ? { ...prev, username: e.target.value } : null))}
                            className="p-2 border rounded"
                        />

                        <label className="font-semibold">Email</label>
                        <input
                            type="email"
                            value={editingUser?.email || ""}
                            onChange={(e) => setEditingUser((prev) => (prev ? { ...prev, email: e.target.value } : null))}
                            className="p-2 border rounded"
                        />

                        <label className="font-semibold">Vai Trò</label>
                        <select
                            value={editingUser?.role || "User"}
                            onChange={(e) => setEditingUser((prev) => (prev ? { ...prev, role: e.target.value } : null))}
                            className="p-2 border rounded"
                        >
                            <option value="Admin">Admin</option>
                            <option value="Therapist">Therapist</option>
                            <option value="User">User</option>
                        </select>

                        <label className="font-semibold">Ngày Sinh</label>
                        <input
                            type="date"
                            value={editingUser?.dob || ""}
                            onChange={(e) => setEditingUser((prev) => (prev ? { ...prev, dob: e.target.value } : null))}
                            className="p-2 border rounded"
                        />

                        <label className="font-semibold">Số Điện Thoại</label>
                        <input
                            type="text"
                            value={editingUser?.phone || ""}
                            onChange={(e) => setEditingUser((prev) => (prev ? { ...prev, phone: e.target.value } : null))}
                        />

                    </div>
                </ManagementModal>
            </main>
        </div>
    );
}
