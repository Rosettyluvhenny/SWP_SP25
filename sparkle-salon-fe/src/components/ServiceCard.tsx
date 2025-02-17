import React from "react";
import { FaMoneyBill } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { Link } from "react-router-dom";

interface ServiceCardProps {
    service: {
        id: number;
        name: string;
        img: string;
        price: number;
        duration: string;
    };
    onSelect: (serviceName: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect }) => {
    return (
        <div className="bg-pink-100 p-4 rounded-lg shadow-xl">
            <h4 className="text-gray-500 text-sm mb-2">
                Thẩm mỹ không xâm lấn
            </h4>
            <img
                src={service.img || "/placeholder.jpg"}
                alt={service.name}
                className="rounded-lg h-60 w-full object-cover"
            />
            <h2 className="text-lg font-semibold mt-3">{service.name}</h2>
            <p className="text-gray-600 text-sm flex items-center">
                <IoMdTime className="mr-1" />
                {service.duration}
            </p>
            <p className="text-black font-sans mt-2 flex items-center">
                <FaMoneyBill className="mr-1" />
                {service.price.toLocaleString()} vnđ
            </p>
            <div className="flex flex-row justify-between">
                <button
                    className="mt-3 w-[40%] bg-pink-300 hover:bg-pink-400 text-black py-2 rounded-lg"
                    onClick={() => onSelect(service.name)}
                >
                    Đặt Hẹn
                </button>
                <button className="mt-3 w-[40%] bg-pink-300 hover:bg-pink-400 text-black py-2 rounded-lg">
                    <Link to={`/service/${service.id}`}>
                        Xem chi tiết
                    </Link>
                </button>
            </div>
        </div>
    );
};

export default ServiceCard;
