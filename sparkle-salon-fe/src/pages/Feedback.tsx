import { useState, useEffect } from "react";
import { getFeedbackById, createFeedback, updateFeedbackById, Feedback } from "../data/feedbacksData";
import { motion } from "framer-motion";

export default function FeedbackPage() {
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [feedbackText, setFeedbackText] = useState("");
    const [rating, setRating] = useState(5); 
    const feedbackId = "1"; 

    useEffect(() => {
        const fetchFeedback = async () => {
            const feedbackData = await getFeedbackById(feedbackId);
            if (feedbackData) {
                setFeedback(feedbackData);
                setFeedbackText(feedbackData.feedbackText);
                setRating(feedbackData.rating);
            }
        };
        fetchFeedback();
    }, [feedbackId]);

    const handleSubmit = async () => {
        if (feedback) {
            await updateFeedbackById(feedbackId, { ...feedback, feedbackText, rating });
        } else {
            // Create new feedback
            await createFeedback({ feedbackText, rating, serviceName: "Service Name", img: "image_url", bookingDate: "date", therapistName: "Therapist Name" });
        }
        setModalOpen(false);
    };

    return (
        <div className="bg-white min-h-screen">
            <div className="relative w-full h-[170px] flex flex-col justify-center items-center bg-[url('/assets/sparkle-salon-title.jpg')] bg-cover bg-center bg-no-repeat mt-16">
                <div className="absolute inset-0 bg-black opacity-40"></div>
                <h1 className="relative z-10 text-white text-7xl font-serif">
                    Feedback
                </h1>
            </div>
            {feedback && (
                <div className="border p-4 my-4">
                    <h2 className="font-semibold">{feedback.serviceName}</h2>
                    <p>{feedback.feedbackText}</p>
                    <p>Rating: {feedback.rating}</p>
                    <button onClick={() => setModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded">Sửa</button>
                </div>
            )}
            <button onClick={() => setModalOpen(true)} className="bg-green-500 text-white px-4 py-2 rounded">Đánh Giá</button>

            {modalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <motion.div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-xl font-bold">Đánh Giá Sản Phẩm</h2>
                        <textarea
                            value={feedbackText}
                            onChange={(e) => setFeedbackText(e.target.value)}
                            placeholder="Nhập đánh giá của bạn"
                            className="border p-2 w-full"
                        />
                        <div>
                            <label>Rating:</label>
                            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <option key={star} value={star}>{star}</option>
                                ))}
                            </select>
                        </div>
                        <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">Hoàn Thành</button>
                        <button onClick={() => setModalOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded">Đóng</button>
                    </motion.div>
                </div>
            )}
        </div>
    );
}