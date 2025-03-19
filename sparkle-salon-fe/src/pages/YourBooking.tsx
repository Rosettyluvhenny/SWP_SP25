import { getUserBookings, Booking } from "../data/userData";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import { Service, serviceDataById } from "../data/servicesData";

export default function YourBooking() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [serviceImages, setServiceImages] = useState<{
        [key: number]: string;
    }>({});
    const [selectedService, setSelectedService] = useState<Service>();
    const [searchParams] = useSearchParams();
    const selectedServiceId = searchParams.get("service") || "";
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchBookings = async () => {
            const bookings = await getUserBookings();
            if (bookings) {
                setBookings(bookings);
            } else {
                alert("Không thể lấy danh sách lịch đặt!");
            }
        };
        fetchBookings();
    }, []);

    useEffect(() => {
        const fetchServiceImages = async () => {
            const imagesMap: { [key: number]: string } = {};
            for (const booking of bookings) {
                if (!booking.serviceId) continue;
                const service = await serviceDataById(
                    booking.serviceId.toString()
                );
                if (service) {
                    imagesMap[booking.serviceId] = service.img;
                }
            }
            setServiceImages(imagesMap);
        };

        if (bookings.length > 0) {
            fetchServiceImages();
        }
    }, [bookings]);

    useEffect(() => {
        async function fetchServices() {
            try {
                const fetchedServices = await serviceDataById(selectedServiceId);
                setSelectedService(fetchedServices);
            } catch (error) {
                console.error("Failed to fetch services:", error);
            }
        }
        fetchServices();
    }, [selectedServiceId]);

    const handleCancelBooking = async (id: string) => {
        const confirmDelete = window.confirm(
            "Bạn có chắc chắn muốn huỷ lịch hẹn này?"
        );
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8081/swp/booking/${id}`);
                //sai dổi status thành canceled 
                const bookings = await getUserBookings();
                if (bookings) {
                    setBookings(bookings);
                }
                alert("Huỷ lịch thành công");
            } catch (error) {
                console.error("Error deleting booking:", error);
                alert("Huỷ lịch thất bại");
            }
        }
    };

    const handleRebook = (serviceId: number) => {
        navigate(`/contact?service=${serviceId}`);
    };

    return (
        <div className="bg-white min-h-screen">
            <div className="relative w-full h-[170px] flex flex-col justify-center items-center bg-[url('/assets/sparkle-salon-title.jpg')] bg-cover bg-center bg-no-repeat mt-16">
                <div className="absolute inset-0 bg-black opacity-40"></div>
                <h1 className="relative z-10 text-white text-7xl font-serif">
                    Booking History
                </h1>
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
                                bookings.map((bookings) => (
                                    <motion.tr
                                        key={bookings.id}
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
                                    >
                                        <td className="p-3 font-medium">
                                            {bookings.serviceName}
                                        </td>
                                        <td className="p-3 font-medium">
                                            <img
                                                src={
                                                    serviceImages[
                                                        bookings.serviceId
                                                    ] ||
                                                    "/assets/placeholder.jpg"
                                                }
                                                alt={bookings.serviceName}
                                                className="w-auto h-16"
                                            />
                                        </td>
                                        <td className="p-3">
                                            {bookings.price}
                                        </td>
                                        <td className="p-3">
                                            {bookings.sessionRemain}
                                        </td>
                                        <td className="p-3">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    bookings.status ===
                                                    "ON_GOING"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                }`}
                                            >
                                                {bookings.status}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            {bookings.paymentMethod}
                                        </td>
                                        <td className="p-3">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    bookings.paymentStatus ===
                                                    "PAID"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                }`}
                                            >
                                                {bookings.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="p-3 flex space-x-2">
                                            <motion.button
                                                onClick={() => handleRebook(bookings.serviceId)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 flex items-center gap-1"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Đặt Lại
                                            </motion.button>

                                            <motion.button
                                                onClick={() =>
                                                    handleCancelBooking(
                                                        bookings.id
                                                    )
                                                }
                                                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 flex items-center gap-1"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <FaTrash size={14} /> Xóa
                                            </motion.button>
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
    );
}
