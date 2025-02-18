import React from "react";
import ServiceCard from "./ServiceCard";
import { AiFillFrown } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

interface Service {
    id: number;
    name: string;
    img: string;
    price: number;
    duration: string;
    popularity: number;
}

interface ServiceListProps {
    services: Service[];
}

const ServiceList: React.FC<ServiceListProps> = ({ services }) => {
    const navigate = useNavigate();

    const handleSelectService = (serviceName: string) => {
        navigate("/contact", { state: { selectedService: serviceName } });
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {services.length > 0 ? (
                services.map((service) => (
                    <ServiceCard
                        key={service.id}
                        service={service}
                        onSelect={handleSelectService}
                    />
                ))
            ) : (
                <div className="grid place-items-center col-span-3 h-80">
                    <div className="flex flex-col items-center justify-center">
                        <p className="text-gray-500 text-center text-2xl">
                            Không tìm thấy dịch vụ nào
                        </p>
                        <AiFillFrown className="text-9xl text-gray-400 mt-2" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceList;
