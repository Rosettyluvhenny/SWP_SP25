import React, { useState } from "react";
import Sidebar from "../components/SideBarDashboard";

export default function ManagerStaff() {
    const [searchTerm, setSearchTerm] = useState("");
    const [checkTimes, setCheckTimes] = useState<{ [key: string]: { checkIn: string | null, checkOut: string | null } }>({});
    const [selectedStaff, setSelectedStaff] = useState<{ [key: string]: string }>({});
    
    
    
    const staffMembers = ["Chuyên viên A", "Chuyên viên B", "Chuyên viên C"];
    
    const getCurrentTime = () => {
        const now = new Date();
        return now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    };

    const handleCheckIn = (orderId: string) => {
        setCheckTimes((prev) => ({ 
            ...prev, 
            [orderId]: prev[orderId]?.checkIn ? prev[orderId] : { checkIn: getCurrentTime(), checkOut: prev[orderId]?.checkOut || null }
        }));
    };

    const handleCheckOut = (orderId: string) => {
        setCheckTimes((prev) => ({ 
            ...prev, 
            [orderId]: prev[orderId]?.checkOut ? prev[orderId] : { checkIn: prev[orderId]?.checkIn || null, checkOut: getCurrentTime() }
        }));
    };

    const handleSelectStaff = (orderId: string, staff: string) => {
        setSelectedStaff((prev) => ({ ...prev, [orderId]: staff }));
    };

    const orders = [
        { id: "#001", customer: "Nguyễn Văn A", date: "2025-02-16", total: "250.000" },
        { id: "#002", customer: "Nguyễn Văn B", date: "2025-02-15", total: "120.000" },
        { id: "#003", customer: "Nguyễn Văn C", date: "2025-02-14", total: "75.000" },
        { id: "#004", customer: "Nguyễn Thị D", date: "2025-02-13", total: "300.000" },
    ];

    return (
        <div className="flex h-screen bg-white">
            <Sidebar />
            <main className="flex-1 p-6">
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Quản Lý Đơn Hàng</h1>
                    <button className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600">
                        + Thêm Đơn Hàng
                    </button>
                </div>

                <div className="mb-6 flex justify-between items-center bg-pink-100 p-4 rounded-lg shadow">
                    <input
                        type="text"
                        placeholder="Tìm kiếm đơn hàng..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                </div>

                <div className="bg-pink-100 shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Danh Sách Đơn Hàng</h2>
                    <table className="w-full border-collapse rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-white text-black">
                                <th className="p-3 text-left">Mã Đơn</th>
                                <th className="p-3 text-left">Khách Hàng</th>
                                <th className="p-3 text-left">Ngày Đặt</th>
                                <th className="p-3 text-left">Tổng Tiền(VND)</th>
                                <th className="p-3 text-left">Giờ Check-in</th>
                                <th className="p-3 text-left">Giờ Check-out</th>
                                <th className="p-3 text-left">Chuyên Viên</th>
                                <th className="p-3 text-left">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {orders.map((order) => (
                                <tr key={order.id} className="border-t">
                                    <td className="p-3">{order.id}</td>
                                    <td className="p-3">{order.customer}</td>
                                    <td className="p-3">{order.date}</td>
                                    <td className="p-3">{order.total}</td>
                                    <td className="p-3">{checkTimes[order.id]?.checkIn || "Chưa Check-in"}</td>
                                    <td className="p-3">{checkTimes[order.id]?.checkOut || "Chưa Check-out"}</td>
                                    <td className="p-3">
                                        <select onChange={(e) => handleSelectStaff(order.id, e.target.value)} value={selectedStaff[order.id] || ""} className="border p-2 rounded">
                                            <option value="">Chọn chuyên viên</option>
                                            {staffMembers.map((staff) => (
                                                <option key={staff} value={staff}>{staff}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="p-3 flex space-x-2">
                                        <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600" onClick={() => handleCheckIn(order.id)} disabled={!!checkTimes[order.id]?.checkIn}>Check-in</button>
                                        <button className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600" onClick={() => handleCheckOut(order.id)} disabled={!!checkTimes[order.id]?.checkOut}>Check-out</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
