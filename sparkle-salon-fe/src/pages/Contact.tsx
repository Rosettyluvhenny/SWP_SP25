import React, { useState } from "react";
import DateTimeSelector from "../components/DateTimeSelector";

export default function Contact() {
    const [selectedTherapist, setSelectedTherapist] = useState<number | null>(
        null
    );
    const [selectedService, setSelectedService] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<number | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    const therapists = [
        { id: 1, name: "Therapist A", img: "therapist1.jpg" },
        { id: 2, name: "Therapist B", img: "therapist2.jpg" },
        { id: 3, name: "Therapist C", img: "therapist3.jpg" },
        { id: 4, name: "Therapist D", img: "therapist4.jpg" },
        { id: 5, name: "Therapist E", img: "therapist5.jpg" },
        { id: 6, name: "Therapist F", img: "therapist6.jpg" },
        { id: 7, name: "Therapist G", img: "therapist7.jpg" },
        { id: 8, name: "Therapist H", img: "therapist8.jpg" },
        { id: 9, name: "Therapist I", img: "therapist9.jpg" },
        { id: 10, name: "Therapist K", img: "therapist10.jpg" },
    ];

    const handleDateTimeSelect = (date: number | null, time: string | null) => {
        setSelectedDate(date);
        setSelectedTime(time);
    };

    return (
        <div className="bg-gradient-to-tr from-[#f0bfbf] to-[#b47fce11] py-10 px-5 max-w-4xl mx-auto mt-4">
            {/* Therapist Selection */}
            <div className="bg-white p-5 rounded-lg shadow mb-5">
                <h2 className="text-lg font-bold mb-3">Chọn Chuyên Viên</h2>
                <div className="flex space-x-3 overflow-x-auto scrollbar-hide p-2">
                    {therapists.map((therapist) => (
                        <div
                            key={therapist.id}
                            className={`border p-2 rounded-lg cursor-pointer min-w-[120px] ${
                                selectedTherapist === therapist.id
                                    ? "border-pink-300"
                                    : ""
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
            <div className="bg-white p-5 rounded-lg shadow mb-5">
                <h2 className="text-lg font-bold mb-3">Dịch vụ bạn muốn làm</h2>
                <input
                    type="text"
                    placeholder="Nhập dịch vụ bạn muốn làm"
                    className="w-full p-2 border rounded-lg"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                />
            </div>

            {/* Date & Time Selection */}
            <DateTimeSelector
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                onSelect={handleDateTimeSelect}
            />
        </div>
    );
}
