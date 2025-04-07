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
import {
    Calendar,
    TrendingUp,
    BarChart as BarChartIcon,
    CreditCard,
    Clock,
    Users,
    Wallet,
} from "lucide-react";
import { getAllReport, getAllReceipt, Report, Receipt } from "../data/reportData";

export default function Reports() {
    const [reportData, setReportData] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState({
        from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        to: new Date(),
    });
    const [activeTab, setActiveTab] = useState<"dashboard" | "transactions">(
        "dashboard"
    );
    const [allReceipts, setAllReceipts] = useState<Receipt[]>([]);
    const [isLoadingReceipts, setIsLoadingReceipts] = useState(false);

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                const formattedFromDate = dateRange.from
                    .toISOString()
                    .split("T")[0];
                const formattedToDate = dateRange.to
                    .toISOString()
                    .split("T")[0];

                const data = await getAllReport(
                    formattedFromDate,
                    formattedToDate
                );
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

    useEffect(() => {
        const fetchReceiptData = async () => {
            if (activeTab !== "transactions") return;

            setIsLoadingReceipts(true);
            try {
                const formattedFromDate = dateRange.from
                    .toISOString()
                    .split("T")[0];
                const formattedToDate = dateRange.to
                    .toISOString()
                    .split("T")[0];
                    
                const receipts = await getAllReceipt(
                    formattedFromDate,
                    formattedToDate
                );

                // Sort receipts by date, newest first
                receipts.sort(
                    (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                setAllReceipts(receipts);
                setIsLoadingReceipts(false);
            } catch (err) {
                console.error("Error fetching receipt data:", err);
                setIsLoadingReceipts(false);
            }
        };

        fetchReceiptData();
    }, [activeTab, dateRange]);

    const handleDateChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "from" | "to"
    ) => {
        const newDate = e.target.value ? new Date(e.target.value) : new Date();
        setDateRange((prev) => ({
            ...prev,
            [type]: newDate,
        }));
    };

    const totalRevenue = reportData.reduce(
        (sum, item) => sum + (item.revenue || 0),
        0
    );
    const totalBooking = reportData.reduce(
        (sum, item) => sum + (item.totalBooking || 0),
        0
    );

    // Transaction stats calculation
    const totalTransactionAmount = allReceipts.reduce(
        (sum, receipt) => sum + (receipt.amount || 0),
        0
    );
    const totalTransactions = allReceipts.length;

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

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

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
                            {dateRange.from.toLocaleDateString()} -{" "}
                            {dateRange.to.toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* Date Selection Section - Used for both tabs */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                        <Calendar
                            className="mr-2 text-pink-500"
                            size={20}
                        />
                        Chọn Khoảng Thời Gian
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label
                                htmlFor="fromDate"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Từ Ngày
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="date"
                                    id="fromDate"
                                    value={
                                        dateRange.from
                                            .toISOString()
                                            .split("T")[0]
                                    }
                                    onChange={(e) =>
                                        handleDateChange(e, "from")
                                    }
                                    className="block w-full pl-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="toDate"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Đến Ngày
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="date"
                                    id="toDate"
                                    value={
                                        dateRange.to
                                            .toISOString()
                                            .split("T")[0]
                                    }
                                    onChange={(e) =>
                                        handleDateChange(e, "to")
                                    }
                                    className="block w-full pl-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-md">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            <button
                                onClick={() => setActiveTab("dashboard")}
                                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                                    activeTab === "dashboard"
                                        ? "border-pink-500 text-pink-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                } transition duration-150 ease-in-out flex items-center`}
                            >
                                <BarChartIcon className="mr-2" size={18} />
                                Tổng Doang Thu
                            </button>
                            <button
                                onClick={() => setActiveTab("transactions")}
                                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                                    activeTab === "transactions"
                                        ? "border-pink-500 text-pink-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                } transition duration-150 ease-in-out flex items-center`}
                            >
                                <CreditCard className="mr-2" size={18} />
                                Lịch Sử Giao Dịch
                            </button>
                        </nav>
                    </div>
                </div>

                {activeTab === "dashboard" && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-pink-500 hover:shadow-lg transition">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold text-gray-700">
                                        Tổng Doanh Thu
                                    </h2>
                                    <TrendingUp
                                        className="text-green-500"
                                        size={24}
                                    />
                                </div>
                                <p className="text-3xl font-bold text-pink-600">
                                    {totalRevenue.toLocaleString()} VND
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    {dateRange.from.toLocaleDateString()} -{" "}
                                    {dateRange.to.toLocaleDateString()}
                                </p>
                            </div>

                            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold text-gray-700">
                                        Tổng Lịch Đặt
                                    </h2>
                                    <BarChartIcon
                                        className="text-blue-500"
                                        size={24}
                                    />
                                </div>
                                <p className="text-3xl font-bold text-blue-600">
                                    {totalBooking}
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    {dateRange.from.toLocaleDateString()} -{" "}
                                    {dateRange.to.toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Revenue Line Chart */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
                                    <TrendingUp
                                        className="mr-3 text-green-500"
                                        size={24}
                                    />
                                    Biểu Đồ Doanh Thu
                                </h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={reportData}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#f0f0f0"
                                        />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#f8f8f8",
                                                borderRadius: "10px",
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
                                    <BarChartIcon
                                        className="mr-3 text-blue-500"
                                        size={24}
                                    />
                                    Biểu Đồ Đặt Lịch
                                </h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={reportData}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#f0f0f0"
                                        />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#f8f8f8",
                                                borderRadius: "10px",
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
                    </>
                )}

                {activeTab === "transactions" && (
                    <>
                        {/* Transaction stats cards - similar to dashboard */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold text-gray-700">
                                        Tổng Giá Trị Giao Dịch
                                    </h2>
                                    <Wallet
                                        className="text-purple-500"
                                        size={24}
                                    />
                                </div>
                                <p className="text-3xl font-bold text-purple-600">
                                    {totalTransactionAmount.toLocaleString()}{" "}
                                    VND
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    {dateRange.from.toLocaleDateString()} -{" "}
                                    {dateRange.to.toLocaleDateString()}
                                </p>
                            </div>

                            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-semibold text-gray-700">
                                        Số Lượng Giao Dịch
                                    </h2>
                                    <CreditCard
                                        className="text-green-500"
                                        size={24}
                                    />
                                </div>
                                <p className="text-3xl font-bold text-green-600">
                                    {totalTransactions}
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    {dateRange.from.toLocaleDateString()} -{" "}
                                    {dateRange.to.toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* Detail */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-6">
                                <h2 className="text-xl font-semibold mb-6 text-gray-700 flex items-center">
                                    <Users
                                        className="mr-3 text-purple-500"
                                        size={24}
                                    />
                                    Chi Tiết Giao Dịch
                                </h2>
                            </div>

                            {/* Transaction table */}
                            {isLoadingReceipts ? (
                                <div className="p-12 text-center">
                                    <div className="animate-spin mb-4 mx-auto w-12 h-12 border-t-4 border-pink-500 rounded-full"></div>
                                    <p className="text-gray-500">
                                        Đang tải dữ liệu giao dịch...
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Thời Gian
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Khách Hàng
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Dịch Vụ
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Số Tiền
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    P.Thức Thanh Toán
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Loại Thanh Toán
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Nhân Viên
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {allReceipts.length > 0 ? (
                                                allReceipts.map((receipt) => (
                                                    <tr
                                                        key={receipt.id}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <div className="flex items-center">
                                                                <Clock
                                                                    size={16}
                                                                    className="mr-2 text-gray-400"
                                                                />
                                                                {formatDateTime(
                                                                    receipt.date
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {
                                                                receipt.customerName
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {
                                                                receipt.serviceName
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                                            {receipt.amount?.toLocaleString()}{" "}
                                                            VND
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {
                                                                receipt.paymentMethod
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <span
                                                                className={`px-2 py-1 text-xs rounded-full ${
                                                                    receipt.paymentType ===
                                                                    "Deposit"
                                                                        ? "bg-yellow-100 text-yellow-800"
                                                                        : "bg-green-100 text-green-800"
                                                                }`}
                                                            >
                                                                {
                                                                    receipt.paymentType
                                                                }
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {receipt.staffName}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan={8}
                                                        className="px-6 py-4 text-center text-sm text-gray-500"
                                                    >
                                                        Không có dữ liệu giao
                                                        dịch trong khoảng thời gian này
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}