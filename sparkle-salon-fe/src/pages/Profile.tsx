import { useState } from "react";
import { motion } from "framer-motion";

export default function Profile() {
    // Mock user data
    const [user, setUser] = useState({
        name: "Jane Doe",
        email: "jane.doe@example.com",
        phone: "123-456-7890",
        avatar: "/assets/default-avatar.png",
    });

    // Mock booking history
    const [bookings, setBookings] = useState([
        { id: 1, service: "Haircut & Styling", date: "2025-03-10", status: "Confirmed" },
        { id: 2, service: "Manicure & Pedicure", date: "2025-03-15", status: "Pending" },
    ]);

    // Navigation State
    const [activeTab, setActiveTab] = useState("Profile");

    // Handle Cancel Booking
    const handleCancelBooking = (id: number) => {
        if (window.confirm("Are you sure you want to cancel this booking?")) {
            setBookings(bookings.filter((booking) => booking.id !== id));
            alert("Booking canceled successfully!");
        }
    };

    // Avatar Upload
    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setUser({ ...user, avatar: imageUrl });
        }
    };

    return (
        <div className="flex w-full h-screen bg-gradient-to-br from-pink-100 to-pink-300">

            {/* Sidebar Section */}
            <motion.aside
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="w-1/4 bg-white bg-opacity-80 backdrop-blur-lg shadow-xl p-6 flex flex-col space-y-6 rounded-r-xl"
            >
                <h2 className="text-2xl font-bold text-gray-800">Menu</h2>

                {/* Sidebar Navigation */}
                <div className="flex flex-col space-y-4">
                    {["Profile", "Booking History", "Security Settings"].map((item) => (
                        <button
                            key={item}
                            onClick={() => setActiveTab(item)}
                            className={`text-lg font-semibold p-3 rounded-lg transition ${
                                activeTab === item ? "bg-pink-500 text-white shadow-lg" : "text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                            {item === "Profile" && "👤 "}
                            {item === "Booking History" && "📅 "}
                            {item === "Security Settings" && "🔒 "}
                            {item}
                        </button>
                    ))}
                </div>

                {/* Logout Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-red-500 text-white text-lg px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition"
                    onClick={() => window.confirm("Are you sure you want to log out?") && alert("Logged out!")}
                >
                    🔒 Logout
                </motion.button>
            </motion.aside>

            {/* Main Content */}
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex-1 bg-white bg-opacity-80 backdrop-blur-lg shadow-2xl rounded-l-2xl p-10"
            >
                {activeTab === "Profile" && (
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
                        {/* Profile Header */}
                        <div className="flex flex-col items-center">
                            <div className="relative w-32 h-32">
                                <img
                                    src={user.avatar}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full border-4 border-gray-300 shadow-lg object-cover"
                                />
                                {/* Upload Avatar */}
                                <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition">
                                    📷
                                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                                </label>
                            </div>
                            <h2 className="mt-4 text-3xl font-bold text-gray-800">{user.name}</h2>
                            <p className="text-gray-500 text-lg">{user.email}</p>
                        </div>

                        {/* Profile Details */}
                        <div className="mt-8 space-y-6 text-gray-700">
                            <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100 transition">
                                <span className="text-blue-500 text-xl">📧</span>
                                <span className="text-lg">{user.email}</span>
                            </div>
                            <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100 transition">
                                <span className="text-green-500 text-xl">📞</span>
                                <span className="text-lg">{user.phone}</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === "Booking History" && (
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">📅 Booking History</h2>
                        {bookings.length > 0 ? (
                            <ul className="space-y-3">
                                {bookings.map((booking) => (
                                    <li key={booking.id} className="bg-gray-50 p-4 rounded-lg shadow-md flex justify-between items-center">
                                        <div>
                                            <p className="text-gray-800 font-medium">{booking.service}</p>
                                            <p className="text-gray-500 text-sm">📆 {booking.date}</p>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                                            onClick={() => handleCancelBooking(booking.id)}
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
