
import React, { useState } from "react";

interface Feedback {
    name: string;
    rating: number;
    comment: string;
    date: string;
}

interface FeedbackFormProps {
    onSubmit: (feedback: Feedback) => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ onSubmit }) => {
    const [newFeedback, setNewFeedback] = useState<Feedback>({
        name: "",
        rating: 5,
        comment: "",
        date: "",
    });

    const handleSubmit = () => {
        if (newFeedback.name && newFeedback.comment) {
            onSubmit({ ...newFeedback, date: new Date().toLocaleDateString() });
            setNewFeedback({ name: "", rating: 5, comment: "", date: "" });
        }
    };

    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold">Gửi đánh giá của bạn</h3>
            <input
                type="text"
                placeholder="Tên của bạn"
                value={newFeedback.name}
                onChange={(e) => setNewFeedback({ ...newFeedback, name: e.target.value })}
                className="border p-2 w-full mt-2 rounded bg-gray-100"
            />
            <select
                value={newFeedback.rating}
                onChange={(e) => setNewFeedback({ ...newFeedback, rating: Number(e.target.value) })}
                className="border p-2 w-full mt-2 rounded bg-gray-100"
            >
                {[5, 4, 3, 2, 1].map((star) => (
                    <option key={star} value={star}>{"⭐".repeat(star)}</option>
                ))}
            </select>
            <textarea
                placeholder="Nhận xét của bạn"
                value={newFeedback.comment}
                onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value })}
                className="border p-2 w-full mt-2 rounded h-24 bg-gray-100"
            ></textarea>
            <button
                onClick={handleSubmit}
                className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded mt-3"
            >
                Gửi đánh giá
            </button>
        </div>
    );
};

export default FeedbackForm;
