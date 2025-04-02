import { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";

// Component imports
import ServiceDetails from "../components/ServiceDetail";
import PaymentSelector from "../components/PaymentSelector";
import TherapistSelector from "../components/TherapistSelector";
import DateTimeSelector from "../components/DateTimeSelector";

// Data imports
import { serviceDataById } from "../data/servicesData";
import { getFreeSlots, getTherapists, getTherapistSlots } from "../data/therapistData";
import { BookingBody, bookingService } from "../data/bookingData";
import { getPayment } from "../data/paymentData";
import { getUser } from "../data/authData";

// Types
import { Service, Therapist, BookingDate, Payment } from "../types/bookingTypes";

export default function Booking() {
    // States and context
    const [selectedService, setSelectedService] = useState<Service>();
    const [therapists, setTherapists] = useState<Therapist[]>([]);
    const [selectedTherapist, setSelectedTherapist] = useState<string>();
    const [selectedTherapistId, setSelectedTherapistId] = useState<string>();
    const [isTherapistOpen, setIsTherapistOpen] = useState<boolean>(true);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    // Date and time states
    const nextSevenDates: BookingDate[] = getNextSevenDates();
    const [selectedDate, setSelectedDate] = useState<string>();
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [therapistSlots, setTherapistSlots] = useState<{ therapistId: string; startTime: string; endTime: string }[]>([]);

    // Router hooks
    const [searchParams] = useSearchParams();
    const selectedServiceId = searchParams.get("service") || "";
    const navigate = useNavigate();
    const { user, setIsLoginOpen } = useContext(UserContext);

    // Helper function to get next seven dates
    function getNextSevenDates() {
        const days: BookingDate[] = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);

            days.push({
                name: date.toLocaleDateString("vi-VN", { weekday: "long" }),
                day: `${date.getDate() < 10 ? "0" : ""}${date.getDate()}`,
                month: `${date.getMonth() + 1 < 10 ? "0" : ""}${date.getMonth() + 1}`,
                year: date.getFullYear().toString(),
            });
        }
        return days;
    }

    // Redirecting if no service is selected
    if (!selectedServiceId) {
        navigate("/service");
    }

    // Initial data fetching
    useEffect(() => {
        async function fetchServices() {
            try {
                const fetchedServices = await serviceDataById(selectedServiceId);
                if(fetchedServices.status == 400){
                    navigate("/service");
                }else {
                    if(!fetchedServices.active){
                        navigate("/home")
                        toast.error("Dịch vụ ngừng cung cấp")
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
                    const fetchedTherapists = await getTherapists(selectedServiceId);
                    setTherapists(fetchedTherapists);
                }
            } catch (error) {
                console.error("Failed to fetch therapists:", error);
            }
        }

        async function fetchPayments() {
            const fetchedPayments = await getPayment();
            setPayments(fetchedPayments);
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

    // Booking handler
    const handleBooking = async () => {
        // const rq = await getUser();

        if (!(user && user.auth)) {
            toast.warning("Vui lòng đăng nhập để đặt lịch");
            setIsLoginOpen(true);
            return;
        }

        const bookingBody: BookingBody = {
            serviceId: parseInt(selectedServiceId),
            paymentId: parseInt(selectedPayment?.paymentId || "0"),
            bookingTime: `${selectedDate}T${selectedTime}.000Z`,
            notes: "",
            therapistId: selectedTherapist === "" ? selectedTherapistId : selectedTherapist
        };

        console.log(bookingBody.therapistId + " " + bookingBody.bookingTime);
        try {
            const response = await bookingService(bookingBody);

           
            if(response && response.status ===  "PENDING"){
                toast.success("Đặt dịch vụ thành công")
                navigate(`/bookingDetail/${response.id}`)
            }
        } catch (error) {
            toast.error(error);
        }
    };

    return (
        <div className="bg-gradient-to-b from-white to-pink-200 min-h-screen">
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
                    therapistSlots={therapistSlots}
                    selectedTime={selectedTime}
                    setSelectedTime={setSelectedTime}
                    setSelectedTherapistId={setSelectedTherapistId}
                    onBooking={handleBooking}
                />
            </div>
        </div>
    );
}