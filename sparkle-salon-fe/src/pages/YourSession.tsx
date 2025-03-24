import { getMySession, Booking, cancelMySession } from "../data/userData";
import { useState, useEffect, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaRedo, FaTrash } from "react-icons/fa";
import { Service, serviceDataById } from "../data/servicesData";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";
import Pagination from "../components/Pagination";

export default function YourSession() {
    const [currentPage, setCurrentPage] = useState(1);
    const [elementsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [searchUrl, setSearchUrl] = useState(`?size=${elementsPerPage}`);
    const [ItemPerPage] = useState(10);
    const [status, setStatus] = useState("");
    const [sort, setsort] = useState("");
    const [sessions, setSessions] = useState<{}>([]);
    const navigate = useNavigate();
    // const [loading, setLoading] = useState(false);
    const {loading, setIsLoading} = useContext(UserContext)
    useEffect(() => {

        const fetchSession = async () => {
            const response = await getMySession(searchUrl);
            // console.log("fetch", response);
            if (response.sessions) {
                setSessions(response.sessions);
                setTotalPages(response.meta.totalPages)
            } else {
                alert("Không thể lấy danh sách lịch đặt!");
            }
        };
        fetchSession();
    }, [searchUrl, loading]);


    const handleRebook = (id: number) => {
        navigate(`/bookingSession?booking=${id}`);
    };
    const handleCancelSession = async (sessionId: number) => {
        try {
            const response = await cancelMySession(sessionId);
            toast.success("Hủy lịch thành công")
            setIsLoading(!loading);

        } catch (error) {
            console.log(error);
            toast.error("Hủy lịch không thành công");
        }
    };
    const getStatusColor = (status: string) => {
        switch (status.toUpperCase()) {
            case 'WAITING':
                return 'bg-orange-100 text-green-800'
            case 'COMPLETED':
                return 'bg-green-100 text-green-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'IS_CANCELED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    useEffect(() => {
        setSearchUrl(
            `?${status ? `status=${status}&` : ""}page=${currentPage - 1}&size=${ItemPerPage}&sort=${sort}`
        );
    }, [currentPage])

    useEffect(() => {
        setCurrentPage(1);
        setSearchUrl(
            `?${status ? `status=${status}&` : ""}page=${currentPage - 1}&size=${elementsPerPage}&sort=${sort}`
        );
    },[status, sort])
    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber)
    };
    const statuses = [
        { value: "ON_GOING", label: "On Going" },
        { value: "IS_CANCELED", label: "Cancelled" },
        { value: "PENDING", label: "Pending" },
        { value: "COMPLETED", label: "Completed" },
        { value: "WAITING", label: "Waiting"}
    ];
    const sorts = [
        { value: "sessionDateTime,desc", label: "Newest" },
        { value: "sessionDateTime,asc", label: "Oldest" }

    ]
    return (
        <div className="bg-white min-h-screen">
            <div className="relative w-full h-[170px] flex flex-col justify-center items-center bg-[url('/assets/sparkle-salon-title.jpg')] bg-cover bg-center bg-no-repeat mt-16">
                <div className="absolute inset-0 bg-black opacity-40"></div>
                <h1 className="relative z-10 text-white text-7xl font-serif">
                    Upcoming Session
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
                                <th className="p-3 text-left">Tên Dịch Vụ</th>
                                <th className="p-3 text-left">Hình Ảnh</th>
                                <th className="p-3 text-left">Ngày hẹn</th>
                                <th className="p-3 text-left">Thời gian</th>
                                <th className="p-3 text-left">Trạng Thái</th>
                                <th className="p-3 text-left">Hành Động</th>
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
                                        onClick={() => {
                                            navigate(`/sessionDetail/${session.id}`)
                                        }}
                                    >
                                        <td className="p-4 font-medium text-gray-700">
                                            {session.id}
                                        </td>
                                        <td className="p-4">
                                            <img
                                                src={session.img}
                                                alt={session.serviceName}
                                                className="w-auto h-16 object-contain"
                                            />
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
                                        <td className="p-4">
                                            <div className="flex space-x-2">
                                                {session.status === "WAITING" && (
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
                                                {session.status === "COMPLETED" && (
                                                    <motion.button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            e.preventDefault();
                                                            handleRebook(session.bookingId);
                                                        }}
                                                        className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1.5 shadow-sm"
                                                        whileHover={{ scale: 1.03 }}
                                                        whileTap={{ scale: 0.97 }}
                                                    >
                                                        <FaRedo size={14} /> Đặt lại
                                                    </motion.button>
                                                )}
                                                {session.status === "IS_CANCELED" && (
                                                    <motion.button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            e.preventDefault();
                                                            handleRebook(session.bookingId);
                                                        }}
                                                        className="bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-1.5 shadow-sm"
                                                        whileHover={{ scale: 1.03 }}
                                                        whileTap={{ scale: 0.97 }}
                                                    >
                                                        <FaRedo size={14} /> Đặt lại
                                                    </motion.button>
                                                )}
                                            </div>
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
