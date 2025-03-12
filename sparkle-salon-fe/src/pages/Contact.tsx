import { useState, useEffect } from "react";
// import DateTimeSelector from "../components/DateTimeSelector";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Service,  serviceDataById } from "../data/servicesData";
import { getTherapists, getTherapistSlots } from "../data/therapistData";
import { GoChevronRight } from "react-icons/go";
import { FaCheck } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { BookingBody, bookingService } from "../data/bookingData";

type Therapist = {
    id: number;
    username: string;
    fullName: string;
    email: string;
    phone: string;
    dob: string;
    experienceYears: number;
    bio: string;
    img: string;
};

type BookingDate = {
    name: string;
    day: string;
    month: string;
    year: string;
};

export default function Contact() {
    const getNextSevenDates = () => {
        const days: BookingDate[] = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);

            days.push({
                name: date.toLocaleDateString("vi-VN", { weekday: "long" }), // Lấy thứ trong tuần
                day: `${date.getDate() < 10 ? "0" : ""}${date.getDate()}`, // Lấy ngày
                month: `${date.getMonth() + 1 < 10 ? "0" : ""}${date.getMonth() + 1}`, // Lấy tháng (lưu ý: getMonth() trả về 0-11)
                year: date.getFullYear().toString(), 
            });
        }

        return days;
    };
    const nextSevenDates: BookingDate[] = getNextSevenDates();
    const todayString = `${nextSevenDates[0].year}-${nextSevenDates[0].month}-${nextSevenDates[0].day}`;
    const [selectedTherapist, setSelectedTherapist] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(todayString);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedService, setSelectedService] = useState<Service>();
    const [isTherapistOpen, setIsTherapistOpen] = useState<boolean>(true);
    const [therapists, setTherapists] = useState<Therapist[]>([]);
    const [therapistSlots, setTherapistSlots] = useState<
        { startTime: string; endTime: string }[]
    >([]);
    const [searchParams] = useSearchParams();
    const selectedServiceId = searchParams.get("service") || "";
    const navigate = useNavigate();
    if (!selectedServiceId) {
        navigate("/service");
    }

    const handleBooking =  async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Vui lòng đăng nhập để đặt lịch");
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const decodeToken: any = jwtDecode(token);
        const userId = decodeToken.userId;
        if (!userId) {
            alert("Vui lòng đăng nhập để đặt lịch");
            return;
        }
        const bookingBody: BookingBody = {
            userId,
            serviceId: parseInt(selectedServiceId),
            paymentId: 1,
            bookingTime: `${selectedDate}T${selectedTime}.000Z`,
            notes: "",
            therapistId: selectedTherapist
        }
        const response = await bookingService(bookingBody);
        if (response) {
            alert("Đặt lịch thành công");
            setSelectedTherapist(null);
            setSelectedDate(todayString);
            setSelectedTime(null);
            setSelectedService(undefined);
        } else {
            alert("Đặt lịch thất bại");
        }
    }

    useEffect(() => {
        async function fetchTherapistSlots() {
            try {
                const fetchedTherapistSlots = await getTherapistSlots(
                    selectedTherapist,
                    selectedServiceId,
                    selectedDate
                );
                setTherapistSlots(fetchedTherapistSlots);
            } catch (error) {
                console.error("Failed to fetch therapist slots:", error);
            }
        }
        fetchTherapistSlots();
        setSelectedTime(null);
    },[selectedTherapist, selectedServiceId, selectedDate])
    useEffect(() => {
        async function fetchServices() {
            try {
                const fetchedServices = await serviceDataById(
                    selectedServiceId
                );
                setSelectedService(fetchedServices);
            } catch (error) {
                console.error("Failed to fetch services:", error);
            }
        }

        async function fetchTherapists() {
            try {
                if (selectedServiceId && selectedServiceId !== "") {
                    const fetchedTherapists = await getTherapists(selectedServiceId);
                    setTherapists(fetchedTherapists);
                }
            } catch (error) {
                console.error("Failed to fetch therapists:", error);
            }
        }
        fetchServices();
        fetchTherapists();
    }, [selectedServiceId]);

    return (
        <div className="bg-gradient-to-b from-white to-pink-200 min-h-screen">
            {/* Page Header */}
            <div className="relative w-full h-[200px] flex flex-col justify-center items-center bg-[url('/assets/sparkle-salon-title.jpg')] bg-cover bg-center bg-no-repeat mt-16">
                <div className="absolute inset-0 bg-black opacity-40"></div>
                <h1 className="text-white text-7xl mt-12 font-serif drop-shadow-lg">
                    Contact
                </h1>
            </div>

            <div className="bg-gradient-to-tr from-[#f0bfbf] to-[#ffa8f396] py-8 px-6 max-w-6xl mx-auto rounded-xl shadow-lg">
                {/* Service Details */}
                {selectedService && (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex flex-col md:flex-row items-center md:items-start">
                        <div className="text-center md:text-left w-full md:w-2/3">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2">
                                Dịch vụ của bạn
                            </h2>
                            <img
                                src={selectedService.img}
                                alt={selectedService.name}
                                className="w-40 h-40 object-cover rounded-lg shadow-md border-2 border-pink-300"
                            />
                            <h3 className="text-lg font-semibold text-gray-700">
                                {selectedService.name}
                            </h3>
                            <p className="text-lg font-semibold text-pink-600 flex items-center justify-center md:justify-start mt-2">
                                Số tiền cần thanh toán:
                                {selectedService.price.toLocaleString()} VNĐ
                            </p>
                        </div>
                    </div>
                )}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => setIsTherapistOpen(!isTherapistOpen)}
                    >
                        <h2 className="text-xl font-bold text-gray-800 flex items-center">
                            <i className="fas fa-user-md text-pink-400 mr-2"></i>{" "}
                            Chọn Chuyên Viên
                        </h2>
                        <span
                            className={`transition-transform transform ${
                                isTherapistOpen ? "rotate-90" : ""
                            } text-xl`}
                        >
                            <GoChevronRight />
                        </span>
                    </div>
                    <div
                        className={`transition-all overflow-hidden ${
                            isTherapistOpen ? "max-h-[500px] mt-4" : "max-h-0"
                        }`}
                    >
                        <div className="flex space-x-3 overflow-x-auto scrollbar-hide p-2">
                            <div
                                className={`relative border-2 p-3 rounded-lg cursor-pointer min-w-[130px] transition-all duration-300 ease-in-out flex flex-col items-center ${
                                    selectedTherapist === null
                                        ? "border-pink-400 bg-pink-100 scale-105"
                                        : "border-gray-300 bg-white hover:scale-105 hover:shadow-md"
                                }`}
                                onClick={() => setSelectedTherapist(null)}
                            >
                                <p className="text-sm mt-2 font-semibold text-center text-gray-700">
                                    Để Spa chọn giúp bạn
                                </p>
                                {selectedTherapist === null && (
                                    <div className="absolute top-0 right-0 bg-pink-300 text-white rounded-full p-1">
                                        <FaCheck />
                                    </div>
                                )}
                            </div>
                            {therapists.map((therapist) => (
                                <div
                                    key={therapist.id}
                                    className={`relative border-2 p-3 rounded-lg cursor-pointer min-w-[130px] transition-all duration-300 ease-in-out flex flex-col items-center ${
                                        selectedTherapist ===
                                        therapist.id.toString()
                                            ? "border-pink-400 bg-pink-100 scale-105"
                                            : "border-gray-300 bg-white hover:scale-105 hover:shadow-md"
                                    }`}
                                    onClick={() =>
                                        setSelectedTherapist(
                                            therapist.id.toString()
                                        )
                                    }
                                >
                                    <img
                                        src={therapist.img}
                                        alt={therapist.fullName}
                                        className="rounded-lg h-24 w-full object-cover"
                                    />
                                    <p className="text-sm mt-2 font-semibold text-center text-gray-700">
                                        {therapist.fullName}
                                    </p>
                                    {selectedTherapist ===
                                        therapist.id.toString() && (
                                        <div className="absolute top-0 right-0 bg-pink-300 text-white rounded-full p-1">
                                            <FaCheck />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-pink-300 pb-2">
                        Chọn Ngày & Giờ
                    </h2>
                    <div className="overflow-x-scroll flex gap-4 py-4">
                        {nextSevenDates.map((day) => {
                            const dateString = `${day.year}-${day.month}-${day.day}`;
                            return (
                                <button
                                    disabled={dateString === selectedDate}
                                    onClick={() => setSelectedDate(dateString)}
                                    key={day.day}
                                    className={`min-w-[160px] p-4 rounded-lg shadow-md bg-${
                                        dateString === selectedDate
                                            ? "pink-400"
                                            : "slate-400"
                                    }`}
                                >
                                    <p>
                                        {day.name} | {day.day}/{day.month}
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                    <div className="grid grid-cols-4 gap-4 mt-4">
                        {therapistSlots.map((slot) => (
                            <button onClick={() => setSelectedTime(slot.startTime)} key={slot.startTime} className={`p-4 rounded-lg shadow-md bg-${
                                selectedTime === slot.startTime
                                    ? "pink-400"
                                    : "slate-400"
                            }`}>
                                {slot.startTime.slice(0, 5)}
                            </button>
                        ))}
                    </div>
                    <div className="flex justify-end mt-4">
                        <button className="bg-pink-400 text-white px-4 py-2 rounded-lg" onClick={handleBooking}>
                            Đặt lịch
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
