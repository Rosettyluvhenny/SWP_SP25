import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import {
    FiUsers,
    FiShoppingCart,
    FiBarChart2,
    FiMenu,
    FiLogOut
} from "react-icons/fi";
import { MdMeetingRoom, MdOutlinePayments } from "react-icons/md";
import { TbPhysotherapist } from "react-icons/tb";
import { MdNewspaper,MdQuiz  } from "react-icons/md";
import { UserContext } from "../context/UserContext";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const {logout} = useContext(UserContext);

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

                    {/* Therapist Management */}
                    <Link
                        to="/manager/therapist"
                        className={`${isOpen ? "block" : "hidden"}`}
                    >
                        <li className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-lg">
                            <TbPhysotherapist />
                            Quản Lý Chuyên Viên
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
                    
                    {/* Quiz*/}
                    <Link
                        to="/manager/quiz"
                        className={`${isOpen ? "block" : "hidden"}`}
                    >
                        <li className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-lg">
                            <MdQuiz />

                            Quản lí bài trắc nghiệm
                        </li>
                    </Link>
                    {/* Blog */}
                    <Link
                        to="/manager/blog"
                        className={`${isOpen ? "block" : "hidden"}`}
                    >
                        <li className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-lg">
                        <MdNewspaper />

                            Quản lí bài đăng
                        </li>
                    </Link>
                </ul>
            </nav>
            <div className="flex-grow"></div>
            
            {/* Logout */}
            <button
                onClick={() => {
                    console.log("logout");
                    logout();
                }}
                className={`w-full flex items-center gap-2 p-2 hover:bg-gray-700 rounded-lg text-left ${
                    isOpen ? "block" : "flex justify-center"
                }`}
            >
                <FiLogOut />
                {isOpen && "Đăng xuất"}
            </button>
        </aside>
    );
};

export default Sidebar;
