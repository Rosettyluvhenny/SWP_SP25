import React from 'react';
import { FaStar, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface Feedback {
    name: string;
    rating: number;
    comment: string;
    date: string;
}

interface FeedbackListProps {
    feedbacks: Feedback[];
}

const FeedbackList: React.FC<FeedbackListProps> = ({ feedbacks }) => {
    if (feedbacks.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>Chưa có đánh giá nào cho dịch vụ này.</p>
                <p className="mt-2">Hãy là người đầu tiên đánh giá!</p>
            </div>
        );
    }

    // Calculate average rating
    const averageRating = feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length;
    
    // Count ratings by star
    const ratingCounts = [0, 0, 0, 0, 0]; 
    feedbacks.forEach(feedback => {
        if (feedback.rating >= 1 && feedback.rating <= 5) {
            ratingCounts[5 - feedback.rating]++;
        }
    });
    
    // Calculate percentages
    const ratingPercentages = ratingCounts.map(count => (count / feedbacks.length) * 100);

    return (
        <div>
            {/* Rating Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-pink-600">{averageRating.toFixed(1)}</div>
                        <div className="flex justify-center mt-1">
                            {[...Array(5)].map((_, i) => (
                                <FaStar 
                                    key={i} 
                                    className="mx-0.5" 
                                    color={i < Math.round(averageRating) ? "#FFD700" : "#e4e5e9"} 
                                />
                            ))}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">{feedbacks.length} đánh giá</div>
                    </div>
                    
                    <div className="flex-grow">
                        {[5, 4, 3, 2, 1].map((star, index) => (
                            <div key={star} className="flex items-center mb-1">
                                <div className="w-10 text-sm text-gray-600">{star} sao</div>
                                <div className="flex-grow mx-2 bg-gray-200 rounded-full h-2.5">
                                    <motion.div 
                                        className="bg-yellow-400 h-2.5 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${ratingPercentages[index]}%` }}
                                        transition={{ duration: 1, delay: index * 0.1 }}
                                    ></motion.div>
                                </div>
                                <div className="w-10 text-sm text-gray-600 text-right">
                                    {ratingCounts[index]}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Feedback List */}
            <div className="space-y-4">
                {feedbacks.map((feedback, index) => (
                    <motion.div 
                        key={index}
                        className="border-b pb-4 last:border-b-0"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <div className="flex items-center mb-2">
                            <div className="bg-pink-100 rounded-full p-2 mr-3">
                                <FaUser className="text-pink-500" />
                            </div>
                            <div>
                                <h4 className="font-medium">{feedback.name}</h4>
                                <div className="flex items-center">
                                    <div className="flex mr-2">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar 
                                                key={i} 
                                                size={14}
                                                className="mr-0.5" 
                                                color={i < feedback.rating ? "#FFD700" : "#e4e5e9"} 
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-500">{feedback.date}</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-700 pl-10">{feedback.comment}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default FeedbackList;
