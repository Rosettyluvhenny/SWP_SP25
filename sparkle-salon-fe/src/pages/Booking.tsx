import { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";

// Component imports
import ServiceDetails from "../components/ServiceDetail";
import PaymentSelector from "../components/PaymentSelector";
import TherapistSelector from "../components/TherapistSelector";
import DateTimeSelector from "../components/DateTimeSelector";
import PolicyModal from "../components/PolicyModal";

// Data imports
import { serviceDataById } from "../data/servicesData";
import {
    getFreeSlots,
    getTherapists,
    getTherapistSlots,
} from "../data/therapistData";
import { BookingBody, bookingService } from "../data/bookingData";
import { getPayment } from "../data/paymentData";

// Types
import {
    Service,
    Therapist,
    BookingDate,
    Payment,
} from "../types/bookingTypes";

export default function Booking() {
    // States and context
    const [selectedService, setSelectedService] = useState<Service>();
    const [therapists, setTherapists] = useState<Therapist[]>([]);
    const [selectedTherapist, setSelectedTherapist] = useState<string>();
    const [selectedTherapistId, setSelectedTherapistId] = useState<string>();
    const [isTherapistOpen, setIsTherapistOpen] = useState<boolean>(true);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(
        null
    );

    // Policy modal state
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState<boolean>(true);
    const [isPolicyAccepted, setIsPolicyAccepted] = useState<boolean>(false);

    // Date and time states
    const nextSevenDates: BookingDate[] = getNextSevenDates();
    const [selectedDate, setSelectedDate] = useState<string>();
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [therapistSlots, setTherapistSlots] = useState<
        { therapistId: string; startTime: string; endTime: string }[]
    >([]);
    const [filteredTherapistSlots, setFilteredTherapistSlots] = useState<
        { therapistId: string; startTime: string; endTime: string }[]
    >([]);

    // Router hooks
    const [searchParams] = useSearchParams();
    const selectedServiceId = searchParams.get("service") || "";
    const navigate = useNavigate();
    const { user, setIsLoginOpen } = useContext(UserContext);

    // Helper function to get next seven dates
    function getNextSevenDates() {
        const days: BookingDate[] = [];
        for (let i = 1; i < 10; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);

            days.push({
                name: date.toLocaleDateString("vi-VN", { weekday: "long" }),
                day: `${date.getDate() < 10 ? "0" : ""}${date.getDate()}`,
                month: `${date.getMonth() + 1 < 10 ? "0" : ""}${
                    date.getMonth() + 1
                }`,
                year: date.getFullYear().toString(),
            });
        }
        return days;
    }

    // Hàm check giờ đã chọn cách hiện tại 24 tiếng 
    function is24HoursAhead(dateStr: string, timeStr: string) {
        const now = new Date();
        const [year, month, day] = dateStr.split('-');
        const [hour, minute] = timeStr.split(':');
        
        const bookingDate = new Date(
            parseInt(year),
            parseInt(month) - 1, 
            parseInt(day),
            parseInt(hour),
            parseInt(minute)
        );
        
        const diffMs = bookingDate.getTime() - now.getTime();
        const hoursDiff = diffMs / (1000 * 60 * 60);
        
        return hoursDiff >= 24;
    }
    
    // Redirecting if no service is selected
    if (!selectedServiceId) {
        navigate("/service");
    }

    // Policy modal handlers
    const handleAcceptPolicy = () => {
        setIsPolicyAccepted(true);
        setIsPolicyModalOpen(false);
    };

    const handleDeclinePolicy = () => {
        setIsPolicyAccepted(false);
        setIsPolicyModalOpen(false);
    };

    // Initial data fetching
    useEffect(() => {
        async function fetchServices() {
            try {
                const fetchedServices = await serviceDataById(
                    selectedServiceId
                );
                if (fetchedServices.status == 400) {
                    navigate("/service");
                } else {
                    if (!fetchedServices.active) {
                        navigate("/home");
                        toast.error("Dịch vụ ngừng cung cấp");
                    }
                    setSelectedService(fetchedServices);
                }
            } catch (error) {
                console.error("Failed to fetch services:", error);
                navigate("/service");
            }
        }

        async function fetchTherapists() {
            try {
                if (selectedServiceId && selectedServiceId !== "") {
                    const fetchedTherapists = await getTherapists(
                        selectedServiceId
                    );
                    if (!(fetchedTherapists.length > 0)) {
                        toast.error("Không có therapist ");
                    } else setTherapists(fetchedTherapists);
                }
            } catch (error) {
                console.error("Failed to fetch therapists:", error);
            }
        }

        async function fetchPayments() {
            try {
                const fetchedPayments = await getPayment();
                // Filter only active payment methods
                const activePayments = fetchedPayments.filter(
                    (payment) => payment.status === true
                );

                if (activePayments.length === 0) {
                    toast.warning(
                        "Không có phương thức thanh toán nào hoạt động"
                    );
                }

                setPayments(activePayments);
                // Set the first active payment as default selected if available
                if (activePayments.length > 0) {
                    setSelectedPayment(activePayments[0]);
                }
            } catch (error) {
                console.error("Failed to fetch payment methods:", error);
                toast.error("Không thể tải phương thức thanh toán");
            }
        }

        fetchServices();
        fetchPayments();
        fetchTherapists();
    }, []);

    // Fetch therapist slots when therapist or date changes
    useEffect(() => {
        async function fetchTherapistSlots() {
            const fetchedTherapistSlots = await getTherapistSlots(
                selectedTherapist,
                selectedServiceId,
                selectedDate
            );
            setTherapistSlots(fetchedTherapistSlots);
        }

        if (selectedDate && selectedTherapist) {
            fetchTherapistSlots();
            setSelectedTime(null);
        }
    }, [selectedTherapist, selectedDate]);

    // Fetch free slots when no therapist is selected
    useEffect(() => {
        async function fetchFreeSlots() {
            const fetchedTherapistSlots = await getFreeSlots(
                selectedServiceId,
                selectedDate
            );
            setTherapistSlots(fetchedTherapistSlots);
        }

        if (selectedTherapist === "" && selectedDate) {
            fetchFreeSlots();
            setSelectedTime(null);
        }
    }, [selectedTherapist, selectedDate]);


    useEffect(() => {
        if (selectedDate && therapistSlots.length > 0) {
            const filtered = therapistSlots.filter(slot => {
                const timeStr = slot.startTime.substring(0, 5);
                return is24HoursAhead(selectedDate, timeStr);
            });
            
            setFilteredTherapistSlots(filtered);
            
            if (filtered.length === 0 && therapistSlots.length > 0) {
                toast.info("Chỉ hiển thị các khung giờ cách hiện tại ít nhất 24 tiếng");
            }
        } else {
            setFilteredTherapistSlots([]);
        }
    }, [therapistSlots, selectedDate]);

    // Booking handler
    const handleBooking = async () => {
        // Check if policy was accepted
        if (!isPolicyAccepted) {
            toast.error(
                "Vui lòng chấp nhận chính sách dịch vụ trước khi đặt lịch"
            );
            setIsPolicyModalOpen(true);
            return;
        }

        // Check if user is logged in
        if (!(user && user.auth)) {
            toast.warning("Vui lòng đăng nhập để đặt lịch");
            setIsLoginOpen(true);
            return;
        }

        // Check if a payment method is selected
        if (!selectedPayment) {
            toast.error("Vui lòng chọn phương thức thanh toán");
            return;
        }

        // Verify the selected time is at least 24 hours ahead
        if (selectedDate && selectedTime) {
            if (!is24HoursAhead(selectedDate, selectedTime)) {
                toast.error("Vui lòng chọn thời gian cách hiện tại ít nhất 24 tiếng");
                return;
            }
        }

        const bookingBody: BookingBody = {
            serviceId: parseInt(selectedServiceId),
            paymentId: parseInt(selectedPayment.paymentId || "0"),
            bookingTime: `${selectedDate}T${selectedTime}.000Z`,
            notes: "",
            therapistId:
                selectedTherapist === ""
                    ? selectedTherapistId
                    : selectedTherapist,
        };

        console.log(bookingBody.therapistId + " " + bookingBody.bookingTime);
        try {
            const response = await bookingService(bookingBody);

            if (response && response.status === "PENDING") {
                toast.success("Đặt dịch vụ thành công");
                navigate(`/bookingDetail/${response.id}`);
            }
        } catch (error) {
            toast.error(error);
        }
    };

    return (
        <div className="bg-gradient-to-b from-white to-pink-200 min-h-screen">
            {/* Policy Modal */}
            <PolicyModal
                isOpen={isPolicyModalOpen}
                onClose={handleDeclinePolicy}
                onAccept={handleAcceptPolicy}
            />

            <div className="relative w-full h-[200px] flex flex-col justify-center items-center bg-[url('/assets/sparkle-salon-title.jpg')] bg-cover bg-center bg-no-repeat mt-16">
                <div className="absolute inset-0 bg-black opacity-40"></div>
                <h1 className="text-white text-7xl mt-12 font-poppins drop-shadow-lg">
                    Booking
                </h1>
            </div>

            <div className="bg-gradient-to-tr from-[#f0bfbf] to-[#ffa8f396] py-8 px-6 max-w-6xl mx-auto rounded-xl shadow-lg">
                {selectedService && (
                    <ServiceDetails service={selectedService} />
                )}

                {/* Không chấp nhận thì khỏi nàm */}
                <div
                    className={
                        !isPolicyAccepted
                            ? "pointer-events-none opacity-60"
                            : ""
                    }
                >
                    <PaymentSelector
                        payments={payments}
                        selectedPayment={selectedPayment}
                        setSelectedPayment={setSelectedPayment}
                        isOpen={isTherapistOpen}
                    />

                    <TherapistSelector
                        therapists={therapists}
                        selectedTherapist={selectedTherapist}
                        setSelectedTherapist={setSelectedTherapist}
                        setSelectedTherapistId={setSelectedTherapistId}
                        isOpen={isTherapistOpen}
                        setIsOpen={setIsTherapistOpen}
                    />

                    <DateTimeSelector
                        nextSevenDates={nextSevenDates}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        therapistSlots={filteredTherapistSlots}
                        selectedTime={selectedTime}
                        setSelectedTime={setSelectedTime}
                        setSelectedTherapistId={setSelectedTherapistId}
                        onBooking={handleBooking}
                    />
                </div>

                {/* Chấp Nhận mới đc nàm */}
                {!isPolicyModalOpen && !isPolicyAccepted && (
                    <div className="mt-6 p-4 bg-pink-100 border border-pink-300 rounded-lg text-center">
                        <p className="text-pink-700 mb-3">
                            Bạn cần chấp nhận chính sách dịch vụ để tiếp tục đặt
                            lịch
                        </p>
                        <button
                            onClick={() => setIsPolicyModalOpen(true)}
                            className="py-2 px-4 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                        >
                            Xem lại chính sách dịch vụ
                        </button>
                    </div>
                )}

                {/* TH không có phương thức thanh toán */}
                {payments.length === 0 && (
                    <div className="mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg text-center">
                        <p className="text-yellow-700">
                            Không có phương thức thanh toán hoạt động. Vui lòng
                            thử lại sau.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}