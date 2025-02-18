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
    return (
        <div className="mt-3 space-y-4">
            {feedbacks.map((fb, index) => (
                <div key={index} className="border-b pb-2">
                    <p className="font-semibold">{fb.name} - {fb.date}</p>
                    <p className="text-yellow-500">{"⭐".repeat(fb.rating)}</p>
                    <p className="text-gray-700">{fb.comment}</p>
                </div>
            ))}
        </div>
    );
};

export default FeedbackList;
