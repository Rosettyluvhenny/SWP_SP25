
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

interface BookingDate {
    name: string;
    day: string;
    month: string;
    year: string;
  }
  
  interface BookingSessionModalProps {
    booking: Booking;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (sessionId: string | number) => void;
  }
  
  export function BookingSessionModal({ booking, isOpen, onClose, onSuccess }: BookingSessionModalProps) {
    // States and context
    const [therapists, setTherapists] = useState<Therapist[]>([]);
    const [selectedTherapist, setSelectedTherapist] = useState<string>();
    const [selectedTherapistId, setSelectedTherapistId] = useState<string>();
    const [isTherapistOpen, setIsTherapistOpen] = useState<boolean>(true);
    const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  
    // Date and time states
    const nextSevenDates: BookingDate[] = getNextSevenDates();
    const [selectedDate, setSelectedDate] = useState<string>();
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [therapistSlots, setTherapistSlots] = useState<{ therapistId: string; startTime: string; endTime: string }[]>([]);
    
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
      async function fetchData() {
        if (booking && booking.id) {
          try {
            setSelectedServiceId(String(booking.serviceId || ""));
            const fetchedTherapists = await getTherapists(String(booking.serviceId || ""));
            setTherapists(fetchedTherapists);
          } catch (error) {
            console.error("Failed to fetch therapists:", error);
            toast.error("Failed to load therapists");
          }
        }
      }
  
      if (isOpen) {
        fetchData();
      }
    }, [booking, isOpen]);
  
    useEffect(() => {
      async function fetchTherapistSlots() {
        if (!selectedTherapist || !selectedDate || !selectedServiceId) return;
        try {
          const fetchedTherapistSlots = await getTherapistSlots(
            selectedTherapist,
            selectedServiceId,
            selectedDate
          );
          setTherapistSlots(fetchedTherapistSlots);
        } catch (error) {
          console.error("Failed to fetch therapist slots:", error);
          toast.error("Failed to load available time slots");
        }
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
        try {
          const fetchedTherapistSlots = await getFreeSlots(
            selectedServiceId,
            selectedDate
          );
          setTherapistSlots(fetchedTherapistSlots);
        } catch (error) {
          console.error("Failed to fetch free slots:", error);
          toast.error("Failed to load available time slots");
        }
      }
  
      if (selectedTherapist === "" && selectedDate) {
        fetchFreeSlots();
        setSelectedTime(null);
      }
    }, [selectedTherapist, selectedDate, selectedServiceId]);
    const navigate = useNavigate()
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
            bookingId: Number(booking.id),
            sessionDateTime: `${selectedDate}T${selectedTime}.000Z`,
            notes: "",
            therapistId: selectedTherapist === "" ? selectedTherapistId : selectedTherapist
        };

        try{
            const response = await sessionSchedule(sessionBody);
            console.log("resoibse", response);
            toast.success("Đặt lịch thành công");
            navigate(`/sessionDetail/${response.id}`)

        }catch(error){
            navigate('/schedule');
        }

    };
  
    if (!isOpen) return null;
  
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden transform transition-all duration-300 ease-in-out scale-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-100 to-rose-200 p-5 border-b border-gray-100">
            <h2 className="text-2xl font-semibold text-center text-gray-800">
              Buổi {booking.totalSession - booking.sessionRemain + 1}, dịch vụ: {booking.serviceName}
            </h2>
          </div>
          
          {/* Content */}
          <div className="max-h-[70vh] overflow-y-auto">
            <div className="bg-gradient-to-tr from-[#f0bfbf] to-[#ffa8f396] p-6">
              {/* Service Info */}
              <div className="mb-6 bg-white bg-opacity-70 p-4 rounded-lg shadow-sm">
                <p className="text-gray-700 mb-2 font-medium">Dịch vụ: <span className="text-rose-600">{booking?.serviceName}</span></p>
                {booking?.sessionRemain !== undefined && (
                  <p className="text-gray-700 font-medium">
                    Số buổi còn lại: <span className="text-rose-600">{booking?.sessionRemain}</span>
                  </p>
                )}
              </div>
              
              {/* Selectors */}
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
          
          {/* Footer */}
          <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end">
            <button 
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg mr-2 transition-colors duration-200 text-gray-700 font-medium"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    );
  }

  export default {BookingSessionModal}