import { useContext, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import StaffSideBar from "../components/StaffSideBar";
import { UserContext } from "../context/UserContext";

export default function StaffLayout({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="flex">
            <StaffSideBar 
            isOpen= {isOpen}
            setIsOpen= {setIsOpen}
            />
            <main className="flex-grow ml-[92px]">{children}</main>
        </div>
    );
}
