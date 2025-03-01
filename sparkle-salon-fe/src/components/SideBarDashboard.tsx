import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    FiUsers,
    FiShoppingCart,
    FiDollarSign,
    FiBarChart2,
    FiMenu,
    FiChevronDown,
    FiChevronRight,
} from "react-icons/fi";
import { MdMeetingRoom, MdOutlinePayments } from "react-icons/md";
import { FaLayerGroup, FaInfoCircle } from "react-icons/fa";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [serviceSubmenuOpen, setServiceSubmenuOpen] = useState(false);

    const toggleServiceSubmenu = () => {
        setServiceSubmenuOpen(!serviceSubmenuOpen);
    };

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

                    {/* Service Management with Submenu */}
                    <div className={`${isOpen ? "block" : "hidden"}`}>
                        <div 
                            className="flex items-center justify-between gap-2 p-2 hover:bg-gray-700 rounded-lg cursor-pointer"
                            onClick={toggleServiceSubmenu}
                        >
                            <div className="flex items-center gap-2">
                                <FiShoppingCart />
                                Quản Lý Dịch Vụ
                            </div>
                            {serviceSubmenuOpen ? <FiChevronDown /> : <FiChevronRight />}
                        </div>
                        
                        {/* Submenu */}
                        {serviceSubmenuOpen && (
                            <ul className="pl-6 mt-2 space-y-2">
                                <Link to="/manager/service">
                                    <li className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-lg text-sm">
                                        <FiShoppingCart />
                                        Dịch Vụ
                                    </li>
                                </Link>
                                <Link to="/manager/service-category">
                                    <li className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-lg text-sm">
                                        <FaLayerGroup />
                                        Danh Mục Dịch Vụ
                                    </li>
                                </Link>
                                <Link to="/manager/service-info">
                                    <li className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-lg text-sm">
                                        <FaInfoCircle />
                                        Thông Tin Dịch Vụ
                                    </li>
                                </Link>
                            </ul>
                        )}
                    </div>

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

                    {/* Room Management */}
                    <Link
                        to="/manager/room"
                        className={`${isOpen ? "block" : "hidden"}`}
                    >
                        <li className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-lg">
                            <MdMeetingRoom />
                            Quản Lý Phòng Khám
                        </li>
                    </Link>

                    {/* Payment Management */}
                    <Link
                        to="/manager/payment"
                        className={`${isOpen ? "block" : "hidden"}`}
                    >
                        <li className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-lg">
                            <MdOutlinePayments />
                            Quản Lý Thanh Toán
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
