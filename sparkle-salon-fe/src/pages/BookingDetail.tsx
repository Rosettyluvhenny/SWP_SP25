import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Booking, getBookingById, getSessionByBookingId, getSessionById, getUrlPayment } from "../data/userData";
import { FaCheck, FaTimes, FaCreditCard, FaMoneyBillWave, FaCalendarAlt, FaClipboardList, FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";

export default function BookingDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sessions, setSessions] = useState<[]>([]);
    useEffect(() => {
        const fetchBooking = async () => {
            try {
                setIsLoading(true);
                if (!id) {
                    setError("Không tìm thấy ID đặt chỗ");
                    return;
                }
                const response = await getBookingById(id);
                if (response) {
                    setBooking(response);
                } else {
                    setError("Không tìm thấy thông tin đặt chỗ");
                }
            } catch (err) {
                setError("Có lỗi xảy ra khi lấy dữ liệu");
            } finally {
                setIsLoading(false);
            }
        };
        const fetchSession = async() => {
            try{
                const response = await getSessionByBookingId(Number(id));
                if(response)
                    setSessions(response);
            }catch(error){
                console.log(error);
            }

        }
        fetchBooking();
        fetchSession();
    }, [id]);

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'PAID':
            case 'COMPLETED':
                return 'bg-green-100 text-green-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getBannerText = (status: string) => {
        switch (status.toUpperCase()) {
            case 'PAID':
            case 'COMPLETED':
                return 'Dịch vụ đã hoàn thành';
            case 'PENDING':
                return 'Đặt dịch vụ thành công';
            case 'CANCELLED':
                return 'Đặt dịch vụ thất bại';
            case 'ON_GOING': 
                return 'Thanh toán thành công'
            default:
                return '';
        }
    };
    async function handleCard(booking: any) {
        if(booking.url){
            alert("Đang chuyển hướng đến trang thanh toán...");
            window.open(booking.url, "_self");
        }
        else{
            const response = await getUrlPayment(booking.id);
            if (response && response.url) {
                alert("Đang chuyển hướng đến trang thanh toán...");
                window.open(response.url, "_self");
            } 
        }
    }
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="p-6 bg-white rounded-lg shadow-lg text-center">
                    <FaTimes className="mx-auto text-red-500 text-4xl mb-4" />
                    <p className="text-red-500 text-xl font-medium">{error}</p>
                    <button 
                        onClick={() => navigate(-1)} 
                        className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-300 flex items-center justify-center"
                    >
                        <FaArrowLeft className="mr-2" /> Quay lại
                    </button>
                </div>
            </div>
        );
    }

    
    return (
        <>
        <div className="bg-gray-50 min-h-screen pb-12">
            {/* Hero section with payment status */}
            <div className="relative w-full h-48 sm:h-64 flex flex-col justify-center items-center bg-[url('/assets/sparkle-salon-title.jpg')] bg-cover bg-center bg-no-repeat mt-16">
                <div className="absolute inset-0 bg-black opacity-50"></div>
                    <div className="relative z-10 text-center">
                        <h1 className="text-500 text-3xl sm:text-5xl font-bold text-white">
                  {/* <FaTimes className="mx-auto text-red-500 text-4xl mb-2" /> */}
                            {getBannerText(booking.status)||"Chi tiết lịch hẹn"}
                        </h1>
                    </div>
            </div>

            {/* Booking details content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header with service name */}
                    <div className="p-6 border-b border-gray-200 mt-16">
                        <h2 className="text-2xl font-bold text-gray-800">{booking?.serviceName}</h2>
                        <p className="text-sm text-gray-500">ID: {booking?.id}</p>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Service image */}
                            <div className="mb-6 md:mb-0">
                                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                                    <img 
                                        src={booking?.img} 
                                        alt={booking?.serviceName} 
                                        className="w-full h-64 object-cover rounded-lg" 
                                    />
                                </div>
                            </div>

                            {/* Booking details */}
                            <div className="flex flex-col justify-between">
                                {/* Price */}
                                <div className="mb-4 p-4 bg-purple-50 rounded-lg">
                                    <p className="text-sm text-purple-700 font-medium">Giá dịch vụ</p>
                                    <p className="text-2xl font-bold text-purple-900">{booking?.price.toLocaleString()} VND</p>
                                </div>

                                {/* Status badges */}
                                <div className="mb-4 flex flex-wrap gap-3">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking?.paymentStatus || "")}`}>
                                        <FaCreditCard className="mr-1" /> {booking?.paymentStatus}
                                    </span>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking?.status || "")}`}>
                                        <FaCalendarAlt className="mr-1" /> {booking?.status}
                                    </span>
                                </div>

                                {/* Payment and sessions info */}
                                <div className="mb-4 space-y-2">
                                    <div className="flex items-center text-gray-700">
                                        <FaMoneyBillWave className="mr-2 text-purple-600" />
                                        <span className="font-medium">Phương thức thanh toán:</span>
                                        <span className="ml-2">{booking?.paymentMethod}</span>
                                    </div>
                                    <div className="flex items-center text-gray-700">
                                        <FaCalendarAlt className="mr-2 text-purple-600" />
                                        <span className="font-medium">Số buổi còn lại:</span>
                                        <span className="ml-2">{booking?.sessionRemain}</span>
                                    </div>
                                </div>

                                {/* Notes */}
                                {booking?.notes && (
                                    <div className="mb-4">
                                        <div className="flex items-start">
                                            <FaClipboardList className="mr-2 text-purple-600 mt-1" />
                                            <div>
                                                <h3 className="font-medium text-gray-700">Ghi chú:</h3>
                                                <p className="text-gray-600 mt-1">{booking.notes}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer with back button */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                        <button 
                            onClick={() => navigate(-1)} 
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition duration-300 flex items-center"
                        >
                            <FaArrowLeft className="mr-2" /> Quay lại
                        </button>
                        {booking?.serviceId && (
                            <button 
                                onClick={() => navigate(`/service/${booking.serviceId}`)} 
                                className="px-4 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50 transition duration-300"
                            >
                                Xem chi tiết dịch vụ
                            </button>
                        )}

                        {(booking?.sessionRemain>0 && booking?.status=="ON_GOING") && (
                            <button 
                                onClick={() => navigate(`/bookingSession?booking=${booking.id}`)} 
                                className="px-4 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50 transition duration-300"
                            >
                                Đặt lịch
                            </button>
                        )}
                         {(booking?.paymentMethod=="Thanh toán qua thẻ ngân hàng" && booking?.status=="PENDING") && (
                            <button 
                                onClick={() => handleCard(booking)} 
                                className="px-4 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50 transition duration-300"
                            >
                                <FaMoneyBillWave/>
                                Thanh toán
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <motion.div
                className="bg-pink-100 shadow-lg rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
                <div className="overflow-x-auto mt-10">
                    <table className="w-full border-collapse rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-white text-black">
                                <th className="p-3 text-left">Id lịch hẹn</th>
                                <th className="p-3 text-left">Ngày hẹn</th>
                                <th className="p-3 text-left">Thời gian</th>
                                <th className="p-3 text-left">Trạng Thái</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {sessions.length > 0 ? (
                                sessions.map((session) => (
                                    <motion.tr
                                        key={session.id}
                                        className="border-t hover:bg-pink-50/80 transition-colors text-left cursor-pointer"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        onClick={() => { navigate(`/sessionDetail/${session.id}`) }}
                                    >
                                        <td className="p-4 font-medium text-gray-700">
                                            {session.id}
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {session.sessionDateTime.slice(0, 10)}
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {session.sessionDateTime.slice(11)}
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(session.status) || ""
                                                    }`}
                                            >
                                                {session.status}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={9}
                                        className="p-4 text-center text-gray-500"
                                    >
                                        Bạn chưa có lịch đặt nào!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
       
        </>
        
    );
}