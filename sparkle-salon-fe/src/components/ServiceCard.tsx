import React, { useContext, useState } from "react";
import { FaMoneyBill } from "react-icons/fa";
import { IoIosRedo, IoIosRefreshCircle, IoMdTime, IoMdTimer } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";

interface ServiceCardProps {
    service: {
        id: number;
        active: boolean;
        name: string;
        price: number;
        duration: string;
        session: number;
        img: string;
        description: string;
        categoryId: number;
        categoryName: string;
        rating: number;
    };
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    const displayName = service.name.startsWith("http") ? "Trẻ Hóa Da Công Nghệ Cao" : service.name;
    const {user, setIsLoginOpen} = useContext(UserContext);
    const navigate = useNavigate();
    
    const handleBookingClick = () => {
        if(!user || !user.auth){
            setIsLoginOpen(true);
            toast.error("đăng nhập để đặt lịch");
        } else {
            navigate(`/booking?service=${service.id}`);
        }
    };

    return (
        <div 
            className="bg-white hover:shadow-2xl transition-all duration-300 rounded-xl shadow-lg border border-pink-100 group h-full flex flex-col overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative overflow-hidden">
                <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-pink-400 text-white px-3 py-1 rounded-full text-sm z-10 shadow-md">
                    {service.categoryName || "Thẩm mỹ không xâm lấn"}
                </div>
                
                {/* Service image */}
                <img
                    src={service.img || "/placeholder.jpg"}
                    alt={displayName}
                    className={`w-full object-cover transition-all duration-500 ${isHovered ? 'scale-110 h-72' : 'h-64'}`}
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
                {/* Service title */}
                <h2 className="text-xl font-semibold text-gray-800 h-14 line-clamp-2 group-hover:text-pink-600 transition-colors duration-300">
                    {displayName}
                </h2>
                
                {/* Service details */}
                <div className="mt-3 space-y-3 flex-grow">
                    <p className="text-gray-600 flex items-center">
                        <IoMdTime className="mr-2 text-pink-500" />
                        {service.duration} phút
                        <IoIosRefreshCircle className="mr-2 text-pink-500 ml-4"/>
                        {service.session} buổi
                    </p>
                    <p className="text-pink-600 font-semibold text-lg flex items-center">
                        <FaMoneyBill className="mr-2" />
                        {service.price.toLocaleString()} vnđ
                    </p>
                </div>
                
                {/* Action buttons */}
                <div className="flex flex-row justify-between gap-4 mt-5">
                    <button
                        className="flex-1 bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500 text-white py-3 px-4 rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1"
                        onClick={handleBookingClick}
                    >
                        Đặt Hẹn
                    </button>
                    <Link 
                        to={`/service/${service.id}`}
                        className="flex-1"
                    >
                        <button className="w-full bg-pink-50 hover:bg-pink-100 text-pink-700 py-3 px-4 rounded-lg transition-all duration-300 font-medium border border-pink-200 hover:border-pink-300 transform hover:-translate-y-1">
                            Xem chi tiết
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;