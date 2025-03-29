import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getUser, updateUser } from "../data/authData";
import { toast } from "react-toastify";

export interface UserInfo {
    id: string;
    username: string;
    fullName: string;
    dob: string;
    email: string;
    phone: string;
}

export default function Profile() {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [activeTab, setActiveTab] = useState("Hồ Sơ");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUser();
            if (user) {
                setUserInfo(user);
            }
        };
        fetchUser();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserInfo((prev) => (prev ? { ...prev, [name]: value } : null));
    };

    //todo : nhắc BE thêm field id vào response
    const handleUpdate = async () => {
        console.log("🔹 Current userInfo before update:", userInfo);
    
        if (!userInfo || !userInfo.id) {
            console.error("❌ User ID is missing! Cannot update.");
            return;
        }
        
        const success = await updateUser(
            userInfo.id,  
            userInfo.fullName.trim(),
            userInfo.email.trim(),
            userInfo.phone.trim(),
            userInfo.dob
        );
    
        if (success) {
            toast.success("Cập nhật thành công!");
            setIsEditModalOpen(false);
        } else {
            toast.error("Lỗi khi cập nhật thông tin!");
        }
    };

    return (
        <div className="flex w-full min-h-screen bg-gradient-to-br from-pink-200 to-pink-400 mt-24 px-4">
            {/* Sidebar Section */}
            <motion.aside
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="w-1/4 bg-pink-100 bg-opacity-90 p-6 rounded-lg shadow-xl h-fit"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Trang Cá Nhân
                </h2>
                <div className="flex flex-col space-y-4">
                    {["Hồ Sơ"].map((item) => (
                        <button
                            key={item}
                            onClick={() => setActiveTab(item)}
                            className={`text-lg font-semibold p-3 rounded-lg transition ${
                                activeTab === item
                                    ? "bg-pink-500 text-white shadow-md"
                                    : "text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>

                {/* Logout Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full mt-6 bg-red-500 text-white text-lg px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition"
                    onClick={() =>
                        window.confirm("Are you sure you want to log out?") &&
                        toast.success("Logged out!")
                    }
                >
                    Đăng Xuất
                </motion.button>
            </motion.aside>

            {/* Main Content */}
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex-1 bg-pink-100 bg-opacity-90 border-l-2 p-10 rounded-lg shadow-xl ml-6"
            >
                {activeTab === "Hồ Sơ" && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Profile Header */}
                        <div className="relative mt-16 flex flex-col items-center text-center">
                            <h2 className="mt-4 text-3xl font-bold text-gray-800">
                                {userInfo?.username}
                            </h2>
                            <p className="text-gray-500 text-lg">
                                {userInfo?.fullName}
                            </p>
                            <p className="text-gray-500 text-lg">
                                {userInfo?.email}
                            </p>

                            {/* Edit Button */}
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-lg shadow-md hover:bg-pink-600 transition"
                            >
                                Chỉnh Sửa
                            </button>
                        </div>

                        {/* Profile Details */}
                        <div className="mt-8 space-y-6">
                            <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100 transition">
                                <span className="text-blue-500 text-xl">
                                    Email:
                                </span>
                                <span className="text-lg">
                                    {userInfo?.email}
                                </span>
                            </div>
                            <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100 transition">
                                <span className="text-green-500 text-xl">
                                    Sđt:
                                </span>
                                <span className="text-lg">
                                    {userInfo?.phone}
                                </span>
                            </div>
                            <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100 transition">
                                <span className="text-blue-500 text-xl">
                                    Ngày Sinh:
                                </span>
                                <span className="text-lg">{userInfo?.dob}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </motion.main>
            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">
                            Cập Nhật Thông Tin
                        </h2>
                        <input
                            type="text"
                            name="fullName"
                            value={userInfo?.fullName || ""}
                            onChange={handleInputChange}
                            placeholder="Họ và Tên"
                            className="w-full p-2 border rounded mb-2"
                        />
                        <input
                            type="date"
                            name="dob"
                            value={userInfo?.dob || ""}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded mb-2"
                        />
                        <input
                            type="email"
                            name="email"
                            value={userInfo?.email || ""}
                            onChange={handleInputChange}
                            placeholder="Email"
                            className="w-full p-2 border rounded mb-2"
                        />
                        <input
                            type="text"
                            name="phone"
                            value={userInfo?.phone || ""}
                            onChange={handleInputChange}
                            placeholder="Số điện thoại"
                            className="w-full p-2 border rounded mb-4"
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
