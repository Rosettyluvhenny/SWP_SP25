import React, { useState, useEffect } from "react";
import DateTimeSelector from "../components/DateTimeSelector";
import { useLocation } from "react-router-dom";
import { Service, servicesData } from "../data/servicesData";
import { therapists } from "../data/therapistData";
import { GoChevronRight } from "react-icons/go";
import { FaCheck } from "react-icons/fa";

export default function Contact() {
    const [selectedTherapist, setSelectedTherapist] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<number | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [isTherapistOpen, setIsTherapistOpen] = useState<boolean>(false); 

    const location = useLocation();
    const selectedService = location.state?.selectedService || "";

    useEffect(() => {
        async function fetchServices() {
            try {
                const data = await servicesData();
                setServices(data);
            } catch (error) {
                console.error("Failed to fetch services:", error);
            }
        }
        fetchServices();
    }, []);

    const selectedServiceData = services.find(
        (service) => service.name === selectedService
    );

    const handleDateTimeSelect = (date: number | null, time: string | null) => {
        setSelectedDate(date);
        setSelectedTime(time);
    };

    // Default available slots (for "Để Spa chọn giúp bạn")
    const defaultSlots = [
        { date: "2025-03-12", times: ["10:00", "12:00", "15:00"] },
        { date: "2025-03-13", times: ["11:00", "14:00", "16:30"] },
    ];

    // Get available slots based on the therapist (Mock data for now)
    const getTherapistSlots = (therapistId: number | null) => {
        if (therapistId === null) return defaultSlots;

        const therapist = therapists.find(t => t.id === therapistId);
        return therapist ? therapist.availableSlots : defaultSlots;
    };

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
                
                {/* Therapist Selection Section*/}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <div 
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => setIsTherapistOpen(!isTherapistOpen)}
                    >
                        <h2 className="text-xl font-bold text-gray-800 flex items-center">
                            <i className="fas fa-user-md text-pink-400 mr-2"></i> Chọn Chuyên Viên
                        </h2>
                        <span className={`transition-transform transform ${isTherapistOpen ? "rotate-90" : ""} text-xl`}>
                            <GoChevronRight />
                        </span>
                    </div>

                    {/* Therapist List */}
                    <div className={`transition-all overflow-hidden ${isTherapistOpen ? "max-h-[500px] mt-4" : "max-h-0"}`}>
                        <div className="flex space-x-3 overflow-x-auto scrollbar-hide p-2">
                            {/* Default Option */}
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
                                        selectedTherapist === therapist.id
                                            ? "border-pink-400 bg-pink-100 scale-105"
                                            : "border-gray-300 bg-white hover:scale-105 hover:shadow-md"
                                    }`}
                                    onClick={() => setSelectedTherapist(therapist.id)}
                                >
                                    <img
                                        src={therapist.img}
                                        alt={therapist.name}
                                        className="rounded-lg h-24 w-full object-cover"
                                    />
                                    <p className="text-sm mt-2 font-semibold text-center text-gray-700">
                                        {therapist.name}
                                    </p>

                                    {/* Checkmark Icon when selected */}
                                    {selectedTherapist === therapist.id && (
                                        <div className="absolute top-0 right-0 bg-pink-300 text-white rounded-full p-1">
                                            <FaCheck />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Date & Time Selection */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-pink-300 pb-2">
                        Chọn Ngày & Giờ
                    </h2>
                    <DateTimeSelector
                        selectedDate={selectedDate}
                        selectedTime={selectedTime}
                        onSelect={handleDateTimeSelect}
                        availableSlots={getTherapistSlots(selectedTherapist)}
                    />
                </div>
            </div>
        </div>
    );
}
