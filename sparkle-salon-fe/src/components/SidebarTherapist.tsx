import React, { useContext, useState } from "react";
import { FiMenu, FiLogOut } from "react-icons/fi";
import { AiOutlineSchedule } from "react-icons/ai";
import { LuNotebookPen } from "react-icons/lu";
import { FaPencil } from "react-icons/fa6";
import { FaUser,FaClock  } from "react-icons/fa"; 
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
    { id: "account", label: "Thông tin chuyên viên", icon: <FaUser /> }, 
    { id: "schedule", label: "Lịch Làm Việc", icon: <AiOutlineSchedule /> },
    { id: "notes", label: "Ghi Chú buổi Trị Liệu", icon: <LuNotebookPen /> },
    { id: "blog", label: "Viết Blog", icon: <FaPencil /> },
    { id: "history", label: "Lịch Sử Ca Làm", icon: <FaClock /> },
  ];

  return (
    <aside
      className={`bg-gray-900 text-white p-5 flex flex-col space-y-4 shadow-lg transition-all duration-300 h-full ${isOpen ? "w-64" : "w-20"
        }`}
    >
      {/* Toggle Button */}
      <button
        className="text-white text-2xl mb-2 focus:outline-none hover:text-gray-300"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Thu gọn thanh bên" : "Mở rộng thanh bên"}
      >
        <FiMenu />
      </button>

      <h2
        className={`text-xl font-bold text-center transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 hidden"
          }`}
      >
        Therapist Panel
      </h2>
      <nav>
        <ul className="space-y-3">
          {tabs.map((tab) => (
            <li
              key={tab.id}
              className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${activeTab === tab.id ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
              onClick={() => {
                console.log("Chọn tab:", tab.id); // Log để kiểm tra
                setActiveTab(tab.id);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setActiveTab(tab.id)} // Hỗ trợ bàn phím
            >
              {tab.icon}
              <span
                className={`transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0 hidden"
                  }`}
              >
                {tab.label}
              </span>
            </li>
          ))}
          {/* Logout */}
          <li>
            <button
              onClick={() => { console.log("logout"); logout(); navigate("/") }}
              className={`w-full flex items-center gap-2 p-2 hover:bg-gray-700 rounded-lg text-left ${isOpen ? "block" : "flex justify-center"
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
};

export default Sidebar;
