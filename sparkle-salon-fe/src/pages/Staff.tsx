import { useContext, useState } from "react";
import StaffSideBar from "../components/StaffSideBar";
import { UserContext } from "../context/UserContext";

export default function Staff(){
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="flex h-screen bg-white">
        <StaffSideBar
            isOpen= {isOpen}
            setIsOpen = {setIsOpen}
        />
        
        </div>
    )
}