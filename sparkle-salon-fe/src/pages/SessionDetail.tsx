import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Booking, cancelMySession, getBookingById, getSessionById } from "../data/userData";
import { FaCheck, FaTimes, FaCreditCard, FaMoneyBillWave, FaCalendarAlt, FaClipboardList, FaArrowLeft, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import UpdateSessionModal from "../components/SessionAction";

// Define the Session interface
interface Session {
    id: number;
    bookingId: number;
    bookingDate: string;
    img: string | null;
    imgAfter: string | null;
    imgBefore: string | null;
    note: string;
    roomId: number;
    roomName: string | null;
    serviceName: string;
    serviceId: number;
    sessionDateTime: string;
    staffName: string | null;
    status: string;
    therapistName: string;
    userName: string;
}
interface SessionDetailProps {
    isStaff: boolean;
}
export default function SessionDetail({isStaff}: SessionDetailProps) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        const fetchSession = async () => {
            try {
                setIsLoading(true);
                if (!id) {
                    setError("Không tìm thấy ID đặt chỗ");
                    return;
                }
                const response = await getSessionById(Number(id));
                if (response) {
                    setSession(response);
                } else {
                    setError("Không tìm thấy thông tin lịch hẹn");
                }
            } catch (err) {
                setError("Có lỗi xảy ra khi lấy dữ liệu");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSession();
    }, [id,isOpen]);

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'PAID':
            case 'COMPLETED':
                return 'bg-green-100 text-green-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'CANCELLED':
            case 'IS_CANCELED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };


    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }
    const handleCancelSession = async (sessionId: number) => {
        try {
            const response = await cancelMySession(sessionId);
            toast.success("Hủy lịch thành công")
            setIsLoading(!isLoading);

        } catch (error) {
            console.log(error);
            toast.error("Hủy lịch không thành công");
        }
    };
    console.log("check", isStaff);
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

    if (!session) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="p-6 bg-white rounded-lg shadow-lg text-center">
                    <FaTimes className="mx-auto text-red-500 text-4xl mb-4" />
                    <p className="text-red-500 text-xl font-medium">Không tìm thấy thông tin phiên điều trị</p>
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

    // Extract date and time from sessionDateTime
    const sessionDate = session.sessionDateTime.split('T')[0];
    const sessionTime = session.sessionDateTime.split('T')[1];
    return (
        <div className="bg-white min-h-screen">
            {(isStaff === false) && 
            <div className="relative w-full h-[170px] flex flex-col justify-center items-center bg-[url('/assets/sparkle-salon-title.jpg')] bg-cover bg-center bg-no-repeat mt-16">
                <div className="absolute inset-0 bg-black opacity-40"></div>
                <h1 className=" mt-10 relative z-10 text-white text-7xl font-bold">
                    Chi tiết đặt lịch
                </h1>
            </div>
            } 
            <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-2xl mx-auto mt-4 ">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-4">
                    <h2 className="text-xl font-bold text-white">Chi tiết phiên điều trị #{session.id} </h2>
                    <div className="mt-2 flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(session.status)}`}>
                            {session.status}
                        </span>
                        {!isStaff && session.status === "WAITING" && (
                            <motion.button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCancelSession(session.id);
                                }}
                                className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1.5 shadow-sm"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <FaTrash size={14} /> Hủy
                            </motion.button>
                        )}
                        
                        {isStaff && 
                        <button className="px-3 py-1 rounded-full text-md font-medium text-white bg-green-500 hover:bg-white hover:text-black"
                         onClick = {()=> {setIsOpen(true); }}>Update</button>}
                        {isOpen&&
                        <UpdateSessionModal
                            isOpen = {isOpen}
                            setIsOpen={setIsOpen}
                            session = {session}
                        />}
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Section 1: Basic Information */}
                    <div className="border-b pb-6">
                        <h3 className="text-md font-semibold text-gray-700 mb-4">Thông tin cơ bản</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">ID phiên</h4>
                                <p className="mt-1 font-semibold">{session.id}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">ID đặt lịch</h4>
                                <p className="mt-1 font-semibold">{session.bookingId}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Ngày đặt lịch</h4>
                                <p className="mt-1 font-semibold">{session.bookingDate?.split('T')[0] || "N/A"}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Dịch vụ</h4>
                                <p className="mt-1 font-semibold">{session.serviceName}</p>
                            </div>
                            <div className="col-span-2">
                                <h4 className="text-sm font-medium text-gray-500">Hình ảnh</h4>
                                <div className="mt-1">
                                    {session.img ? (
                                        <img src={session.img} alt="Service" className="h-32 w-auto object-cover rounded-md" />
                                    ) : (
                                        <p className="text-gray-500 italic">Không có hình ảnh</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: People & Schedule */}
                    <div className="border-b pb-6">
                        <h3 className="text-md font-semibold text-gray-700 mb-4">Người thực hiện & Lịch trình</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Khách hàng</h4>
                                <p className="mt-1 font-semibold">{session.userName}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Chuyên viên</h4>
                                <p className="mt-1 font-semibold">{session.therapistName || "Chưa xác định"}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Nhân viên</h4>
                                <p className="mt-1 font-semibold">{session.staffName || "Chưa xác định"}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Phòng</h4>
                                <p className="mt-1 font-semibold">{session.roomName || "Chưa xác định"}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Ngày hẹn</h4>
                                <p className="mt-1 font-semibold">{sessionDate}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Giờ hẹn</h4>
                                <p className="mt-1 font-semibold">{sessionTime}</p>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Notes & Images */}
                    <div>
                        <h3 className="text-md font-semibold text-gray-700 mb-4">Ghi chú & Hình ảnh kết quả</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500">Ghi chú</h4>
                                <p className="mt-1 p-3 bg-gray-50 rounded-md">
                                    {session.note ? session.note : "Không có ghi chú"}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Hình ảnh trước</h4>
                                    <div className="mt-1 h-40 bg-gray-100 rounded-md flex items-center justify-center">
                                        {session.imgBefore ? (
                                            <img src={session.imgBefore} alt="Before" className="h-full w-full object-cover rounded-md" />
                                        ) : (
                                            <p className="text-gray-500 italic">Không có hình ảnh</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Hình ảnh sau</h4>
                                    <div className="mt-1 h-40 bg-gray-100 rounded-md flex items-center justify-center">
                                        {session.imgAfter ? (
                                            <img src={session.imgAfter} alt="After" className="h-full w-full object-cover rounded-md" />
                                        ) : (
                                            <p className="text-gray-500 italic">Không có hình ảnh</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <SessionAction/> */}
        </div>
    );
}