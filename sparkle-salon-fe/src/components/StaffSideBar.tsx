import React, { useContext, useState } from 'react';
import { FiMenu, FiUsers, FiShoppingCart, FiCalendar, FiLogOut } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

// Correct component definition and export
const StaffSideBar: React.FC<{ 
    isOpen: boolean, 
    setIsOpen: (check: boolean) => void 
}> = ({ isOpen, setIsOpen}) => {
    const {logout} = useContext(UserContext);
    const navigate = useNavigate();
    return (
        <aside
            className={`bg-gray-900 text-white p-5 space-y-4 shadow-lg transition-all duration-300 fixed top-0 bottom-0 z-30 ${
                isOpen ? "w-64" : "w-20"
            }`}
        >
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
                Staff
            </h2>
            <nav>
                <ul className="space-y-3">
                    {/* Booking Management */}
                    <li>
                        <Link
                            to="/staff/Booking"
                            className={`flex items-center gap-2 p-2 hover:bg-gray-700 rounded-lg ${
                                isOpen ? "block" : "flex justify-center"
                            }`}
                        >
                            <FiShoppingCart />
                            {isOpen && "Quản Lý Đặt Lịch"}
                        </Link>
                    </li>

                    {/* Session Management */}
                    <li>
                        <Link
                            to="/staff/Session"
                            className={`flex items-center gap-2 p-2 hover:bg-gray-700 rounded-lg ${
                                isOpen ? "block" : "flex justify-center"
                            }`}
                        >
                            <FiCalendar/>
                            {isOpen && "Quản Lý Phiên Hẹn"}
                        </Link>
                    </li>
                    
                    {/* Account Management */}
                    <li>
                        <Link
                            to="/staff/Profile"
                            className={`flex items-center gap-2 p-2 hover:bg-gray-700 rounded-lg ${
                                isOpen ? "block" : "flex justify-center"
                            }`}
                        >
                            <FiUsers />
                            {isOpen && "Tài Khoản"}
                        </Link>
                    </li>

                    {/* Logout */}
                    <li>
                        <button
                            onClick={()=>{console.log("logout");logout(); navigate("/")}}
                            className={`w-full flex items-center gap-2 p-2 hover:bg-gray-700 rounded-lg text-left ${
                                isOpen ? "block" : "flex justify-center"
                            }`}
                        >
                            <FiLogOut />
                            {isOpen && "Đăng xuất"}
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

export default StaffSideBar;