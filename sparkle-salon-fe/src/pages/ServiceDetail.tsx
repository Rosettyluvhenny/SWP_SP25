import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Service, FrontendService, mapServiceToFrontendService } from "../types/service.types";
import { getServiceById } from "../api/serviceApi";
import { feedbacksData } from "../data/feedbacksData";
import { FaClock, FaMoneyBill, FaShare, FaHeart, FaRegHeart } from "react-icons/fa";
import FeedbackForm from "../components/FeedbackForm";
import FeedbackList from "../components/FeedbackList";
import { motion } from "framer-motion";
import 'react-quill/dist/quill.snow.css';
import '../styles/quill-custom.css';
import { toast } from "react-toastify";

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
    const [frontendService, setFrontendService] = useState<FrontendService | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [feedbacks, setFeedbacks] = useState<Feedback[]>(feedbacksData);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchService = async () => {
            try {
                setIsLoading(true);
                if (!id) {
                    setError("Service ID is missing");
                    return;
                }
                
                // Fetch service from API
                const serviceData = await getServiceById(parseInt(id));
                setService(serviceData);
                
                // Convert to frontend service format for compatibility
                setFrontendService(mapServiceToFrontendService(serviceData));
                setError(null);
            } catch (err) {
                console.error("Error fetching service:", err);
                setError("Failed to load service details");
                toast.error("Không thể tải thông tin dịch vụ. Vui lòng thử lại sau.");
            } finally {
                setTimeout(() => setIsLoading(false), 500);
            }
        };

        fetchService();
    }, [id]);

    const handleBooking = () => {
        if (frontendService) {
            // Fix for URL in name field
            const displayName = frontendService.name.startsWith("http") 
                ? "Trẻ Hóa Da Công Nghệ Cao" 
                : frontendService.name;
                
            navigate("/contact", { 
                state: { 
                    selectedService: displayName,
                    service: {
                        id: frontendService.id,
                        name: displayName,
                        price: frontendService.price,
                        duration: frontendService.duration
                    }
                } 
            });
        }
    };

    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        toast.success(isFavorite ? "Đã xóa khỏi danh sách yêu thích" : "Đã thêm vào danh sách yêu thích");
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: frontendService?.name || 'Sparkle Salon Service',
                text: `Check out this service: ${frontendService?.name}`,
                url: window.location.href,
            })
            .catch((error) => console.log('Error sharing', error));
        } else {
            const url = window.location.href;
            navigator.clipboard.writeText(url);
            toast.success("Đã sao chép liên kết!");
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8 mt-16">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-80 bg-gray-200 rounded mb-6"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !frontendService) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8 mt-16 text-center">
                <h2 className="text-2xl font-bold text-red-500 mb-4">
                    {error || "Service not found"}
                </h2>
                <p className="mb-6">The service you're looking for could not be found.</p>
                <button
                    className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
                    onClick={() => navigate("/service")}
                >
                    Back to Services
                </button>
            </div>
        );
    }

    // Fix for URL in name field
    const displayName = frontendService.name.startsWith("http") 
        ? "Trẻ Hóa Da Công Nghệ Cao" 
        : frontendService.name;

    // Fix for potentially broken image URLs
    const imageUrl = frontendService.img && frontendService.img.startsWith("http") 
        ? frontendService.img 
        : "/placeholder.jpg";

    return (
        <div className="bg-white min-h-screen mt-16">
            {/* Breadcrumb */}
            <div className="bg-gray-100 py-3">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-sm text-gray-600">
                        <Link to="/" className="hover:text-pink-500 transition-colors">Trang chủ</Link> {" / "}
                        <Link to="/service" className="hover:text-pink-500 transition-colors">Dịch vụ</Link> {" / "}
                        <span className="text-pink-500">{displayName}</span>
                    </div>
                </div>
            </div>

            {/* Service Detail Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Service Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative rounded-xl overflow-hidden shadow-xl"
                    >
                        <img 
                            src={imageUrl} 
                            alt={displayName}
                            className="w-full h-auto object-cover rounded-xl"
                        />
                        <div className="absolute top-4 right-4 z-10">
                            <button 
                                onClick={toggleFavorite}
                                className="bg-white p-3 rounded-full shadow-md hover:bg-pink-50 transition-colors"
                                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                            >
                                {isFavorite ? 
                                    <FaHeart className="text-pink-500 text-xl" /> : 
                                    <FaRegHeart className="text-pink-500 text-xl" />
                                }
                            </button>
                        </div>
                    </motion.div>

                    {/* Service Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="bg-pink-50 text-pink-600 px-4 py-1 rounded-full inline-block mb-4">
                            {frontendService.category || "Thẩm mỹ không xâm lấn"}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            {displayName}
                        </h1>
                        
                        <div className="flex items-center mb-6">
                            <div className="flex items-center mr-6">
                                <FaClock className="text-pink-500 mr-2" />
                                <span className="text-gray-700">{frontendService.duration}</span>
                            </div>
                            <div className="flex items-center">
                                <FaMoneyBill className="text-pink-500 mr-2" />
                                <span className="text-gray-700 font-semibold">{frontendService.price.toLocaleString()} vnđ</span>
                            </div>
                        </div>
                        
                        <div className="prose prose-pink max-w-none mb-8" dangerouslySetInnerHTML={{ __html: frontendService.description || '' }}></div>
                        
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button 
                                onClick={handleBooking}
                                className="bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500 text-white py-3 px-8 rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1 flex-1 text-center"
                            >
                                Đặt Hẹn Ngay
                            </button>
                            <button 
                                onClick={handleShare}
                                className="bg-white border border-pink-200 hover:bg-pink-50 text-pink-600 py-3 px-8 rounded-lg transition-all duration-300 font-medium flex items-center justify-center gap-2 flex-1"
                            >
                                <FaShare /> Chia sẻ
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Service Description */}
                {service?.serviceInfo && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-16"
                    >
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-pink-100 pb-3">
                                    Chi Tiết Dịch Vụ
                                </h2>
                                
                                {/* Description */}
                                <div className="mb-12">
                                    <h3 className="text-xl font-semibold text-pink-600 mb-4">Mô Tả</h3>
                                    <div className="prose prose-pink max-w-none" dangerouslySetInnerHTML={{ __html: service.serviceInfo.description || '' }}></div>
                                    
                                    {service.serviceInfo.desImgUrl && (
                                        <img 
                                            src={service.serviceInfo.desImgUrl} 
                                            alt="Description illustration" 
                                            className="mt-6 rounded-lg w-full max-w-2xl mx-auto"
                                        />
                                    )}
                                </div>
                                
                                {/* Technology */}
                                {service.serviceInfo.tech && (
                                    <div className="mb-12">
                                        <h3 className="text-xl font-semibold text-pink-600 mb-4">Công Nghệ</h3>
                                        <div className="prose prose-pink max-w-none" dangerouslySetInnerHTML={{ __html: service.serviceInfo.tech || '' }}></div>
                                        
                                        {service.serviceInfo.techImgUrl && (
                                            <img 
                                                src={service.serviceInfo.techImgUrl} 
                                                alt="Technology illustration" 
                                                className="mt-6 rounded-lg w-full max-w-2xl mx-auto"
                                            />
                                        )}
                                    </div>
                                )}
                                
                                {/* Mechanism */}
                                {service.serviceInfo.mechanism && (
                                    <div>
                                        <h3 className="text-xl font-semibold text-pink-600 mb-4">Cơ Chế Hoạt Động</h3>
                                        <div className="prose prose-pink max-w-none" dangerouslySetInnerHTML={{ __html: service.serviceInfo.mechanism || '' }}></div>
                                        
                                        {service.serviceInfo.mechaImgUrl && (
                                            <img 
                                                src={service.serviceInfo.mechaImgUrl} 
                                                alt="Mechanism illustration" 
                                                className="mt-6 rounded-lg w-full max-w-2xl mx-auto"
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Feedback Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mt-16"
                >
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-pink-100 pb-3">
                                Đánh Giá Từ Khách Hàng
                            </h2>
                            
                            <FeedbackList feedbacks={feedbacks} />
                            
                            <div className="mt-12">
                                <h3 className="text-xl font-semibold text-pink-600 mb-4">Chia Sẻ Trải Nghiệm Của Bạn</h3>
                                <FeedbackForm 
                                    onSubmit={(feedback) => {
                                        setFeedbacks([...feedbacks, feedback]);
                                        toast.success("Cảm ơn bạn đã gửi đánh giá!");
                                    }} 
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}