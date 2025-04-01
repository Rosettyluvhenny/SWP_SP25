import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

import { FaPhone, FaCalendar, FaSearch } from "react-icons/fa";
import Pagination from "../components/Pagination";
import BookingTableRow from "../components/BookingTableRow";
import { checkInCash, getBookings } from "../data/staffData";
import { cancelBooking } from "../data/userData";

export default function BookingByStaff() {
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [elementsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    
    // New state for additional filters
    const [phone, setPhone] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState("");
    const [sort, setSort] = useState("");
    const [phoneError, setPhoneError] = useState("");

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber)
    };

    // Phone number validation function
    const validatePhoneNumber = (phoneNum: string): boolean => {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phoneNum);
    };

    // Handle phone input with validation
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputPhone = e.target.value;
        setPhone(inputPhone);
        
        // Only set error if there's input and it doesn't match the regex
        if (inputPhone && !validatePhoneNumber(inputPhone)) {
            setPhoneError("Số điện thoại phải chứa chính xác 10 chữ số");
        } else {
            setPhoneError("");
        }
    };

    // Fetch bookings with current filters
    const fetchBookings = async () => {
        try {
            // Construct search URL with all filters
            const urlParams = new URLSearchParams({
                page: (currentPage - 1).toString(),
                size: elementsPerPage.toString(),
                ...(status && { status }),
                ...(sort && { sort }),
                ...(phone && { phone }),
                ...(startDate && { startDate }),
                ...(endDate && { endDate })
            });

            const response = await getBookings(`?${urlParams.toString()}`);

            if (response) {
                setBookings(response.bookings);
                setTotalPages(response.meta.totalPages);
                
                // Notify if no results found
                if (response.bookings.length === 0) {
                    toast.info("Không tìm thấy kết quả nào.");
                }
            } else {
                toast.error("Không thể lấy danh sách lịch đặt!");
            }
        } catch (error) {
            // toast.error("Đã xảy ra lỗi khi tìm kiếm.");
        }
    };

    // Trigger search with validation
    const handleSearchRequest = async () => {
        // Validate phone number if it's not empty
        if (phone && !validatePhoneNumber(phone)) {
            toast.error("Số điện thoại không hợp lệ. Vui lòng nhập 10 chữ số.");
            return;
        }

        // Reset to first page when searching
        setCurrentPage(1);
        
        // Proceed with search
        await fetchBookings();
    };

    // Initial and filter-based fetch
    useEffect(() => {
        fetchBookings();
    }, [currentPage, status, sort, startDate, endDate]);

    const handleCancelBooking = async (id: string) => {
        const confirmDelete = window.confirm(
            "Bạn có chắc chắn muốn huỷ lịch hẹn này?"
        );
        if (confirmDelete) {
            const response = await cancelBooking(id);
            toast.success(response);
            navigate(`/staff/bookingDetail/${id}`)
        }
    };

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
    ];

    async function handleChecking(booking: any) {
        const rq = await checkInCash(booking.id, "PAID");
        // toast.success(rq.message);
        console.log("request",rq);
        setStatus("ON_GOING");
    }

    return (
        <>
         <div className="bg-white min-h-screen pt-10">
            {/* Filters Container */}
            <div className="flex flex-wrap justify-start items-center gap-4 bg-white p-4 rounded-lg shadow-md-mt-8 relative z-20">
                {/* Phone Input with Error Handling */}
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaPhone className="text-gray-400" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Phone Number" 
                        value={phone}
                        onChange={handlePhoneChange}
                        className={`pl-10 p-2 border rounded w-full focus:outline-none 
                            ${phoneError ? 'border-red-500 focus:ring-red-500' : 'focus:ring-2 focus:ring-blue-500'}`}
                    />
                    {phoneError && (
                        <p className="text-red-500 text-xs mt-1 absolute">
                            {phoneError}
                        </p>
                    )}
                </div>

                {/* Start Date Input */}
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaCalendar className="text-gray-400" />
                    </div>
                    <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="pl-10 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* End Date Input */}
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaCalendar className="text-gray-400" />
                    </div>
                    <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="pl-10 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Status Dropdown */}
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select Status</option>
                    {statuses.map((stat, index) => (
                        <option key={index} value={stat.value}>
                            {stat.label}
                        </option>
                    ))}
                </select>

                {/* Sort Dropdown */}
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select Sort</option>
                    {sorts.map((stat, index) => (
                        <option key={index} value={stat.value}>
                            {stat.label}
                        </option>
                    ))}
                </select>

                {/* Search Button */}
                <motion.button
                    onClick={handleSearchRequest}
                    className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-600"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FaSearch />
                    Tìm kiếm
                </motion.button>
            </div>
            
            <motion.div
                className="bg-pink-100 shadow-lg rounded-lg p-6 mt-4"
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
                            {bookings && bookings.length > 0 ? (
                                bookings.map((booking) => (
                                    <BookingTableRow
                                        isStaff = {true}
                                        key={booking.id}
                                        booking={booking}
                                        getStatusColor={getStatusColor}
                                        handleSessionBooking={() => {}}
                                        handleCancelBooking={handleCancelBooking}
                                        handleRebook={() => {}}
                                        handleCard={() => {}}
                                        handleCheckin={handleChecking}
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
        </>
    );
}