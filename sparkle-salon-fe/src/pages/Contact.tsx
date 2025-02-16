import React, { useState } from "react";
import DateTimeSelector from "../components/DateTimeSelector";
import { useLocation } from "react-router-dom";
import { services } from "../data/servicesData";
import { FaMoneyBill } from "react-icons/fa";
import { therapists } from "../data/therapistData";

export default function Contact() {
    const [selectedTherapist, setSelectedTherapist] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<number | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const location = useLocation();
    const [selectedService, setSelectedService] = useState<string>(
        location.state?.selectedService || ""
    );

    const selectedServiceData = services.find((service) => service.name === selectedService);

    const handleDateTimeSelect = (date: number | null, time: string | null) => {
        setSelectedDate(date);
        setSelectedTime(time);
    };

    return (
        <div className="bg-gradient-to-b from-white to-pink-200">
            <div className="h-[200px] flex flex-row justify-center items-center bg-[url('/assets/sparkle-salon-title.jpg')] bg-cover bg-center bg-no-repeat">
                <h1 className="text-white text-7xl mt-12 font-serif ">Contact</h1>
            </div>
            <div className="bg-gradient-to-tr from-[#f0bfbf] to-[#ffa8f396] py-5 px-5 max-w-6xl mx-auto">
                {/* Therapist Selection */}
                <div className="bg-pink-100 p-5 rounded-lg shadow mb-5">
                    <h2 className="text-lg font-bold mb-3">Chọn Chuyên Viên</h2>
                    <div className="flex space-x-3 overflow-x-auto scrollbar-hide p-2">
                        {therapists.map((therapist) => (
                            <div
                                key={therapist.id}
                                className={`border p-2 rounded-lg cursor-pointer min-w-[120px] bg-white ${
                                    selectedTherapist === therapist.id ? "border-pink-300" : ""
                                }`}
                                onClick={() => setSelectedTherapist(therapist.id)}
                            >
                                <img
                                    src={therapist.img}
                                    alt={therapist.name}
                                    className="rounded-lg h-24 w-full object-cover"
                                />
                                <p className="text-sm mt-2 font-semibold text-center">
                                    {therapist.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Service Selection */}
                <div className="bg-pink-100 p-5 rounded-lg shadow mb-5">
                    <h2 className="text-lg font-bold mb-3">Dịch vụ bạn muốn làm</h2>
                    <select
                        className="w-full p-2 border rounded-lg bg-white"
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                    >
                        <option value="">Chọn dịch vụ</option>
                        {services.map((service) => (
                            <option key={service.id} value={service.name}>
                                {service.name}
                            </option>
                        ))}
                    </select>

                    {/* Hiện giá */}
                    {selectedServiceData && (
                        <p className="mt-3 text-lg font-semibold text-pink-600 flex flex-row items-center">
                            Giá: <FaMoneyBill className="mr-1 ml-2" /> {selectedServiceData.price.toLocaleString()} VNĐ
                        </p>
                    )}
                </div>

                {/* Date & Time Selection */}
                <DateTimeSelector
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    onSelect={handleDateTimeSelect}
                />
            </div>
        </div>
    );
}
