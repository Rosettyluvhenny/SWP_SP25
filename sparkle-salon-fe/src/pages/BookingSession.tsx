// import { useState, useEffect, useContext } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { UserContext } from "../context/UserContext";
// import { toast } from "react-toastify";

// // Component imports
// import TherapistSelector from "../components/TherapistSelector";
// import DateTimeSelector from "../components/DateTimeSelector";

// // Data imports
// import { getFreeSlots, getTherapists, getTherapistSlots } from "../data/therapistData";
// import { getUser } from "../data/authData";

// // Types
// import { Service, Therapist, BookingDate, Payment } from "../types/bookingTypes";
// import { Booking, getBookingById } from "../data/userData";
// import { SessionBody, sessionSchedule } from "../data/sessionData";

// export default function BookingSession() {
//     // States and context
//     const [therapists, setTherapists] = useState<Therapist[]>([]);
//     const [selectedTherapist, setSelectedTherapist] = useState<string>();
//     const [selectedTherapistId, setSelectedTherapistId] = useState<string>();
//     const [isTherapistOpen, setIsTherapistOpen] = useState<boolean>(true);
//     const [booking, setBooking] = useState<Booking>();

//     // Date and time states
//     const nextSevenDates: BookingDate[] = getNextSevenDates();
//     const [selectedDate, setSelectedDate] = useState<string>();
//     const [selectedTime, setSelectedTime] = useState<string | null>(null);
//     const [therapistSlots, setTherapistSlots] = useState<{ therapistId: string; startTime: string; endTime: string }[]>([]);
//     // Router hooks
//     const [searchParams] = useSearchParams();
//     let selectedServiceId = "";
//     const selectedBooking = searchParams.get("booking") || ""
//     const navigate = useNavigate();
//     const { user } = useContext(UserContext);

//     // Helper function to get next seven dates
//     function getNextSevenDates() {
//         const days: BookingDate[] = [];

//         for (let i = 0; i < 7; i++) {
//             const date = new Date();
//             date.setDate(date.getDate() + i);

//             days.push({
//                 name: date.toLocaleDateString("vi-VN", { weekday: "long" }),
//                 day: `${date.getDate() < 10 ? "0" : ""}${date.getDate()}`,
//                 month: `${date.getMonth() + 1 < 10 ? "0" : ""}${date.getMonth() + 1}`,
//                 year: date.getFullYear().toString(),
//             });
//         }
//         return days;
//     }

//     // Redirecting if no service is selected
//     if (!selectedBooking) {
//         navigate("/yours-booking");
//     }

//     // Initial data fetching
//     useEffect(() => {
//         async function fetchBooking() {
//             try {
//                 const fetchedBooking = await getBookingById(selectedBooking);
//                 console.log(fetchedBooking);
//                 if(fetchedBooking == null){
//                     navigate("/yours-booking");
//                 }else {
//                     setBooking(fetchedBooking);
//                     console.log("service",fetchedBooking.serviceId);
//                     const fetchedTherapists = await getTherapists(String(fetchedBooking.serviceId));
//                     selectedServiceId =String(fetchedBooking.serviceId);
//                     console.log(fetchedBooking.serviceId)
//                     setTherapists(fetchedTherapists);
//                 }
//             } catch (error) {
//                 console.error("Failed to fetch services:", error);
//                 navigate("/your-booking");
//             }
//         }

//         fetchBooking();
//     }, []);
//     console.log("service ID",selectedServiceId);
//     // Fetch therapist slots when therapist or date changes
//     useEffect(() => {
//         async function fetchTherapistSlots() {
//             const fetchedTherapistSlots = await getTherapistSlots(
//                 selectedTherapist,
//                 selectedServiceId,
//                 selectedDate
//             );
//             setTherapistSlots(fetchedTherapistSlots);
//         }

//         if (selectedDate && selectedTherapist) {
//             fetchTherapistSlots();
//             setSelectedTime(null);
//         }
//     }, [selectedTherapist, selectedDate]);

//     // Fetch free slots when no therapist is selected
//     useEffect(() => {
//         async function fetchFreeSlots() {
//             const fetchedTherapistSlots = await getFreeSlots(
//                 selectedServiceId,
//                 selectedDate
//             );
//             setTherapistSlots(fetchedTherapistSlots);
//         }

//         if (selectedTherapist === "" && selectedDate) {
//             fetchFreeSlots();
//             setSelectedTime(null);
//         }
//     }, [selectedTherapist, selectedDate]);

//     // Booking handler
//     const handleBooking = async () => {
//         const rq = await getUser();

//         if (!(user && user.auth)) {
//             toast.warning("Vui lòng đăng nhập để đặt lịch");
//             return;
//         }

//         const sessiongBody: SessionBody = {
//             serviceId: parseInt(selectedServiceId),
//             bookingTime: `${selectedDate}T${selectedTime}.000Z`,
//             notes: "",
//             therapistId: selectedTherapist === "" ? selectedTherapistId : selectedTherapist
//         };

//         try {
//             const response = await sessionSchedule(sessionBody);

//             if (response && response.url) {
//                 alert("Đặt lịch thành công! Đang chuyển hướng đến trang thanh toán...");
//                 window.open(response.url, "_self");
//             }

//             if(response && response.status){
//                 toast.success("Đặt lịch thành công")
//             }
//         } catch (error) {
//             console.error("Lỗi khi đặt lịch:", error);
//             alert("Đặt lịch thất bại.");
//         }
//     };

//     return (
//         <div className="bg-gradient-to-b from-white to-pink-200 min-h-screen">
//             <div className="relative w-full h-[200px] flex flex-col justify-center items-center bg-[url('/assets/sparkle-salon-title.jpg')] bg-cover bg-center bg-no-repeat mt-16">
//                 <div className="absolute inset-0 bg-black opacity-40"></div>
//                 <h1 className="text-white text-7xl mt-12 font-poppins drop-shadow-lg">
//                     Booking Session
//                 </h1>
//             </div>

//             <div className="bg-gradient-to-tr from-[#f0bfbf] to-[#ffa8f396] py-8 px-6 max-w-6xl mx-auto rounded-xl shadow-lg">

//                 <TherapistSelector
//                     therapists={therapists}
//                     selectedTherapist={selectedTherapist}
//                     setSelectedTherapist={setSelectedTherapist}
//                     setSelectedTherapistId={setSelectedTherapistId}
//                     isOpen={isTherapistOpen}
//                     setIsOpen={setIsTherapistOpen}
//                 />

//                 <DateTimeSelector
//                     nextSevenDates={nextSevenDates}
//                     selectedDate={selectedDate}
//                     setSelectedDate={setSelectedDate}
//                     therapistSlots={therapistSlots}
//                     selectedTime={selectedTime}
//                     setSelectedTime={setSelectedTime}
//                     setSelectedTherapistId={setSelectedTherapistId}
//                     onBooking={handleBooking}
//                 />
//             </div>
//         </div>
//     );
// }
import { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";

// Component imports
import TherapistSelector from "../components/TherapistSelector";
import DateTimeSelector from "../components/DateTimeSelector";

// Data imports
import { getFreeSlots, getTherapists, getTherapistSlots } from "../data/therapistData";
import { getUser } from "../data/authData";

// Types
import { Service, Therapist, BookingDate, Payment } from "../types/bookingTypes";
import { Booking, getBookingById } from "../data/userData";
import { SessionBody, sessionSchedule } from "../data/sessionData";

export default function BookingSession() {
    // States and context
    const [therapists, setTherapists] = useState<Therapist[]>([]);
    const [selectedTherapist, setSelectedTherapist] = useState<string>();
    const [selectedTherapistId, setSelectedTherapistId] = useState<string>();
    const [isTherapistOpen, setIsTherapistOpen] = useState<boolean>(true);
    const [booking, setBooking] = useState<Booking>();
    const [selectedServiceId, setSelectedServiceId] = useState<string>("");

    // Date and time states
    const nextSevenDates: BookingDate[] = getNextSevenDates();
    const [selectedDate, setSelectedDate] = useState<string>();
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [therapistSlots, setTherapistSlots] = useState<{ therapistId: string; startTime: string; endTime: string }[]>([]);

    // Router hooks
    const [searchParams] = useSearchParams();
    const selectedBooking = searchParams.get("booking") || "";
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

    // Initial data fetching
    useEffect(() => {
        async function fetchBooking() {
            if (!selectedBooking) {
                navigate("/yours-booking");
                return;
            }

            try {
                const fetchedBooking = await getBookingById(selectedBooking);
                console.log(fetchedBooking);
                if (fetchedBooking == null) {
                    navigate("/yours-booking");
                } else {
                    setBooking(fetchedBooking);
                    setSelectedServiceId(String(fetchedBooking.serviceId));
                    const fetchedTherapists = await getTherapists(String(fetchedBooking.serviceId));
                    setTherapists(fetchedTherapists);
                }
            } catch (error) {
                console.error("Failed to fetch booking:", error);
                navigate("/yours-booking");
            }
        }

        fetchBooking();
    }, [selectedBooking, navigate]);

    // Fetch therapist slots when therapist or date changes
    useEffect(() => {
        async function fetchTherapistSlots() {
            if (!selectedTherapist || !selectedDate || !selectedServiceId) return;

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
    }, [selectedTherapist, selectedDate, selectedServiceId]);

    // Fetch free slots when no therapist is selected
    useEffect(() => {
        async function fetchFreeSlots() {
            if (!selectedDate || !selectedServiceId) return;

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
    }, [selectedTherapist, selectedDate, selectedServiceId]);

    // Booking handler
    const handleBooking = async () => {
        const rq = await getUser();

        if (!(user && user.auth)) {
            toast.warning("Vui lòng đăng nhập để đặt lịch");
            setIsLoginOpen(true);
            return;
        }

        if (!selectedDate || !selectedTime || !selectedServiceId) {
            toast.warning("Vui lòng chọn đầy đủ thông tin");
            return;
        }

        const sessionBody: SessionBody = {
            bookingId: parseInt(selectedBooking),
            sessionDateTime: `${selectedDate}T${selectedTime}.000Z`,
            notes: "",
            therapistId: selectedTherapist === "" ? selectedTherapistId : selectedTherapist
        };

        const response = await sessionSchedule(sessionBody);
        console.log("resoibse", response);
        if (response && response.status == 201) {
            toast.success("Đặt lịch thành công");
            navigate(`/sessionDetail/${response.id}`)
        }else {
            navigate('/schedule');
        }

    };

    return (
        <div className="bg-gradient-to-b from-white to-pink-200 min-h-screen">
            <div className="relative w-full h-[200px] flex flex-col justify-center items-center bg-[url('/assets/sparkle-salon-title.jpg')] bg-cover bg-center bg-no-repeat mt-16">
                <div className="absolute inset-0 bg-black opacity-40"></div>
                <h1 className="text-white text-7xl mt-12 font-poppins drop-shadow-lg">
                    Booking Session
                </h1>
            </div>

            <div className="bg-gradient-to-tr from-[#f0bfbf] to-[#ffa8f396] py-8 px-6 max-w-6xl mx-auto rounded-xl shadow-lg">
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
