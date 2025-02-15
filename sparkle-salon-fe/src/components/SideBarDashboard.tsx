import React, { useState } from "react";
import {
    FiUsers,
    FiShoppingCart,
    FiDollarSign,
    FiBarChart2,
    FiSettings,
    FiMenu,
} from "react-icons/fi";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <aside
            className={`bg-gray-900 text-white p-5 flex flex-col space-y-4 shadow-lg transition-all duration-300 h-screen ${
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
                    <li className="flex items-center gap-2 p-2 hover:bg-gray-700">
                        <FiUsers />{" "}
                        <span className={`${isOpen ? "block" : "hidden"}`}>
                            Quản Lý Người Dùng
                        </span>
                    </li>
                    <li className="flex items-center gap-2 p-2 hover:bg-gray-700">
                        <FiShoppingCart />{" "}
                        <span className={`${isOpen ? "block" : "hidden"}`}>
                            Quản Lý Dịch Vụ
                        </span>
                    </li>
                    <li className="flex items-center gap-2 p-2 hover:bg-gray-700">
                        <FiDollarSign />{" "}
                        <span className={`${isOpen ? "block" : "hidden"}`}>
                            Quản Lý Đơn Đặt
                        </span>
                    </li>
                    <li className="flex items-center gap-2 p-2 hover:bg-gray-700">
                        <FiBarChart2 />{" "}
                        <span className={`${isOpen ? "block" : "hidden"}`}>
                            Báo Cáo
                        </span>
                    </li>
                    <li className="flex items-center gap-2 p-2 hover:bg-gray-700">
                        <FiSettings />{" "}
                        <span className={`${isOpen ? "block" : "hidden"}`}>
                            Cài Đặt
                        </span>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
