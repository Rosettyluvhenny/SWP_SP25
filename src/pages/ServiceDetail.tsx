import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import  { Service, serviceDataById, servicesData } from "../data/servicesData";
import { feedbacksData } from "../data/feedbacksData";
import { FaClock, FaMoneyBill, FaCalendarAlt } from "react-icons/fa";
import FeedbackForm from "../components/FeedbackForm";
import FeedbackList from "../components/FeedbackList";
import { motion } from "framer-motion";

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
    const [relatedServices, setRelatedServices] = useState<Service[]>([]);

    useEffect(() => {
        const fetchRelatedServices = async () => {
            const services = await servicesData();
            setRelatedServices(services);
        }
        fetchRelatedServices();
        const fetchService = async () => {
            try {
                setIsLoading(true);
                if (!id) {
                    setError("Service ID is missing");
                    return;
                }
                
                // Find the service by ID
                const foundService = await serviceDataById(id)
                
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
                setTimeout(() => setIsLoading(false), 500); 
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
            <div className="bg-gradient-to-b from-pink-50 to-white mt-24 min-h-screen">
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
            <div className="bg-gradient-to-b from-pink-50 to-white mt-24 min-h-screen">
                <div className="max-w-7xl mx-auto p-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="text-2xl text-red-500 font-semibold mb-4">
                            {error || "Dịch vụ không tồn tại..."}
                        </p>
                        <motion.button 
                            onClick={() => navigate("/service")}
                            className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Quay lại danh sách dịch vụ
                        </motion.button>
                    </motion.div>
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
        <div className="bg-gradient-to-b from-pink-50 to-white mt-24 min-h-screen">
            <div className="max-w-7xl mx-auto p-6">
                {/* Breadcrumb Navigation */}
                <motion.div 
                    className="mb-6 text-sm text-gray-600"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Link to="/" className="hover:text-pink-500 transition-colors">Trang chủ</Link> {" / "}
                    <Link to="/service" className="hover:text-pink-500 transition-colors">Dịch vụ</Link> {" / "}
                    <span className="text-pink-500">{displayName}</span>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <motion.div 
                        className="lg:col-span-3 space-y-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Top Section */}
                        <div className="bg-white shadow-lg p-6 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative overflow-hidden rounded-xl">
                                <img
                                    src={imageUrl}
                                    alt={displayName}
                                    className="w-full h-80 object-cover rounded-xl border border-pink-200 transition-transform duration-500 hover:scale-105"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/placeholder.jpg";
                                    }}
                                />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                                    {displayName}
                                </h1>
                                <div className="bg-pink-50 p-3 rounded-lg mb-4">
                                    <p className="text-pink-600 text-xl font-semibold flex items-center">
                                        <FaMoneyBill className="inline-block mr-2" />
                                        {service.price.toLocaleString()} vnđ
                                        <span className="text-sm ml-2 text-gray-500">(Đã bao gồm VAT)</span>
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 mb-6">
                                    <p className="flex items-center text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                                        <FaClock className="mr-2 text-pink-500" />
                                        {service.duration}
                                    </p>
                                    <p className="flex items-center text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                                        <FaCalendarAlt className="mr-2 text-pink-500" />
                                        {service.session} buổi
                                    </p>
                                    {service.categoryName && (
                                        <p className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full">
                                            {service.categoryName}
                                        </p>
                                    )}
                                </div>
                                <motion.button
                                    className="bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500 text-white py-3 px-6 rounded-lg text-lg font-semibold shadow-md w-full"
                                    onClick={handleBooking}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Đặt hẹn ngay
                                </motion.button>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="bg-white shadow-lg p-6 rounded-xl">
                            <div className="border-b pb-2 mb-4">
                                <h2 className="text-xl font-semibold">
                                    Thông tin dịch vụ
                                </h2>
                            </div>
                            
                            <div className="mt-3 quill-content">
                                <div 
                                    className="prose prose-pink max-w-none prose-headings:text-pink-700 prose-a:text-pink-600 prose-strong:text-gray-800 prose-img:rounded-lg prose-img:shadow-md"
                                    dangerouslySetInnerHTML={{ 
                                        __html: service.description || "Chưa có thông tin chi tiết về dịch vụ này."
                                    }}
                                />
                            </div>
                        </div>

                        {/* Feedback Section */}
                        <div className="bg-white shadow-lg p-6 rounded-xl">
                            <h2 className="text-xl font-semibold border-b pb-2 mb-4">
                                Đánh Giá Khách Hàng
                            </h2>
                            <FeedbackList feedbacks={feedbacks} />
                            <FeedbackForm onSubmit={handleFeedbackSubmit} />
                        </div>
                    </motion.div>

                    {/*Sidebar Section */}
                    <motion.aside 
                        className="space-y-6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="bg-white shadow-lg p-5 rounded-xl sticky top-24">
                            <h3 className="text-lg font-bold border-b pb-2 mb-4">
                                Dịch vụ khác
                            </h3>
                            {relatedServices
                                .filter((related) => related.id !== service.id)
                                .slice(0, 5)
                                .map((related, index) => {
                                    // Fix for URL in name field
                                    const relatedDisplayName = related.name.startsWith("http") 
                                        ? "Trẻ Hóa Da Công Nghệ Cao" 
                                        : related.name;
                                    
                                    // Fix for potentially broken image URLs
                                    const relatedImageUrl = related.img && related.img.startsWith("http") 
                                        ? related.img 
                                        : "/placeholder.jpg";
                                        
                                    return (
                                        <motion.div
                                            key={related.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 * index, duration: 0.3 }}
                                        >
                                            <Link
                                                to={`/service/${related.id}`}
                                                className="block mt-4 hover:bg-pink-50 p-3 rounded-lg transition-colors duration-300"
                                            >
                                                <div className="flex gap-4">
                                                    <img
                                                        src={relatedImageUrl}
                                                        alt={relatedDisplayName}
                                                        className="w-20 h-20 rounded-lg object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = "/placeholder.jpg";
                                                        }}
                                                    />
                                                    <div>
                                                        <p className="font-semibold text-gray-900 line-clamp-2">
                                                            {relatedDisplayName}
                                                        </p>
                                                        <p className="text-pink-500 font-medium mt-1">
                                                            {related.price.toLocaleString()} đ
                                                        </p>
                                                        <p className="text-gray-500 text-sm mt-1">
                                                            {related.duration}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                        </div>
                    </motion.aside>
                </div>
            </div>
        </div>
    );
}