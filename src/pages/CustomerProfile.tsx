import { useState } from "react";
import { motion } from "framer-motion";

export default function Profile() {
    const [user, setUser] = useState({
        name: "Kiet Nguyen",
        email: "kietnguyen@gmail.com",
        phone: "123-456-7890",
        avatar: "/assets/avatar.png",
    });

    const [bookings, setBookings] = useState([
        {
            id: 1,
            service: "Điều Trị Mụn Chuyên Sâu 12 bước",
            date: "2025-02-25",
            status: "Đã Đặt",
        },
        {
            id: 2,
            service: "Thải Độc Da Thảo Dược",
            date: "2025-02-25",
            status: "Đã Đặt",
        },
    ]);

    const [activeTab, setActiveTab] = useState("Hồ Sơ");

    const handleCancelBooking = (id: number) => {
        if (window.confirm("Bạn có chắc chắn muốn huỷ lịch này?")) {
            setBookings(bookings.filter((booking) => booking.id !== id));
            alert("Huỷ lịch thành công!");
        }
    };

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setUser({ ...user, avatar: imageUrl });
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
                    {["Hồ Sơ", "Lịch Sử Đặt Lịch", "Cài Đặt & Bảo mật"].map(
                        (item) => (
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
                        )
                    )}
                </div>

                {/* Logout Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full mt-6 bg-red-500 text-white text-lg px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition"
                    onClick={() =>
                        window.confirm("Are you sure you want to log out?") &&
                        alert("Logged out!")
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
                            <div className="relative">
                                <img
                                    src={user.avatar}
                                    alt=""
                                    className="w-32 h-32 rounded-full border-4 border-gray-300 shadow-lg object-cover bg-white"
                                />
                                {/* Upload Avatar */}
                                <label className="absolute bottom-0 right-0 bg-pink-400 text-white p-2 rounded-full cursor-pointer hover:bg-pink-600 transition border-2 border-gray-200">
                                    📷
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarChange}
                                    />
                                </label>
                            </div>
                            <h2 className="mt-4 text-3xl font-bold text-gray-800">
                                {user.name}
                            </h2>
                            <p className="text-gray-500 text-lg">
                                {user.email}
                            </p>
                        </div>

                        {/* Profile Details */}
                        <div className="mt-8 space-y-6">
                            <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100 transition">
                                <span className="text-blue-500 text-xl">
                                    Email:
                                </span>
                                <span className="text-lg">{user.email}</span>
                            </div>
                            <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100 transition">
                                <span className="text-green-500 text-xl">
                                    Sđt:
                                </span>
                                <span className="text-lg">{user.phone}</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === "Lịch Sử Đặt Lịch" && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            📅 Lịch Sử Đặt Lịch
                        </h2>
                        {bookings.length > 0 ? (
                            <ul className="space-y-3">
                                {bookings.map((booking) => (
                                    <li
                                        key={booking.id}
                                        className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100 transition"
                                    >
                                        <div>
                                            <p className="text-gray-800 font-medium">
                                                {booking.service}
                                            </p>
                                            <p className="text-gray-500 text-sm">
                                                📆 {booking.date}
                                            </p>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition"
                                            onClick={() =>
                                                handleCancelBooking(booking.id)
                                            }
                                        >
                                            Huỷ
                                        </motion.button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">Chưa có lịch được đặt!</p>
                        )}
                    </motion.div>
                )}
            </motion.main>
        </div>
    );
}
