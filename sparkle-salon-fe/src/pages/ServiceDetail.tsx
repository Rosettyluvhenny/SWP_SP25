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
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [feedbacks, setFeedbacks] = useState<Feedback[]>(feedbacksData);

    useEffect(() => {
        const fetchService = async () => {
            try {
                setIsLoading(true);
                // Handle case where id might be undefined
                if (!id) {
                    setError("Service ID is missing");
                    return;
                }
                
                // Find the service by ID
                const foundService = servicesData.find((s) => s.id === Number(id));
                
                if (!foundService) {
                    setError("Service not found");
                } else {
                    setService(foundService);
                    setError(null);
                }
            } catch (err) {
                console.error("Error fetching service:", err);
                setError("Failed to load service details");
            } finally {
                setIsLoading(false);
            }
        };

        fetchService();
    }, [id]);

    const handleBooking = () => {
        if (service) {
            // Fix for URL in name field
            const displayName = service.name.startsWith("http") 
                ? "Trẻ Hóa Da Công Nghệ Cao" 
                : service.name;
                
            navigate("/contact", { 
                state: { 
                    selectedService: displayName,
                    service: {
                        id: service.id,
                        name: displayName,
                        price: service.price,
                        duration: service.duration
                    }
                } 
            });
        }
    };

    const handleFeedbackSubmit = (newFeedback: Feedback) => {
        setFeedbacks((prev) => [newFeedback, ...prev]);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="bg-pink-50 mt-24 min-h-screen">
                <div className="max-w-7xl mx-auto p-6">
                    <div className="animate-pulse">
                        <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="h-32 bg-gray-200 rounded mb-4"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !service) {
        return (
            <div className="bg-pink-50 mt-24 min-h-screen">
                <div className="max-w-7xl mx-auto p-6 text-center">
                    <p className="text-2xl text-red-500 font-semibold mb-4">
                        {error || "Dịch vụ không tồn tại..."}
                    </p>
                    <button 
                        onClick={() => navigate("/service")}
                        className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg"
                    >
                        Quay lại danh sách dịch vụ
                    </button>
                </div>
            </div>
        );
    }

    // Fix for URL in name field
    const displayName = service.name.startsWith("http") 
        ? "Trẻ Hóa Da Công Nghệ Cao" 
        : service.name;

    // Fix for potentially broken image URLs
    const imageUrl = service.img && service.img.startsWith("http") 
        ? service.img 
        : "/placeholder.jpg";

    return (
        <div className="bg-pink-50 mt-24 min-h-screen">
            <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 space-y-6">
                    {/* Top Section */}
                    <div className="bg-white shadow-md p-6 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6">
                        <img
                            src={imageUrl}
                            alt={displayName}
                            className="w-full h-70 object-cover rounded-lg border border-pink-200"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder.jpg";
                            }}
                        />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {displayName}
                            </h1>
                            <p className="text-pink-500 text-lg font-semibold mt-1">
                                <FaMoneyBill className="inline-block mr-2" />
                                {service.price.toLocaleString()} vnđ (Đã bao gồm VAT)
                            </p>
                            <p className="flex items-center text-gray-600 mt-2">
                                <FaClock className="mr-2 text-black" />
                                {service.duration}
                                <span className="mx-4">|</span>
                                <FaStar className="mr-1 text-yellow-500" />
                                {service.popularity}
                            </p>
                            <button
                                className="bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500 text-white py-3 px-6 rounded-lg mt-8 text-lg font-semibold shadow-md transition transform hover:-translate-y-1"
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
                            {service.description || "Chưa có thông tin chi tiết về dịch vụ này."}
                        </p>
                    </div>

                    {/* Feedback Section */}
                    <div className="bg-white shadow-md p-6 rounded-lg">
                        <h2 className="text-xl font-semibold border-b pb-2">
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
                            .slice(0, 5)
                            .map((related) => {
                                // Fix for URL in name field
                                const relatedDisplayName = related.name.startsWith("http") 
                                    ? "Trẻ Hóa Da Công Nghệ Cao" 
                                    : related.name;
                                
                                // Fix for potentially broken image URLs
                                const relatedImageUrl = related.img && related.img.startsWith("http") 
                                    ? related.img 
                                    : "/placeholder.jpg";
                                    
                                return (
                                    <Link
                                        to={`/service/${related.id}`}
                                        key={related.id}
                                        className="block mt-4 hover:bg-pink-100 p-2 rounded-md transition"
                                    >
                                        <div className="flex gap-4">
                                            <img
                                                src={relatedImageUrl}
                                                alt={relatedDisplayName}
                                                className="w-16 h-16 rounded object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "/placeholder.jpg";
                                                }}
                                            />
                                            <div>
                                                <p className="font-semibold text-gray-900 line-clamp-1">
                                                    {relatedDisplayName}
                                                </p>
                                                <p className="text-pink-500 font-medium">
                                                    {related.price.toLocaleString()} đ
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                    </div>
                </aside>
            </div>
        </div>
    );
}