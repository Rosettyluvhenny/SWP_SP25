import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    FiUsers,
    FiShoppingCart,
    FiDollarSign,
    FiBarChart2,
    FiMenu,
} from "react-icons/fi";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <aside
            className={`bg-gray-900 text-white p-5 flex flex-col space-y-4 shadow-lg transition-all duration-300 h-100% ${
                isOpen ? "w-64" : "w-20"
            }`}
        >
            {/* Toggle Button */}
            <button
                className="text-white text-2xl mb-2 focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <FiMenu />
            </button>

            <h2
                className={`text-xl font-bold text-center transition-all ${
                    isOpen ? "block" : "hidden"
                }`}
            >
                Manager Panel
            </h2>
            <nav>
                <ul className="space-y-3">
                    {/* User Management */}
                    <Link
                        to="/manager/user"
                        className={`${isOpen ? "block" : "hidden"}`}
                    >
                        <li className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-lg">
                            <FiUsers />
                            Quản Lý Người Dùng
                        </li>
                    </Link>

                    {/* Service Management */}
                    <Link
                        to="/manager/service"
                        className={`${isOpen ? "block" : "hidden"}`}
                    >
                        <li className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-lg">
                            <FiShoppingCart />
                            Quản Lý Dịch Vụ
                        </li>
                    </Link>

                    {/* Orders Management */}
                    <Link
                        to="/manager/order"
                        className={`${isOpen ? "block" : "hidden"}`}
                    >
                        <li className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-lg">
                            <FiDollarSign />
                            Quản Lý Đơn Đặt
                        </li>
                    </Link>

                    {/* Reports */}
                    <Link
                        to="/manager/report"
                        className={`${isOpen ? "block" : "hidden"}`}
                    >
                        <li className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-lg">
                            <FiBarChart2 />
                            Báo Cáo
                        </li>
                    </Link>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
