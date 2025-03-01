import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaMoneyBill, FaArrowLeft } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { servicesApi, serviceInfoApi } from "../api";
import { adaptServiceToFrontend } from "../utils/serviceAdapter";
import { toast } from "react-toastify";
import { Service } from "../types/service";
import { ServiceInfo } from "../api/types";
import EncodedText from "../components/EncodedText";

const ServiceDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [service, setService] = useState<Service | null>(null);
    const [serviceInfo, setServiceInfo] = useState<ServiceInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchServiceDetails = async () => {
            if (!id) return;
            
            try {
                setIsLoading(true);
                
                // Fetch service details
                const serviceData = await servicesApi.getById(parseInt(id));
                const adaptedService = adaptServiceToFrontend(serviceData);
                setService(adaptedService);
                
                // Fetch service info
                try {
                    const serviceInfoData = await serviceInfoApi.getByServiceId(parseInt(id));
                    setServiceInfo(serviceInfoData);
                } catch (infoErr) {
                    console.warn("No service info found:", infoErr);
                    setServiceInfo(null);
                }
                
                setError(null);
            } catch (err) {
                console.error("Error fetching service details:", err);
                setError("Không thể tải thông tin dịch vụ. Vui lòng thử lại sau.");
                toast.error("Không thể tải thông tin dịch vụ");
            } finally {
                setIsLoading(false);
            }
        };

        fetchServiceDetails();
    }, [id]);

    const handleBooking = () => {
        if (service) {
            navigate("/contact", { 
                state: { 
                    service: {
                        id: service.id,
                        name: service.name,
                        price: service.price,
                        duration: service.duration
                    }
                } 
            });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-t from-white to-pink-200 pt-20">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="md:w-1/2">
                                <div className="bg-gray-200 h-96 rounded-xl mb-4"></div>
                            </div>
                            <div className="md:w-1/2">
                                <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
                                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                                <div className="h-6 bg-gray-200 rounded w-1/3 mb-8"></div>
                                <div className="h-32 bg-gray-200 rounded mb-8"></div>
                                <div className="flex gap-4">
                                    <div className="h-12 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-12 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !service) {
        return (
            <div className="min-h-screen bg-gradient-to-t from-white to-pink-200 pt-20">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="bg-red-100 p-6 rounded-lg text-red-700">
                        <h2 className="text-xl font-semibold mb-2">Lỗi</h2>
                        <p>{error || "Không tìm thấy dịch vụ"}</p>
                        <button 
                            onClick={() => navigate(-1)}
                            className="mt-4 flex items-center text-pink-600 hover:text-pink-800"
                        >
                            <FaArrowLeft className="mr-2" /> Quay lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-t from-white to-pink-200 pt-20">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Back button */}
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center text-pink-600 hover:text-pink-800 mb-8"
                >
                    <FaArrowLeft className="mr-2" /> Quay lại danh sách dịch vụ
                </button>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Service Image */}
                    <div className="md:w-1/2">
                        <img 
                            src={serviceInfo?.serviceImgUrl || service.img || "/placeholder.jpg"} 
                            alt={service.name} 
                            className="w-full h-auto rounded-xl shadow-lg object-cover"
                        />
                    </div>

                    {/* Service Details */}
                    <div className="md:w-1/2">
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <div className="inline-block bg-gradient-to-r from-pink-500 to-pink-400 text-white px-3 py-1 rounded-full text-sm mb-4">
                                <EncodedText text={service.category || "Thẩm mỹ không xâm lấn"} />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-4">
                                <EncodedText text={service.name} />
                            </h1>
                            
                            <div className="flex flex-wrap gap-4 mb-6">
                                <div className="flex items-center text-pink-600 font-semibold text-xl">
                                    <FaMoneyBill className="mr-2" />
                                    {service.price.toLocaleString()} vnđ
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <IoMdTime className="mr-2 text-pink-500" />
                                    {service.duration}
                                </div>
                            </div>
                            
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold mb-2 text-gray-800">Mô tả</h2>
                                <div className="text-gray-600">
                                    <EncodedText text={service.description || "Không có mô tả chi tiết cho dịch vụ này."} />
                                </div>
                            </div>
                            
                            {/* Action buttons */}
                            <div className="flex flex-row gap-4">
                                <button
                                    className="flex-1 bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500 text-white py-3 px-4 rounded-lg transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1"
                                    onClick={handleBooking}
                                >
                                    Đặt Hẹn Ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Service Info Section */}
                {serviceInfo && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Thông tin chi tiết</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {serviceInfo.description && (
                                <div className="bg-white p-6 rounded-xl shadow-lg">
                                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Mô tả chi tiết</h3>
                                    <div className="text-gray-600 mb-4">
                                        <EncodedText text={serviceInfo.description} />
                                    </div>
                                    {serviceInfo.desImgUrl && (
                                        <img 
                                            src={serviceInfo.desImgUrl} 
                                            alt="Mô tả chi tiết" 
                                            className="w-full h-auto rounded-lg mt-4"
                                        />
                                    )}
                                </div>
                            )}
                            {serviceInfo.tech && (
                                <div className="bg-white p-6 rounded-xl shadow-lg">
                                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Công nghệ</h3>
                                    <div className="text-gray-600 mb-4">
                                        <EncodedText text={serviceInfo.tech} />
                                    </div>
                                    {serviceInfo.techImgUrl && (
                                        <img 
                                            src={serviceInfo.techImgUrl} 
                                            alt="Công nghệ" 
                                            className="w-full h-auto rounded-lg mt-4"
                                        />
                                    )}
                                </div>
                            )}
                            {serviceInfo.mechanism && (
                                <div className="bg-white p-6 rounded-xl shadow-lg">
                                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Cơ chế</h3>
                                    <div className="text-gray-600 mb-4">
                                        <EncodedText text={serviceInfo.mechanism} />
                                    </div>
                                    {serviceInfo.mechaImgUrl && (
                                        <img 
                                            src={serviceInfo.mechaImgUrl} 
                                            alt="Cơ chế" 
                                            className="w-full h-auto rounded-lg mt-4"
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServiceDetail;