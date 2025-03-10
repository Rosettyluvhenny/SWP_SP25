import React, { useState, useEffect } from "react";
import DateTimeSelector from "../components/DateTimeSelector";
import { useLocation } from "react-router-dom";
import { Service, servicesData } from "../data/servicesData";
import { therapistsData, Therapist } from "../data/therapistData";
import { GoChevronRight } from "react-icons/go";
import { FaCheck } from "react-icons/fa";

// Extended Therapist interface with additional fields needed in the UI
interface ExtendedTherapist extends Therapist {
    name: string;
    img: string;
    availableSlots?: { date: string; times: string[] }[];
}

export default function Contact() {
    const [selectedTherapist, setSelectedTherapist] = useState<number | null>(
        null
    );
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [isTherapistOpen, setIsTherapistOpen] = useState<boolean>(false);
    const [therapists, setTherapists] = useState<ExtendedTherapist[]>([]);

    const location = useLocation();
    const selectedService = location.state?.selectedService || "";

    useEffect(() => {
        async function fetchServices() {
            try {
                const fetchedServices = await servicesData();
                setServices(fetchedServices);
            } catch (error) {
                console.error("Failed to fetch services:", error);
            }
        }
        fetchServices();

        // Transform therapistsData to the format needed for UI
        if (therapistsData && therapistsData[0]) {
            const formattedTherapists = therapistsData[0].map((therapist) => ({
                ...therapist,
                name: therapist.fullName, // Use fullName as name for display
                img: `/assets/therapists/${therapist.id}.jpg`, // Assume image naming convention
                availableSlots: [
                    { date: "2025-03-12", times: ["10:00", "12:00", "15:00"] },
                    { date: "2025-03-13", times: ["11:00", "14:00", "16:30"] },
                ],
            }));
            setTherapists(formattedTherapists);
        }
    }, []);

    const selectedServiceData = services.find(
        (service) => service.name === selectedService
    );

    const defaultSlots = [
        { date: "2025-03-12", times: ["10:00", "12:00", "15:00"] },
        { date: "2025-03-13", times: ["11:00", "14:00", "16:30"] },
    ];

    const getTherapistSlots = (therapistId: number | null) => {
        if (therapistId === null) return defaultSlots;
        // Look in our transformed therapists array
        const therapist = therapists.find((t) => t.id === therapistId);
        return therapist?.availableSlots || defaultSlots;
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
                {/* Service Details */}
                {selectedServiceData && (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6 flex flex-col md:flex-row items-center md:items-start">
                        <div className="text-center md:text-left w-full md:w-2/3">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2">
                                Dịch vụ của bạn
                            </h2>
                            <img
                                src={selectedServiceData.img}
                                alt={selectedServiceData.name}
                                className="w-40 h-40 object-cover rounded-lg shadow-md border-2 border-pink-300"
                            />
                            <h3 className="text-lg font-semibold text-gray-700">
                                {selectedServiceData.name}
                            </h3>
                            <p className="text-lg font-semibold text-pink-600 flex items-center justify-center md:justify-start mt-2">
                                Số tiền cần thanh toán:
                                {selectedServiceData.price.toLocaleString()} VNĐ
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
                                        selectedTherapist === therapist.id
                                            ? "border-pink-400 bg-pink-100 scale-105"
                                            : "border-gray-300 bg-white hover:scale-105 hover:shadow-md"
                                    }`}
                                    onClick={() =>
                                        setSelectedTherapist(therapist.id)
                                    }
                                >
                                    <img
                                        src={therapist.img}
                                        alt={therapist.name}
                                        className="rounded-lg h-24 w-full object-cover"
                                    />
                                    <p className="text-sm mt-2 font-semibold text-center text-gray-700">
                                        {therapist.name}
                                    </p>
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
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-pink-300 pb-2">
                        Chọn Ngày & Giờ
                    </h2>
                    <DateTimeSelector
                        selectedDate={selectedDate}
                        selectedTime={selectedTime}
                        onSelect={(date, time) => {
                            setSelectedDate(date);
                            setSelectedTime(time);
                        }}
                        availableSlots={getTherapistSlots(selectedTherapist)}
                    />
                </div>
            </div>
        </div>
    );
}
