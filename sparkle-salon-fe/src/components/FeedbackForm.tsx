import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface FeedbackFormProps {
    onSubmit: (feedback: {
        name: string;
        rating: number;
        comment: string;
        date: string;
    }) => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hover, setHover] = useState(0);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        
        if (!name.trim()) {
            newErrors.name = 'Vui lòng nhập tên của bạn';
        }
        
        if (rating === 0) {
            newErrors.rating = 'Vui lòng chọn số sao đánh giá';
        }
        
        if (!comment.trim()) {
            newErrors.comment = 'Vui lòng nhập nội dung đánh giá';
        } else if (comment.length < 10) {
            newErrors.comment = 'Nội dung đánh giá phải có ít nhất 10 ký tự';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validate()) return;
        
        setIsSubmitting(true);
        
        // Format current date as DD/MM/YYYY
        const today = new Date();
        const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
        
        // Submit feedback
        onSubmit({
            name,
            rating,
            comment,
            date: formattedDate
        });
        
        // Reset form
        setName('');
        setRating(0);
        setComment('');
        setIsSuccess(true);
        
        // Hide success message after 3 seconds
        setTimeout(() => {
            setIsSuccess(false);
            setIsSubmitting(false);
        }, 3000);
    };

    return (
        <div className="mt-8 bg-pink-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Để lại đánh giá của bạn</h3>
            
            {isSuccess && (
                <motion.div 
                    className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                >
                    Cảm ơn bạn đã gửi đánh giá!
                </motion.div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Họ tên của bạn</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Nguyễn Văn A"
                        disabled={isSubmitting}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Đánh giá</label>
                    <div className="flex">
                        {[...Array(5)].map((_, index) => {
                            const ratingValue = index + 1;
                            return (
                                <motion.label
                                    key={index}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <input
                                        type="radio"
                                        name="rating"
                                        className="hidden"
                                        value={ratingValue}
                                        onClick={() => setRating(ratingValue)}
                                        disabled={isSubmitting}
                                    />
                                    <FaStar
                                        className="cursor-pointer mr-1"
                                        color={ratingValue <= (hover || rating) ? "#FFD700" : "#e4e5e9"}
                                        size={30}
                                        onMouseEnter={() => setHover(ratingValue)}
                                        onMouseLeave={() => setHover(0)}
                                    />
                                </motion.label>
                            );
                        })}
                    </div>
                    {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
                </div>
                
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Nội dung đánh giá</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 min-h-[100px] ${errors.comment ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ này..."
                        disabled={isSubmitting}
                    />
                    {errors.comment && <p className="text-red-500 text-sm mt-1">{errors.comment}</p>}
                </div>
                
                <motion.button
                    type="submit"
                    className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                </motion.button>
            </form>
        </div>
    );
};

export default FeedbackForm;
