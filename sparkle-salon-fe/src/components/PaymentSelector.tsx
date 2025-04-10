import React from 'react';
import { FaCheck } from "react-icons/fa";
import { Payment } from '../types/bookingTypes';

interface PaymentSelectorProps {
    payments: Payment[];
    selectedPayment: Payment | null;
    setSelectedPayment: (payment: Payment) => void;
    isOpen: boolean;
}

const PaymentSelector: React.FC<PaymentSelectorProps> = ({ 
    payments, 
    selectedPayment, 
    setSelectedPayment,
    isOpen 
}) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
                Chọn phương thức thanh toán
            </h2>
            <div
                className={`transition-all overflow-hidden ${
                    isOpen ? "max-h-[500px] mt-4" : "max-h-0"
                }`}
            >
                {payments.length > 0 ? (
                    <div className="flex space-x-3 overflow-x-auto scrollbar-hide p-2">
                        {payments.map((payment) => (
                            <div
                                key={payment.paymentId}
                                className={`relative border-2 p-3 rounded-lg cursor-pointer min-w-[130px] transition-all duration-300 ease-in-out flex flex-col items-center ${
                                    selectedPayment?.paymentId === payment.paymentId
                                        ? "border-pink-400 bg-pink-100 scale-105"
                                        : "border-gray-300 bg-white hover:scale-105 hover:shadow-md"
                                }`}
                                onClick={() => setSelectedPayment(payment)}
                            >
                                <p className="text-sm mt-2 font-semibold text-center text-gray-700">
                                    {payment.paymentName}
                                </p>
                                {selectedPayment?.paymentId === payment.paymentId && (
                                    <div className="absolute top-0 right-0 bg-pink-300 text-white rounded-full p-1">
                                        <FaCheck />
                                    </div>
                                )}
                                {payment.description && (
                                    <p className="text-sm mt-2 font-semibold text-center text-gray-700">
                                        {payment.description}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-3 text-center text-gray-600">
                        Không có phương thức thanh toán hoạt động
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentSelector;