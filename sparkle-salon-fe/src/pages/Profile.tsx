import { useState } from "react";
import { motion } from "framer-motion";

export default function Profile() {
    const [user, setUser] = useState({
        name: "Jane Doe",
        email: "jane.doe@example.com",
        phone: "123-456-7890",
        avatar: "/assets/default-avatar.png",
    });

    const [bookings, setBookings] = useState([
        {
            id: 1,
            service: "Haircut & Styling",
            date: "2025-03-10",
            status: "Confirmed",
        },
        {
            id: 2,
            service: "Manicure & Pedicure",
            date: "2025-03-15",
            status: "Pending",
        },
    ]);

    const [activeTab, setActiveTab] = useState("Profile");

    const handleCancelBooking = (id: number) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            setBookings(bookings.filter((booking) => booking.id !== id));
            alert("Booking canceled successfully!");
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
            {/* Sidebar */}
            <motion.aside
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="w-1/4 bg-white bg-opacity-90 p-6 rounded-lg shadow-xl h-fit"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    👤 Profile Menu
                </h2>
                <div className="flex flex-col space-y-4">
                    {["Profile", "Booking History", "Security Settings"].map(
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
                    🔒 Logout
                </motion.button>
            </motion.aside>

            {/* Main Content */}
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex-1 bg-white bg-opacity-90 border-l-2 p-10 rounded-lg shadow-xl ml-6"
            >
                {activeTab === "Profile" && (
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
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full border-4 border-gray-300 shadow-lg object-cover bg-white"
                                />
                                {/* Upload Avatar */}
                                <label className="absolute bottom-2 right-2 bg-pink-500 text-white p-2 rounded-full cursor-pointer hover:bg-pink-600 transition">
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
                                    📧
                                </span>
                                <span className="text-lg">{user.email}</span>
                            </div>
                            <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100 transition">
                                <span className="text-green-500 text-xl">
                                    📞
                                </span>
                                <span className="text-lg">{user.phone}</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === "Booking History" && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            📅 Booking History
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
                                            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                                            onClick={() =>
                                                handleCancelBooking(booking.id)
                                            }
                                        >
                                            ❌ Cancel
                                        </motion.button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No bookings found.</p>
                        )}
                    </motion.div>
                )}
            </motion.main>
        </div>
    );
}
