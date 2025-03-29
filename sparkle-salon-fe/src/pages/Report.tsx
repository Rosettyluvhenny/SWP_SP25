import React, { useState, useEffect } from "react";
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
import { Calendar, TrendingUp, BarChart as BarChartIcon } from "lucide-react";
import { getAllReport, Report } from "../data/reportData";

export default function Reports() {
    const [reportData, setReportData] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState({
        from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        to: new Date()
    });

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                const formattedFromDate = dateRange.from.toISOString().split('T')[0];
                const formattedToDate = dateRange.to.toISOString().split('T')[0];

                const data = await getAllReport(formattedFromDate, formattedToDate);
                setReportData(data);
                setIsLoading(false);
            } catch (err) {
                console.error("Error in fetchReportData:", err);
                setError("Failed to fetch report data");
                setIsLoading(false);
            }
        };

        fetchReportData();
    }, [dateRange]);

    const totalRevenue = reportData.reduce((sum, item) => sum + (item.revenue || 0), 0);
    const totalBooking = reportData.reduce((sum, item) => sum + (item.totalBooking || 0), 0);

    if (isLoading) {
        return (
            <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin mb-4 mx-auto w-16 h-16 border-t-4 border-blue-500 rounded-full"></div>
                    <p className="text-xl text-blue-700">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen bg-red-50 items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                    <p className="text-xl text-red-500 mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                        Báo Cáo & Thống Kê
                    </h1>
                    <div className="flex items-center space-x-4">
                        <Calendar className="text-gray-500" size={20} />
                        <span className="text-gray-600">
                            {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-pink-500 hover:shadow-lg transition">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-700">Tổng Doanh Thu</h2>
                            <TrendingUp className="text-green-500" size={24} />
                        </div>
                        <p className="text-3xl font-bold text-pink-600">
                            {totalRevenue.toLocaleString()} VND
                        </p>
                        <p className="text-sm text-gray-500 mt-2">Trong 7 ngày qua</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-700">Tổng Đơn Đặt</h2>
                            <BarChartIcon className="text-blue-500" size={24} />
                        </div>
                        <p className="text-3xl font-bold text-blue-600">
                            {totalBooking}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">Trong 7 ngày qua</p>
                    </div>
                </div>

                {/* Charts Container */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Revenue Line Chart */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
                            <TrendingUp className="mr-3 text-green-500" size={24} />
                            Biểu Đồ Doanh Thu
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={reportData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#f8f8f8', 
                                        borderRadius: '10px' 
                                    }} 
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#e6007e"
                                    strokeWidth={3}
                                    dot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Order Trends Bar Chart */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
                            <BarChartIcon className="mr-3 text-blue-500" size={24} />
                            Biểu Đồ Đặt Lịch
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={reportData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#f8f8f8', 
                                        borderRadius: '10px' 
                                    }} 
                                />
                                <Legend />
                                <Bar 
                                    dataKey="totalBooking" 
                                    fill="#ff4d4d" 
                                    radius={[10, 10, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </main>
        </div>
    );
}