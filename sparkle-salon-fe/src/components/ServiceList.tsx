import React from "react";
import ServiceCard from "./ServiceCard";
import { AiFillFrown } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Service } from "../types/service";

interface ServiceListProps {
    services: Service[];
    isLoading: boolean;
}

const ServiceList: React.FC<ServiceListProps> = ({ services, isLoading }) => {
    const navigate = useNavigate();

    const handleSelectService = (serviceName: string) => {
        navigate("/contact", { state: { selectedService: serviceName } });
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 h-64 rounded-xl mb-4"></div>
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6"
        >
            {services.length > 0 ? (
                services.map((service) => (
                    <motion.div key={service.id} variants={item}>
                        <ServiceCard
                            service={service}
                            onSelectService={handleSelectService}
                        />
                    </motion.div>
                ))
            ) : (
                <motion.div 
                    className="col-span-full min-h-[400px] flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="text-center">
                        <AiFillFrown className="text-9xl text-pink-300 mx-auto mb-4" />
                        <p className="text-2xl font-medium text-gray-600">
                            Không tìm thấy dịch vụ nào
                        </p>
                        <p className="text-gray-500 mt-2">
                            Vui lòng thử lại với các tiêu chí tìm kiếm khác
                        </p>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default ServiceList;