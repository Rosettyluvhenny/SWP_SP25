import React from "react";
import Sidebar from "../components/SideBarDashboard";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend,
} from "recharts";

export default function Reports() {
    // Revenue Data for Line Chart
    const revenueData = [
        { date: "Feb 10", revenue: 750000 },
        { date: "Feb 11", revenue: 820000 },
        { date: "Feb 12", revenue: 900000 },
        { date: "Feb 13", revenue: 870000 },
        { date: "Feb 14", revenue: 1100000 },
        { date: "Feb 15", revenue: 1200000 },
        { date: "Feb 16", revenue: 1254000 },
        
    ];

    // Order Data for Bar Chart
    const orderData = [
        { date: "Feb 10", orders: 22 },
        { date: "Feb 11", orders: 25 },
        { date: "Feb 12", orders: 30 },
        { date: "Feb 13", orders: 28 },
        { date: "Feb 14", orders: 38 },
        { date: "Feb 15", orders: 40 },
        { date: "Feb 16", orders: 45 },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 p-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">
                    Báo Cáo & Thống Kê
                </h1>

                {/* Dashboard Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-gradient-to-r from-pink-200 to-pink-300 p-6 rounded-lg shadow-md text-center">
                        <h2 className="text-lg font-semibold">Doanh Thu</h2>
                        <p className="text-2xl font-bold">12,540,000 VND</p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-200 to-blue-300 p-6 rounded-lg shadow-md text-center">
                        <h2 className="text-lg font-semibold">Đơn Đặt</h2>
                        <p className="text-2xl font-bold">350</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-200 to-green-300 p-6 rounded-lg shadow-md text-center">
                        <h2 className="text-lg font-semibold">Khách Hàng</h2>
                        <p className="text-2xl font-bold">1,200</p>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-200 to-yellow-300 p-6 rounded-lg shadow-md text-center">
                        <h2 className="text-lg font-semibold">Dịch Vụ</h2>
                        <p className="text-2xl font-bold">25</p>
                    </div>
                </div>

                {/* Revenue Line Chart */}
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Biểu Đồ Doanh Thu
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#e6007e"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Order Trends Bar Chart */}
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Xu Hướng Đơn Hàng
                    </h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={orderData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="orders" fill="#ff4d4d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </main>
        </div>
    );
}
