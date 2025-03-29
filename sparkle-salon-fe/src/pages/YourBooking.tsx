import { getUserBookings, Booking, getUrlPayment } from "../data/userData";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Pagination from "../components/Pagination";
import { cancelBooking } from "../data/userData"
import { toast } from "react-toastify"
import BookingTableRow from "../components/BookingTableRow";
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
                toast.error("Không thể lấy danh sách lịch đặt!");
            }
        };
        fetchBookings();
    }, [searchUrl]);


    

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
                toast.success("Đang chuyển hướng đến trang thanh toán...");
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

    const handleCancelBooking = async (id: string) => {
        const confirmDelete = window.confirm(
            "Bạn có chắc chắn muốn huỷ lịch hẹn này?"
        );
        if (confirmDelete) {
                const response = await cancelBooking(id);
                toast.success(response);
                navigate(`/bookingDetail/${id}`)
        }
    };
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
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Tên Dịch Vụ</th>
                                <th className="p-3 text-left">Hình Ảnh</th>
                                <th className="p-3 text-left">Giá (VND)</th>
                                <th className="p-3 text-left">Số Buổi</th>
                                <th className="p-3 text-left">Trạng Thái</th>
                                <th className="p-3 text-left">Phương Thức TT</th>
                                <th className="p-3 text-left">Trạng Thái TT</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {bookings.length > 0 ? (
                                bookings.map((booking) => (
                                    <BookingTableRow
                                        isStaff= {false}
                                        key={booking.id}
                                        booking={booking}
                                        getStatusColor={getStatusColor}
                                        handleSessionBooking={handleSessionBooking}
                                        handleCancelBooking={handleCancelBooking}
                                        handleRebook={handleRebook}
                                        handleCard={handleCard}
                                        handleCheckin={() => {}}
                                    />
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
