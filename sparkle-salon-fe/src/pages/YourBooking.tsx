import { getUserBookings, Booking, getUrlPayment } from "../data/userData";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMoneyBill, FaMoneyBillAlt, FaRedo, FaTrash } from "react-icons/fa";
import { Service, serviceDataById } from "../data/servicesData";
import Pagination from "../components/Pagination";
import { cancelBooking } from "../data/userData"
import { toast } from "react-toastify"
export default function YourBooking() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [elementsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [searchUrl, setSearchUrl] = useState(`?size=${elementsPerPage}`);
    const [status, setStatus] = useState("");
    const [sort, setsort] = useState("");

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber)
    };
    useEffect(() => {
        const fetchBookings = async () => {
            const response = await getUserBookings(searchUrl);

            console.log("response", response);
            if (response) {
                setBookings(response.bookings);
                setTotalPages(response.meta.totalPages);
            } else {
                alert("Không thể lấy danh sách lịch đặt!");
            }
        };
        fetchBookings();
    }, [searchUrl]);


    const handleCancelBooking = async (id: string) => {
        const confirmDelete = window.confirm(
            "Bạn có chắc chắn muốn huỷ lịch hẹn này?"
        );
        if (confirmDelete) {
            try {
                const response = await cancelBooking(id);
                toast.success(response);
                const bookings = await getUserBookings(searchUrl);
                if (bookings) {
                    setBookings(bookings);
                }
                // toast.success("Huỷ lịch thành công");
            } catch (error) {
                // console.error("Error deleting booking:", error);
                toast.error("Hủy lịch thất bại")
            }
        }
    };

    useEffect(() => {
        setCurrentPage(1);
        setSearchUrl(
            `?${status ? `status=${status}&` : ""}page=${currentPage - 1}&size=${elementsPerPage}&sort=${sort}`
        );
    },[status, sort])

    useEffect(() => {
        setSearchUrl(
            `?${status ? `status=${status}&` : ""}page=${currentPage - 1}&size=${elementsPerPage}&sort=${sort}`
        );
    }, [currentPage])
  

    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'PAID':
            case 'COMPLETED':
                return 'bg-green-100 text-green-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'CANCELLED':
                return 'bg-red-100 text-red-800';
            case 'ON_GOING':
                return 'bg-orange-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    const statuses = [
        { value: "ON_GOING", label: "On Going" },
        { value: "IS_CANCELED", label: "Cancelled" },
        { value: "PENDING", label: "Pending" },
        { value: "COMPLETED", label: "Completed" },

    ];
    const sorts = [
        { value: "createAt,desc", label: "Newest" },
        { value: "createAt,asc", label: "Oldest" }

    ]
    async function handleCard(booking: any) {
        if (booking.url)
            window.open(booking.url, "_self");
        else {
            const response = await getUrlPayment(booking.id);
            if (response && response.url) {
                alert("Đang chuyển hướng đến trang thanh toán...");
                window.open(response.url, "_self");
            }
        }
    }
    const handleRebook = (serviceId: number) => {
        navigate(`/booking?service=${serviceId}`);
    };

    const handleSessionBooking = (bookingId: number) => {
        navigate(`/bookingSession?booking=${bookingId}`)
    }
    return (
        <div className="bg-white min-h-screen">
            <div className="relative w-full h-[170px] flex flex-col justify-center items-center bg-[url('/assets/sparkle-salon-title.jpg')] bg-cover bg-center bg-no-repeat mt-16">
                <div className="absolute inset-0 bg-black opacity-40"></div>
                <h1 className="relative z-10 text-white text-7xl font-serif">
                    Booking History
                </h1>
            </div>
            <div className="flex flex-col md:flex-row justify-left items-center gap-4 bg-white p-4 rounded-lg shadow-md -mt-8 relative z-20">
                <select
                    value={status}
                    onChange={(e) => { setStatus(e.target.value); console.log(e.target.value) }}
                    className="border p-2 rounded"
                >
                    <option value="">Select a status</option>
                    {statuses && statuses.map((stat, index) => (
                        <option key={index} value={stat.value}>
                            {stat.label}
                        </option>
                    ))}
                </select>
                <select
                    value={sort}
                    onChange={(e) => { setsort(e.target.value); console.log(e.target.value) }}
                    className="border p-2 rounded"
                >
                    <option value="">Select sort</option>
                    {sorts && sorts.map((stat, index) => (
                        <option key={index} value={stat.value}>
                            {stat.label}
                        </option>
                    ))}
                </select>
            </div>
            {/* Services Table */}
            <motion.div
                className="bg-pink-100 shadow-lg rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
            >
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-white text-black">
                                <th className="p-3 text-left">Tên Dịch Vụ</th>
                                <th className="p-3 text-left">Hình Ảnh</th>
                                <th className="p-3 text-left">Giá (VND)</th>
                                <th className="p-3 text-left">Số Buổi</th>
                                <th className="p-3 text-left">Trạng Thái</th>
                                <th className="p-3 text-left">
                                    Phương Thức TT
                                </th>
                                <th className="p-3 text-left">Trạng Thái TT</th>
                                <th className="p-3 text-left">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {bookings.length > 0 ? (
                                bookings.map((booking) => (
                                    <motion.tr
                                        key={booking.id}
                                        className="border-t hover:bg-pink-50 transition-colors"
                                        initial={{
                                            opacity: 0,
                                        }}
                                        animate={{
                                            opacity: 1,
                                        }}
                                        transition={{
                                            duration: 0.3,
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/bookingDetail/${booking.id}`)
                                        }}
                                    >
                                        <td className="p-3 font-medium">
                                            {booking.serviceName}
                                        </td>
                                        <td className="p-3 font-medium">
                                            <img
                                                src={
                                                    booking.img
                                                }
                                                alt={booking.serviceName}
                                                className="w-auto h-16"
                                            />
                                        </td>
                                        <td className="p-3">
                                            {booking.price}
                                        </td>
                                        <td className="p-3">
                                            {booking.sessionRemain}
                                        </td>
                                        <td className="p-3">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status) || ""
                                                    }`}
                                            >
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            {booking.paymentMethod}
                                        </td>
                                        <td className="p-3">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status) || ""
                                                    }`}
                                            >
                                                {booking.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="p-3 flex space-x-2">
                                            {(booking.status == "ON_GOING" && booking.sessionRemain > 0) &&
                                                <motion.button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        handleSessionBooking(booking.id)
                                                    }
                                                    }
                                                    className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 flex items-center gap-1"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    Đặt lịch
                                                </motion.button>
                                            }
                                            {booking.status == "PENDING" &&
                                                <motion.button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        handleCancelBooking(
                                                            booking.id
                                                        )
                                                    }
                                                    }
                                                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 flex items-center gap-1"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <FaTrash size={14} /> Hủy
                                                </motion.button>
                                            }
                                            {(booking.status == "COMPLETED" || booking.status == "IS_CANCELED") &&
                                                <motion.button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        handleRebook(booking.serviceId)
                                                    }}
                                                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 flex items-center gap-1"

                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <FaRedo size={14} /> Đặt lại
                                                </motion.button>
                                            }
                                            {(booking.status == "PENDING" && booking.paymentMethod == "Thanh toán qua thẻ ngân hàng") &&
                                                <motion.button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        handleCard(booking)
                                                    }}
                                                    className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 flex items-center gap-1"

                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <FaMoneyBillAlt size={14} /> Thanh toán
                                                </motion.button>
                                            }


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
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                paginate={paginate}
            />
        </div>
    );
}
