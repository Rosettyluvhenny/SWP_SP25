import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import servicesData, { Service } from "../data/servicesData";
import { feedbacksData } from "../data/feedbacksData";
import { FaClock, FaStar, FaMoneyBill } from "react-icons/fa";
import FeedbackForm from "../components/FeedbackForm";
import FeedbackList from "../components/FeedbackList";

interface Feedback {
    name: string;
    rating: number;
    comment: string;
    date: string;
}

export default function ServiceDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState<Service | null>(null);
    const [feedbacks, setFeedbacks] = useState<Feedback[]>(feedbacksData);

    useEffect(() => {
        const foundService = servicesData.find((s) => s.id === Number(id));
        setService(foundService || null);
    }, [id]);

    if (!service) {
        return (
            <p className="text-center mt-10 text-xl text-red-500 font-semibold">
                Dịch vụ không tồn tại...
            </p>
        );
    }

    const handleBooking = () => {
        navigate("/contact", { state: { selectedService: service.name } });
    };

    const handleFeedbackSubmit = (newFeedback: Feedback) => {
        setFeedbacks((prev) => [newFeedback, ...prev]);
    };

    return (
        <div className="bg-pink-50 mt-24">
            <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-8 bg-pink-100">
                <div className="lg:col-span-3 space-y-6">
                    {/* Top Section */}
                    <div className="bg-white shadow-md p-6 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6">
                        <img
                            src={service.img}
                            alt={service.name}
                            className="w-full h-70 object-cover rounded-lg border border-pink-900"
                        />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {service.name}
                            </h1>
                            <p className="text-pink-500 text-lg font-semibold mt-1">
                                <FaMoneyBill className="inline-block" />{" "}
                                {service.price.toLocaleString()} vnđ (Đã bao gồm
                                VAT)
                            </p>
                            <p className="flex items-center text-gray-600 mt-2">
                                <FaClock className="mr-2 text-black" />{" "}
                                {service.duration}
                                <span className="mx-4">|</span>
                                <FaStar className="mr-1 text-yellow-500" />{" "}
                                {service.popularity}
                            </p>
                            <button
                                className="bg-pink-500 hover:bg-pink-600 text-white py-3 px-6 rounded-lg mt-28 text-lg font-semibold shadow-md transition"
                                onClick={handleBooking}
                            >
                                Đặt hẹn ngay
                            </button>
                        </div>
                    </div>

                    {/* Description Section */}
                    <div className="bg-white shadow-md p-6 rounded-lg">
                        <h2 className="text-xl font-semibold border-b pb-2">
                            Thông tin dịch vụ
                        </h2>
                        <p className="mt-3 text-gray-700 leading-relaxed">
                            {service.description}
                        </p>
                    </div>

                    {/* Feedback Section */}
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold">
                            Đánh Giá Khách Hàng
                        </h2>
                        <FeedbackList feedbacks={feedbacks} />
                        <FeedbackForm onSubmit={handleFeedbackSubmit} />
                    </div>
                </div>

                {/*Sidebar Section */}
                <aside className="space-y-6">
                    <div className="bg-white shadow-md p-4 rounded-lg">
                        <h3 className="text-lg font-bold border-b pb-2">
                            Dịch vụ khác
                        </h3>
                        {servicesData
                            .filter((related) => related.id !== service.id)
                            .slice(0, 10)
                            .map((related) => (
                                <Link
                                    to={`/service/${related.id}`}
                                    key={related.id}
                                    className="block mt-4 hover:bg-pink-100 p-2 rounded-md transition"
                                >
                                    <div className="flex gap-4">
                                        <img
                                            src={related.img}
                                            alt={related.name}
                                            className="w-16 h-16 rounded object-cover"
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {related.name}
                                            </p>
                                            <p className="text-pink-500 font-medium">
                                                {related.price.toLocaleString()}{" "}
                                                đ
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                    </div>
                </aside>
            </div>
        </div>
    );
}
