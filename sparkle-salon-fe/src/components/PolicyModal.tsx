import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface PolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: () => void;
    serviceId?: string | number;
}

const PolicyModal: React.FC<PolicyModalProps> = ({
    isOpen,
    onClose,
    onAccept,
}) => {
    const [showScrollIndicator, setShowScrollIndicator] = useState(false);
    
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };
        
        if (isOpen) {
            document.addEventListener("keydown", handleEscKey);
            document.body.style.overflow = "hidden";
        }
        
        return () => {
            document.removeEventListener("keydown", handleEscKey);
            document.body.style.overflow = "auto";
        };
    }, [isOpen, onClose]);
    
    const handleContentScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        setShowScrollIndicator(scrollTop < scrollHeight - clientHeight - 20);
    };
    
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
                    onClick={handleBackdropClick}
                >
                    {/* Backdrop with blur effect */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        aria-hidden="true"
                    />
                    
                    {/* Modal container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ 
                            type: "spring", 
                            damping: 25, 
                            stiffness: 300,
                            duration: 0.3
                        }}
                        className="bg-gray-50 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] 
                                   overflow-hidden flex flex-col relative z-10
                                   border border-gray-100"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="policy-modal-title"
                    >
                        {/* Header */}
                        <div className="px-6 pt-6 pb-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 
                                id="policy-modal-title"
                                className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-pink-600 to-pink-500 bg-clip-text text-transparent"
                            >
                                Chính sách thanh toán & Dịch vụ
                            </h2>
                            <button 
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full 
                                         hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
                                aria-label="Đóng"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div 
                            className="px-6 py-5 overflow-y-auto flex-grow scroll-smooth scrollbar-thin relative"
                            onScroll={handleContentScroll}
                        >
                            <div className="space-y-6 text-gray-700">
                                <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-50">
                                    <h3 className="font-semibold text-lg text-pink-600 flex items-center gap-3">
                                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-pink-100 text-pink-600 text-sm">1</span>
                                        Chính sách đặt lịch
                                    </h3>
                                    <ul className="mt-3 ml-10 space-y-3">
                                        <li className="relative">
                                            <span className="absolute -left-6 top-1.5 w-2 h-2 rounded-full bg-pink-400"></span>
                                            <span className="text-gray-900 font-medium">Đặt lịch trước 24 giờ</span> để chúng tôi đảm bảo thời
                                            gian chuẩn bị tốt nhất cho dịch vụ của bạn.
                                        </li>
                                        <li className="relative">
                                            <span className="absolute -left-6 top-1.5 w-2 h-2 rounded-full bg-pink-400"></span>
                                            Sau khi đặt lịch thành công, <span className="text-gray-900 font-medium">7 ngày sau</span> bạn mới
                                            được đặt lịch tiếp theo cho dịch vụ này.
                                        </li>
                                    </ul>
                                </section>

                                <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-50">
                                    <h3 className="font-semibold text-lg text-pink-600 flex items-center gap-3">
                                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-pink-100 text-pink-600 text-sm">2</span>
                                        Chính sách thanh toán
                                    </h3>
                                    <div className="mt-3 ml-10">
                                        <p>
                                            Khách hàng có thể thanh toán bằng <span className="text-gray-900 font-medium">tiền mặt, chuyển
                                            khoản ngân hàng</span> tại spa.
                                        </p>
                                    </div>
                                </section>

                                <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-50">
                                    <h3 className="font-semibold text-lg text-pink-600 flex items-center gap-3">
                                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-pink-100 text-pink-600 text-sm">3</span>
                                        Chính sách hoàn tiền
                                    </h3>
                                    <div className="mt-3 ml-10">
                                        <p>
                                            Khi dịch vụ bị huỷ <span className="text-gray-900 font-medium">chúng tôi sẽ không chịu trách nhiệm hoàn tiền . Buổi hẹn của quý khách vẫn sẽ được giữ cho lần sau</span> .
                                        </p>
                                    </div>
                                </section>

                                <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-50">
                                    <h3 className="font-semibold text-lg text-pink-600 flex items-center gap-3">
                                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-pink-100 text-pink-600 text-sm">4</span>
                                        Chính sách hủy lịch
                                    </h3>
                                    <ul className="mt-3 ml-10 space-y-3">
                                        <li className="relative">
                                            <span className="absolute -left-6 top-1.5 w-2 h-2 rounded-full bg-pink-400"></span>
                                            <span className="text-gray-900 font-medium">Không đến đúng lịch hẹn:</span> Xem như quý khách huỷ lịch, và chúng tôi sẽ
                                            áp dụng chính sách hoàn tiền (đối với hình thức thanh
                                            toán bằng VNPAY).
                                        </li>
                                    </ul>
                                </section>

                                <section className="bg-white rounded-xl p-4 shadow-sm border border-gray-50">
                                    <h3 className="font-semibold text-lg text-pink-600 flex items-center gap-3">
                                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-pink-100 text-pink-600 text-sm">5</span>
                                        Chính sách bảo mật
                                    </h3>
                                    <div className="mt-3 ml-10">
                                        <p>
                                            Chúng tôi cam kết <span className="text-gray-900 font-medium">bảo mật thông tin cá nhân</span> của
                                            khách hàng và chỉ sử dụng thông tin cho mục đích đặt
                                            lịch và cung cấp dịch vụ.
                                        </p>
                                    </div>
                                </section>

                                <section className="bg-pink-50 rounded-xl p-4 shadow-sm border border-pink-100">
                                    <h3 className="font-semibold text-lg text-pink-600 flex items-center gap-3">
                                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-pink-100 text-pink-600 text-sm">6</span>
                                        Loại gói dịch vụ
                                    </h3>
                                    <div className="mt-3 ml-10">
                                        <p>
                                            Cho gói dịch vụ trị liệu thời gian giữa 2 buổi trị liệu ít nhất là <span className="text-gray-900 font-medium">7 ngày</span> khách hàng sẽ không thể 
                                            đặt lịch cho bất cứ dịch vụ trị liệu nào trong khoản thời gian này <span className="text-gray-900 font-bold">nhằm đảm bảo an toàn</span> cho sức khỏe làn da.
                                        </p>
                                        <p className="mt-3">
                                            Cho gói dịch vụ làm sạch và phục hồi thời gian giữa 2 buổi trị liệu ít nhất là <span className="text-gray-900 font-medium">1 ngày</span> khách hàng sẽ không thể 
                                            đặt lịch cho bất cứ dịch vụ làm sạch và phục hồi nào trong khoản thời gian này <span className="text-gray-900 font-bold">nhằm đảm bảo chu trình sinh học của làn da</span>
                                        </p>
                                    </div>
                                </section>

                                <section className="bg-pink-50 rounded-xl p-4 shadow-sm border border-pink-100">
                                    <h3 className="font-semibold text-lg text-pink-600 flex items-center gap-3">
                                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-pink-100 text-pink-600 text-sm">7</span>
                                        Lưu ý quan trọng
                                    </h3>
                                    <div className="mt-3 ml-10">
                                        <p>
                                            Vui lòng đến <span className="text-gray-900 font-medium">sớm 10-15 phút</span> trước giờ hẹn để hoàn
                                            tất thủ tục. Nếu đến muộn sau 30 phút, lịch hẹn sẽ bị hủy nhưng số lần thực hiện của gói dịch vụ vẫn được giữ nguyên.
                                        </p>
                                    </div>
                                </section>
                            </div>
                            
                            {/* Scroll indicator */}
                            {showScrollIndicator && (
                                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3 sm:gap-4 bg-gray-50">
                        <button
                                onClick={onAccept}
                                className="py-3 px-4 rounded-lg bg-gradient-to-r from-pink-500 to-pink-400 
                                         text-white font-medium hover:from-pink-600 hover:to-pink-500 
                                         transition-all focus:outline-none focus:ring-2 focus:ring-pink-500 
                                         focus:ring-offset-2 shadow-md flex-1 sm:order-2"
                            >
                                Đồng ý & Chấp nhận
                            </button>
                            <button
                                onClick={onClose}
                                className="py-3 px-4 rounded-lg border border-gray-200 text-gray-700 font-medium 
                                         hover:bg-gray-100 transition-all focus:outline-none focus:ring-2 
                                         focus:ring-pink-400 flex-1 sm:order-1"
                            >
                                Không đồng ý
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default PolicyModal;