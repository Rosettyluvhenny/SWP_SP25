import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBarDashboard";
import ManagementModal from "../components/ManagementModal";
import { getUser, createUser, disableUser } from "../data/authData";

type User = {
    id: number;
    username: string;
    fullName: string;
    email: string;
    phone: string;
    dob: string;
    role: string;
    password?: string;
};

export default function UserManagement() {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const userData = await getUser();
            if (userData) {
                setUsers(userData);
            }
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (user: User | null = null) => {
        setEditingUser(
            user ?? {
                id: users.length + 1,
                username: "",
                email: "",
                role: "User",
                fullName: "",
                phone: "",
                dob: "",
            }
        );
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        try {
            if (editingUser.id && users.some((u) => u.id === editingUser.id)) {
                setUsers((prev) =>
                    prev.map((u) => (u.id === editingUser.id ? editingUser : u))
                );
            } else {
                const success = await createUser({
                    username: editingUser.username,
                    password: editingUser.password || "defaultPassword",
                    fullName: editingUser.fullName,
                    email: editingUser.email,
                    phone: editingUser.phone,
                    dob: editingUser.dob,
                });

                if (success) {
                    await fetchUsers();
                }else{
                    alert("Tạo người dùng thành công");
                }
            }
            closeModal();
        } catch (err) {
            console.error("Error saving user:", err);
        }
    };

    const handleDisable = async (id: number) => {
        const confirmDisable = window.confirm(
            "Bạn có chắc chắn muốn vô hiệu hóa người dùng này?"
        );
        if (confirmDisable) {
            try {
                const success = await disableUser(id.toString());

                if (success) {
                    setUsers((prevUsers) =>
                        prevUsers.map((user) =>
                            user.id === id
                                ? { ...user, role: "Disabled" }
                                : user
                        )
                    );
                }
            } catch (err) {
                console.error("Error disabling user:", err);
            }
        }
    };

    const isEditingExistingUser = () => {
        return editingUser ? users.some((u) => u.id === editingUser.id) : false;
    };

    return (
        <div className="flex h-screen bg-white">
            <Sidebar />
            <main className="flex-1 p-6">
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Quản Lý Người Dùng
                    </h1>
                    <button
                        onClick={() => openModal(null)}
                        className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600"
                    >
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

                    {loading ? (
                        <div className="text-center py-4">
                            <p>Đang tải dữ liệu...</p>
                        </div>
                    ) : (
                        <div className="overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-pink-100">
                            <table className="w-full border-collapse rounded-lg overflow-hidden">
                                <thead className="sticky top-0 bg-white shadow-md">
                                    <tr className="text-black">
                                        <th className="p-3 text-left">
                                            Tên Người Dùng
                                        </th>
                                        <th className="p-3 text-left">
                                            Họ Tên
                                        </th>
                                        <th className="p-3 text-left">Email</th>
                                        <th className="p-3 text-left">
                                            Vai Trò
                                        </th>
                                        <th className="p-3 text-left">
                                            Số Điện Thoại
                                        </th>
                                        <th className="p-3 text-left">
                                            Ngày Sinh
                                        </th>
                                        <th className="p-3 text-left">
                                            Hành Động
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {users.map((user) => (
                                        <tr key={user.id} className="border-t">
                                            <td className="p-3">
                                                {user.username}
                                            </td>
                                            <td className="p-3">
                                                {user.fullName}
                                            </td>
                                            <td className="p-3">
                                                {user.email}
                                            </td>
                                            <td className="p-3">{user.role}</td>
                                            <td className="p-3">
                                                {user.phone}
                                            </td>
                                            <td className="p-3">{user.dob}</td>
                                            <td className="p-3 flex space-x-2">
                                                <button
                                                    onClick={() =>
                                                        handleDisable(user.id)
                                                    }
                                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                >
                                                    Vô hiệu hóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <ManagementModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onSubmit={handleSave}
                    title={
                        isEditingExistingUser()
                            ? "Chỉnh Sửa Người Dùng"
                            : "Thêm Người Dùng"
                    }
                >
                    <div className="flex flex-col space-y-3">
                        <label className="font-semibold">Tên Người Dùng</label>
                        <input
                            type="text"
                            value={editingUser?.username || ""}
                            onChange={(e) =>
                                setEditingUser((prev) =>
                                    prev
                                        ? { ...prev, username: e.target.value }
                                        : null
                                )
                            }
                            className="p-2 border rounded"
                            disabled={isEditingExistingUser()}
                        />

                        <label className="font-semibold">Họ Tên</label>
                        <input
                            type="text"
                            name="fullName"
                            value={editingUser?.fullName || ""}
                            onChange={(e) =>
                                setEditingUser((prev) =>
                                    prev
                                        ? { ...prev, fullName: e.target.value }
                                        : null
                                )
                            }
                            className="w-full p-2 border border-gray-300 rounded"
                        />

                        <label className="font-semibold">Email</label>
                        <input
                            type="email"
                            value={editingUser?.email || ""}
                            onChange={(e) =>
                                setEditingUser((prev) =>
                                    prev
                                        ? { ...prev, email: e.target.value }
                                        : null
                                )
                            }
                            className="p-2 border rounded"
                        />

                        <label className="font-semibold">Vai Trò</label>
                        <select
                            value={editingUser?.role || "User"}
                            onChange={(e) =>
                                setEditingUser((prev) =>
                                    prev
                                        ? { ...prev, role: e.target.value }
                                        : null
                                )
                            }
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
                            onChange={(e) =>
                                setEditingUser((prev) =>
                                    prev
                                        ? { ...prev, dob: e.target.value }
                                        : null
                                )
                            }
                            className="p-2 border rounded"
                        />

                        <label className="font-semibold">Số Điện Thoại</label>
                        <input
                            type="text"
                            value={editingUser?.phone || ""}
                            onChange={(e) =>
                                setEditingUser((prev) =>
                                    prev
                                        ? { ...prev, phone: e.target.value }
                                        : null
                                )
                            }
                            className="p-2 border rounded"
                        />

                        {!isEditingExistingUser() && (
                            <>
                                <label className="font-semibold">
                                    Mật Khẩu
                                </label>
                                <input
                                    type="password"
                                    onChange={(e) =>
                                        setEditingUser((prev) =>
                                            prev
                                                ? {
                                                      ...prev,
                                                      password: e.target.value,
                                                  }
                                                : null
                                        )
                                    }
                                    className="p-2 border rounded"
                                    placeholder="Nhập mật khẩu cho người dùng mới"
                                />
                            </>
                        )}
                    </div>
                </ManagementModal>
            </main>
        </div>
    );
}
