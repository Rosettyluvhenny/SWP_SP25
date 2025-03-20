import React from 'react';
import { Service } from '../types/bookingTypes';

interface ServiceDetailsProps {
    service: Service;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({ service }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex flex-col md:flex-row items-center md:items-start">
            <div className="text-center md:text-left w-full md:w-2/3">
                <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2">
                    Dịch vụ của bạn
                </h2>
                <img
                    src={service.img}
                    alt={service.name}
                    className="w-40 h-40 object-cover rounded-lg shadow-md border-2 border-pink-300"
                />
                <h3 className="text-lg font-semibold text-gray-700">
                    {service.name}
                </h3>
                <p className="text-lg font-semibold text-pink-600 flex items-center justify-center md:justify-start mt-2">
                    Số tiền cần thanh toán:
                    {service.price.toLocaleString()} VNĐ
                </p>
            </div>
        </div>
    );
};

export default ServiceDetails;