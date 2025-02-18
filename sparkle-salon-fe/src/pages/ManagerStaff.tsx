import React from "react";
import RevenueChart from "../components/RevenueChart";
import Sidebar from "../components/SideBarDashboard";

export default function ManagerStaff() {
    return (
        <div className="flex h-screen bg-white">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-auto">
                <div className="mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Dashboard
                    </h1>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gradient-to-bl from-pink-200 to-pink-300 p-6 rounded-lg shadow-lg text-white">
                        <h2 className="text-xl font-semibold">
                            Lượng Người Dùng
                        </h2>
                        <p className="text-2xl mt-2 font-bold">1,200</p>
                    </div>
                    <div className="bg-gradient-to-tr from-pink-200 to-pink-300 p-6 rounded-lg shadow-lg text-white">
                        <h2 className="text-xl font-semibold">Đơn đặt</h2>
                        <p className="text-2xl mt-2 font-bold">350</p>
                    </div>
                    <div className="bg-gradient-to-br from-pink-200 to-pink-300 p-6 rounded-lg shadow-lg text-white">
                        <h2 className="text-xl font-semibold">Doanh Thu</h2>
                        <p className="text-2xl mt-2 font-bold">
                            12,540,000,000 vnđ
                        </p>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-pink-100 shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Đang Đặt</h2>
                    <table className="w-full border-collapse rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-white text-black">
                                <th className="p-3 text-left">Order ID</th>
                                <th className="p-3 text-left">Khách Hàng</th>
                                <th className="p-3 text-left">Trạng Thái</th>
                                <th className="p-3 text-left">Số Tiền(VND)</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            <tr className="border-t">
                                <td className="p-3">#001</td>
                                <td className="p-3">Nguyễn Văn A</td>
                                <td className="p-3 text-green-600">Đã Đặt</td>
                                <td className="p-3">250.000</td>
                            </tr>
                            <tr className="border-t">
                                <td className="p-3">#002</td>
                                <td className="p-3">Nguyễn Văn B</td>
                                <td className="p-3 text-yellow-600">
                                    Đang Đặt
                                </td>
                                <td className="p-3">120.000</td>
                            </tr>
                            <tr className="border-t">
                                <td className="p-3">#003</td>
                                <td className="p-3">Nguyễn Văn C</td>
                                <td className="p-3 text-red-600">Đã Huỷ</td>
                                <td className="p-3">75.000</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Revenue Chart */}
                
            </main>
        </div>
    );
}
