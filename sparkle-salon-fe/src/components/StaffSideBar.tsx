import { useContext, useState } from "react";
import { FiMenu, FiUsers, FiShoppingCart, FiBarChart2, FiCalendar, FiLogOut } from "react-icons/fi";
import { MdMeetingRoom, MdOutlinePayments, MdQuiz, MdNewspaper } from "react-icons/md";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function StaffSideBar(){
    const [isOpen, setIsOpen] = useState(true);
    const {logout} = useContext(UserContext)
    return (
        <aside
            className={`bg-gray-900 text-white p-5 flex flex-col space-y-4 shadow-lg transition-all duration-300 h-100% ${
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
                    {/* User Management */}
                    <Link
                        to="/staff/Booking"
                        className={`${isOpen ? "block" : "hidden"}`}
                    >
                        <li className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-lg">
                        <FiShoppingCart />
                            
                            Quản Lý Đặt Lịch
                        </li>
                    </Link>

                    {/* Service Management */}
                    <Link
                        to="/staff/Session"
                        className={`${isOpen ? "block" : "hidden"}`}
                    >
                        <li className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-lg">
                            <FiCalendar/>
                            Quản Lý Phiên Hẹn
                        </li>
                    </Link>
                    

                    {/* Room Management */}
                    <Link
                        to="/manager/room"
                        className={`${isOpen ? "block" : "hidden"}`}
                    >
                        <li className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-lg">
                        <FiUsers />
                            Tài Khoản
                        </li>
                    </Link>

                    <Link
                        to="/manager/room"
                        className={`${isOpen ? "block" : "hidden"}`}
                    >
                        <li className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-lg" onClick={()=>logout()}>
                        <FiLogOut />
                            Đăng xuất
                        </li>
                    </Link>

                </ul>
            </nav>
        </aside>
    )
}