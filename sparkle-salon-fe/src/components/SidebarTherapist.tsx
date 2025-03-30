import { useState, useContext } from "react";
import { FiMenu, FiLogOut } from "react-icons/fi";
import { AiOutlineSchedule } from "react-icons/ai";
import { LuNotebookPen } from "react-icons/lu";
import { FaPencil } from "react-icons/fa6";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
    const [isOpen, setIsOpen] = useState(true);
    const { logout } = useContext(UserContext);
     const navigate = useNavigate();

    const tabs = [
        { id: "schedule", label: "Lịch Làm Việc", icon: <AiOutlineSchedule /> },
        {
            id: "notes",
            label: "Ghi Chú Phiên Trị Liệu",
            icon: <LuNotebookPen />,
        },
        { id: "blog", label: "Viết Blog", icon: <FaPencil /> },
    ];

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
                Therapist Panel
            </h2>
            <nav>
                <ul className="space-y-3">
                    {tabs.map((tab) => (
                        <li
                            key={tab.id}
                            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${
                                activeTab === tab.id
                                    ? "bg-gray-700"
                                    : "hover:bg-gray-700"
                            }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.icon}
                            <span className={isOpen ? "block" : "hidden"}>
                                {tab.label}
                            </span>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Logout */}
            <button
                onClick={() => {
                    console.log("logout");
                    logout();
                    navigate("/");
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
