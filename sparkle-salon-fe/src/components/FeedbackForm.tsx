import React, { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { createFeedback, Feedback } from "../data/feedbacksData";
import { AnimatePresence, motion } from "framer-motion";


interface SessionFeedbackFormProps {
    sessionId: number;
    isOpen: boolean;
    onClose: () => void;
    setIsLoading: (isLoading: boolean) => void;
}

const SessionFeedbackForm: React.FC<SessionFeedbackFormProps> = ({
    sessionId,
    isOpen,
    onClose,
    setIsLoading
}) => {
    const [rating, setRating] = useState(0);
    const [feedbackText, setFeedbackText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmitFeedback = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error('Vui lòng chọn đánh giá sao');
            return;
        }

        setIsSubmitting(true);

        const feedback: Feedback = {
            bookingSessionId: sessionId,
            rating,
            feedbackText
        };

        const rq = await createFeedback(feedback);

        if (rq) {
            toast.success("Đánh giá của bạn đã được gửi thành công!");

            // Reset form after success
            setTimeout(() => {
                onClose();
                setRating(0);
                setFeedbackText('');
            }, 2000);
        }
        setIsSubmitting(false);
        setIsLoading(true);
    }

    return (
        <AnimatePresence>
        {isOpen && (
            <motion.div 
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => {
                    // Close when clicking outside the form
                    if (e.target === e.currentTarget) onClose();
                }}
            >
                <motion.div 
                    className="bg-white rounded-lg shadow-md p-6 border border-gray-200 w-full max-w-2xl"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    transition={{ 
                        type: "spring", 
                        damping: 25, 
                        stiffness: 300 
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-purple-600">Đánh giá buổi điều trị #{sessionId}</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    <form onSubmit={handleSubmitFeedback}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">
                                Đánh giá của bạn
                            </label>
                            <div className="flex space-x-2 text-2xl mb-2">
                                {[...Array(5)].map((_, index) => (
                                    <motion.button
                                        key={index}
                                        type="button"
                                        onClick={() => setRating(index + 1)}
                                        className="focus:outline-none text-yellow-400"
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        {index < rating ? <FaStar /> : <FaRegStar />}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 mb-2">
                                Nhận xét
                            </label>
                            <textarea
                                value={feedbackText}
                                onChange={(e) => setFeedbackText(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
                                rows={4}
                                placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ này..."
                            ></textarea>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <motion.button
                                type="button"
                                onClick={onClose}
                                className="py-2 px-4 border border-gray-300 rounded font-medium text-gray-700 hover:bg-gray-100"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Hủy
                            </motion.button>
                            <motion.button
                                type="submit"
                                disabled={isSubmitting}
                                className={`py-2 px-6 rounded font-medium ${
                                    isSubmitting 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                                }`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                            </motion.button>
                        </div>

                    </form>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
    );
};

export default SessionFeedbackForm;