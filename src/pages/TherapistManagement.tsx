import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBarDashboard";
import ManagementModal from "../components/ManagementModal";
import {
    getTherapists,
    createTherapist,
    updateTherapist,
    deleteTherapist,
    disableTherapist,
} from "../data/therapistData";

interface Therapist {
    id: string;
    username: string;
    fullName: string;
    email: string;
    experienceYears: number;
    bio: string;
    dob: string;
    phone: string;
    img: string;
    disabled: boolean;
}

export default function TherapistManagement() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [therapists, setTherapists] = useState<Therapist[]>([]);
    const [editingTherapist, setEditingTherapist] = useState<Therapist | null>(
        null
    );
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchTherapists = async () => {
            setIsLoading(true);
            try {
                const therapistsData = await getTherapists();
                console.log("API Response:", therapistsData);
                setTherapists(therapistsData);
                setError(null);
            } catch (error) {
                console.error("Error fetching therapists:", error);
                setError(
                    "Không thể tải danh sách chuyên viên. Vui lòng thử lại sau."
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchTherapists();
    }, []);

    const openModal = (therapist: Therapist | null = null) => {
        setEditingTherapist(therapist);
        setSelectedFile(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTherapist(null);
        setSelectedFile(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);

        try {
            let imageUrl = editingTherapist?.img || "";
            if (selectedFile) {
                imageUrl = `/uploads/${selectedFile.name}`;
            }

            if (editingTherapist) {
                const experienceYears = parseInt(
                    formData.get("experienceYears") as string
                );
                const bio = formData.get("bio") as string;
                const phone = formData.get("phone") as string;

                const success = await updateTherapist(
                    editingTherapist.id,
                    experienceYears,
                    bio,
                    phone,
                    imageUrl
                );

                if (success) {
                    setTherapists((prev) =>
                        prev.map((t) =>
                            t.id === editingTherapist.id
                                ? {
                                      ...t,
                                      experienceYears,
                                      bio,
                                      phone,
                                      img: imageUrl,
                                  }
                                : t
                        )
                    );
                } else {
                    setError("Không thể cập nhật thông tin chuyên viên");
                }
            } else {
                const newTherapist = {
                    username: formData.get("username") as string,
                    fullName: formData.get("fullName") as string,
                    email: formData.get("email") as string,
                    experienceYears: parseInt(
                        formData.get("experienceYears") as string
                    ),
                    bio: formData.get("bio") as string,
                    dob: formData.get("dob") as string,
                    phone: formData.get("phone") as string,
                    img: imageUrl,
                };

                const success = await createTherapist(newTherapist);
                if (success) {
                    const updatedTherapists = await getTherapists();
                    setTherapists(updatedTherapists);
                } else {
                    setError("Không thể thêm chuyên viên mới");
                }
            }
        } catch (error) {
            console.error("Error saving therapist:", error);
            setError("Đã xảy ra lỗi khi lưu thông tin chuyên viên");
        }

        closeModal();
    };

    const handleDisable = async (id: string) => {
        const confirmDisable = window.confirm(
            "Bạn có chắc chắn muốn vô hiệu hóa chuyên viên này?"
        );
        if (confirmDisable) {
            try {
                const success = await disableTherapist(id);
                if (success) {
                    setTherapists((prev) =>
                        prev.map((therapist) =>
                            therapist.id === id
                                ? { ...therapist, disabled: true }
                                : therapist
                        )
                    );
                    setError(null);
                } else {
                    setError("Không thể vô hiệu hóa chuyên viên");
                }
            } catch (error) {
                console.error("Error disabling therapist:", error);
                setError("Đã xảy ra lỗi khi vô hiệu hóa chuyên viên");
            }
        }
    };

    const handleDelete = async (id: string) => {
        const therapist = therapists.find((t) => t.id === id);

        if (!therapist?.disabled) {
            setError(
                "Không thể xóa chuyên viên chưa bị vô hiệu hóa. Vui lòng vô hiệu hóa trước."
            );
            return;
        }

        const confirmDelete = window.confirm(
            "Bạn có chắc chắn muốn xóa chuyên viên này?"
        );
        if (confirmDelete) {
            try {
                const success = await deleteTherapist(id);
                if (success) {
                    setTherapists((prev) =>
                        prev.filter((therapist) => therapist.id !== id)
                    );
                    setError(null);
                } else {
                    setError("Không thể xóa chuyên viên");
                }
            } catch (error) {
                console.error("Error deleting therapist:", error);
                setError("Đã xảy ra lỗi khi xóa chuyên viên");
            }
        }
    };

    return (
        <div className="flex h-screen bg-white">
            <Sidebar />
            <main className="flex-1 p-6">
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Quản Lý chuyên viên
                    </h1>
                    <button
                        onClick={() => openModal()}
                        className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600"
                    >
                        + Thêm chuyên viên
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <p>{error}</p>
                    </div>
                )}

                <div className="bg-pink-100 shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Danh Sách chuyên viên
                    </h2>
                    {isLoading ? (
                        <div className="text-center py-4">Đang tải...</div>
                    ) : (
                        <div className="overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-pink-300 scrollbar-track-pink-100">
                            <table className="w-full border-collapse rounded-lg overflow-hidden">
                                <thead className="sticky top-0 bg-white shadow-md">
                                    <tr className="bg-white text-black">
                                        <th className="p-3 text-left">
                                            Họ Tên
                                        </th>
                                        <th className="p-3 text-left">Email</th>
                                        <th className="p-3 text-left">
                                            Số Điện Thoại
                                        </th>
                                        <th className="p-3 text-left">
                                            Kinh Nghiệm (năm)
                                        </th>
                                        <th className="p-3 text-left">
                                            Trạng Thái
                                        </th>
                                        <th className="p-3 text-left">
                                            Hành Động
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    {therapists.length > 0 ? (
                                        therapists.map((therapist) => (
                                            <tr
                                                key={therapist.id}
                                                className="border-t"
                                            >
                                                <td className="p-3">
                                                    {therapist.fullName}
                                                </td>
                                                <td className="p-3">
                                                    {therapist.email}
                                                </td>
                                                <td className="p-3">
                                                    {therapist.phone}
                                                </td>
                                                <td className="p-3">
                                                    {therapist.experienceYears}
                                                </td>
                                                <td className="p-3">
                                                    <span
                                                        className={`px-2 py-1 rounded ${
                                                            therapist.disabled
                                                                ? "bg-red-100 text-red-800"
                                                                : "bg-green-100 text-green-800"
                                                        }`}
                                                    >
                                                        {therapist.disabled
                                                            ? "Vô hiệu hóa"
                                                            : "Hoạt động"}
                                                    </span>
                                                </td>
                                                <td className="p-3 flex space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            openModal(therapist)
                                                        }
                                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                                    >
                                                        Chỉnh Sửa
                                                    </button>
                                                    {!therapist.disabled && (
                                                        <button
                                                            onClick={() =>
                                                                handleDisable(
                                                                    therapist.id
                                                                )
                                                            }
                                                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                                        >
                                                            Vô Hiệu Hóa
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                therapist.id
                                                            )
                                                        }
                                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                                                        disabled={
                                                            !therapist.disabled
                                                        }
                                                    >
                                                        Xóa
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr key="no-data">
                                            <td
                                                colSpan={6}
                                                className="p-3 text-center"
                                            >
                                                Không có chuyên viên nào
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            <ManagementModal
                isOpen={isModalOpen}
                title={
                    editingTherapist
                        ? "Chỉnh Sửa chuyên viên"
                        : "Thêm chuyên viên"
                }
                onClose={closeModal}
                onSubmit={handleSubmit}
            >
                <div className="space-y-4">
                    {!editingTherapist && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên người dùng
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Tên người dùng"
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Họ và tên
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    placeholder="Họ và tên"
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ngày sinh
                                </label>
                                <input
                                    type="date"
                                    name="dob"
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                        </>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Số năm kinh nghiệm
                        </label>
                        <input
                            type="number"
                            name="experienceYears"
                            defaultValue={
                                editingTherapist?.experienceYears || ""
                            }
                            placeholder="Số năm kinh nghiệm"
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tiểu sử
                        </label>
                        <textarea
                            name="bio"
                            defaultValue={editingTherapist?.bio || ""}
                            placeholder="Tiểu sử"
                            className="w-full p-2 border rounded"
                            rows={3}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Số điện thoại
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            defaultValue={editingTherapist?.phone || ""}
                            placeholder="Số điện thoại"
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hình ảnh
                        </label>
                        <input
                            type="file"
                            name="img"
                            onChange={handleFileChange}
                            className="w-full p-2 border rounded"
                            accept="image/*"
                        />
                        {editingTherapist?.img && !selectedFile && (
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    Ảnh hiện tại:{" "}
                                    {editingTherapist.img.split("/").pop()}
                                </p>
                                <img
                                    src={editingTherapist.img}
                                    alt="Therapist"
                                    className="mt-2 h-20 object-cover rounded"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            "https://via.placeholder.com/150";
                                    }}
                                />
                            </div>
                        )}
                        {selectedFile && (
                            <p className="mt-2 text-sm text-gray-500">
                                Đã chọn: {selectedFile.name}
                            </p>
                        )}
                    </div>
                </div>
            </ManagementModal>
        </div>
    );
}
