import React, { useState, useEffect } from "react";
import ServiceCard from "./ServiceCard";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SpinnerLoading } from "./SpinnerLoading";

export interface Service {
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
}

interface ServiceListProps {
    services: Service[];
}

const ServiceList: React.FC<ServiceListProps> = ({ services }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 500);
    }, [services]);

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
                {[1, 2, 3].map((i) => (
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
                        <SpinnerLoading/>
                        <p className="text-gray-500 mt-2">
                            Vui lòng đợi...
                        </p>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default ServiceList;