import React, { useState, useEffect } from "react";
import Sidebar from "../components/SideBarDashboard";
import ManagementModal from "../components/ManagementModal";
import {
    getAllTherapists,
    createTherapist,
    updateTherapist,
    deleteTherapist,
    disableTherapist,
    enableTherapist,
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
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [therapists, setTherapists] = useState<Therapist[]>([]);
    const [editingTherapist, setEditingTherapist] = useState<Therapist | null>(
        null
    );
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Fetch therapists data
    const fetchTherapists = async () => {
        setIsLoading(true);
        try {
            const therapistsData = await getAllTherapists();
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

    useEffect(() => {
        fetchTherapists();
    }, []);

    // Clear success message after 3 seconds
    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

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
    interface Therapist {
        id?: string;
        username: string;
        fullName: string;
        email: string;
        experienceYears: number;
        bio: string;
        dob: string;
        phone: string;
        img: string;
    }
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
    
        try {
            const imageUrl = selectedFile 
                ? `/uploads/${selectedFile.name}`
                : editingTherapist?.img || "";
    
            if (editingTherapist) {
                const experienceYears = parseInt(formData.get("experienceYears") as string || "0");
                const bio = formData.get("bio") as string || "";
                const phone = formData.get("phone") as string || "";
    
                // Kiểm tra số điện thoại trước khi gửi
                const phonePattern = /^\d{10}$/;
                if (!phonePattern.test(phone)) {
                    throw new Error("Số điện thoại phải gồm đúng 10 chữ số");
                }
    
                const updatedData = {
                    experienceYears,
                    bio,
                    phone,
                    img: imageUrl
                };
    
                console.log("Dữ liệu gửi đi:", { id: editingTherapist.id, ...updatedData });
    
                const success = await updateTherapist(
                    editingTherapist.id,
                    updatedData.experienceYears,
                    updatedData.bio,
                    updatedData.phone,
                    updatedData.img
                );
    
                if (success) {
                    await fetchTherapists();
                    setSuccessMessage("Cập nhật thông tin chuyên viên thành công");
                } else {
                    throw new Error("Cập nhật thất bại - Kiểm tra phản hồi từ server");
                }
            } else {
                // Logic tạo mới (giữ nguyên)
                const newTherapist: Therapist = {
                    username: formData.get("username") as string || "",
                    fullName: formData.get("fullName") as string || "",
                    email: formData.get("email") as string || "",
                    experienceYears: parseInt(formData.get("experienceYears") as string || "0"),
                    bio: formData.get("bio") as string || "",
                    dob: formData.get("dob") as string || "",
                    phone: formData.get("phone") as string || "",
                    img: imageUrl,
                };
    
                const phonePattern = /^\d{10}$/;
                if (!phonePattern.test(newTherapist.phone)) {
                    throw new Error("Số điện thoại phải gồm đúng 10 chữ số");
                }
    
                if (!newTherapist.username || !newTherapist.email) {
                    throw new Error("Thiếu các trường bắt buộc");
                }
    
                const success = await createTherapist(newTherapist);
                if (success) {
                    await fetchTherapists();
                    setSuccessMessage("Thêm chuyên viên mới thành công");
                } else {
                    throw new Error("Tạo mới thất bại");
                }
            }
        } catch (error) {
            console.error("Lỗi chi tiết khi lưu thông tin chuyên viên:", error);
            setError(
                error instanceof Error 
                    ? `Lỗi: ${error.message}` 
                    : "Đã xảy ra lỗi khi lưu thông tin chuyên viên"
            );
        } finally {
            closeModal();
        }
    };

    const handleToggleStatus = async (therapist: Therapist) => {
        const isDisabling = !therapist.disabled;
        const confirmMessage = isDisabling
            ? "Bạn có chắc chắn muốn vô hiệu hóa chuyên viên này?"
            : "Bạn có chắc chắn muốn kích hoạt lại chuyên viên này?";
            
        const confirmed = window.confirm(confirmMessage);
        
        if (!confirmed) return;
        
        try {
            let success;
            if (isDisabling) {
                success = await disableTherapist(therapist.id);
            } else {
                success = await enableTherapist(therapist.id);
            }
            
            if (success) {
                setTherapists((prev) =>
                    prev.map((t) =>
                        t.id === therapist.id
                            ? { ...t, disabled: isDisabling }
                            : t
                    )
                );
                
                setSuccessMessage(
                    isDisabling
                        ? "Đã vô hiệu hóa chuyên viên thành công"
                        : "Đã kích hoạt chuyên viên thành công"
                );
                setError(null);
            } else {
                setError(
                    isDisabling
                        ? "Không thể vô hiệu hóa chuyên viên"
                        : "Không thể kích hoạt chuyên viên"
                );
            }
        } catch (error) {
            console.error("Error toggling therapist status:", error);
            setError(
                isDisabling
                    ? "Đã xảy ra lỗi khi vô hiệu hóa chuyên viên"
                    : "Đã xảy ra lỗi khi kích hoạt chuyên viên"
            );
        }
    };

    const handleDelete = async (id: string) => {
        const therapist = therapists.find((t) => t.id === id);

        if (!therapist) {
            setError("Không tìm thấy thông tin chuyên viên");
            return;
        }

        if (!therapist.disabled) {
            setError(
                "Không thể xóa chuyên viên đang hoạt động. Vui lòng vô hiệu hóa trước khi xóa."
            );
            return;
        }

        const confirmDelete = window.confirm(
            "Bạn có chắc chắn muốn xóa chuyên viên này? Hành động này không thể hoàn tác."
        );
        
        if (!confirmDelete) return;
        
        try {
            setIsLoading(true);
            const success = await deleteTherapist(id);
            
            if (success) {
                setTherapists((prev) =>
                    prev.filter((therapist) => therapist.id !== id)
                );
                setSuccessMessage("Đã xóa chuyên viên thành công");
                setError(null);
            } else {
                setError("Không thể xóa chuyên viên");
            }
        } catch (error) {
            console.error("Error deleting therapist:", error);
            setError("Đã xảy ra lỗi khi xóa chuyên viên");
        } finally {
            setIsLoading(false);
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

                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        <p>{successMessage}</p>
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
                                                    <button
                                                        onClick={() =>
                                                            handleToggleStatus(therapist)
                                                        }
                                                        className={`${
                                                            therapist.disabled
                                                                ? "bg-green-500 hover:bg-green-600"
                                                                : "bg-yellow-500 hover:bg-yellow-600"
                                                        } text-white px-3 py-1 rounded`}
                                                    >
                                                        {therapist.disabled
                                                            ? "Kích Hoạt"
                                                            : "Vô Hiệu Hóa"}
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                therapist.id
                                                            )
                                                        }
                                                        className={`bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 ${
                                                            !therapist.disabled
                                                                ? "opacity-50 cursor-not-allowed"
                                                                : ""
                                                        }`}
                                                        disabled={
                                                            !therapist.disabled
                                                        }
                                                        title={
                                                            !therapist.disabled
                                                                ? "Vui lòng vô hiệu hóa chuyên viên trước khi xóa"
                                                                : "Xóa chuyên viên"
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