import React, { useState, useEffect } from "react";
import DateSelector from "../components/DateTimeSelector";
import AppointmentForm from "../components/AppointmentForm";

interface Slot {
    date: string;
    times: string[];
}

interface BookedSlot {
    date: string;
    time: string;
}

export default function Contact() {
    const [formData, setFormData] = useState({ name: "", phone: "", date: "", time: "" });
    const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
    const [bookedSlots, setBookedSlots] = useState<BookedSlot[]>([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    useEffect(() => {
        const storedSlots = localStorage.getItem("availableSlots");
        const storedBookedSlots = localStorage.getItem("bookedSlots");

        if (storedSlots) {
            setAvailableSlots(JSON.parse(storedSlots));
        } else {
            const initialSlots: Slot[] = Array.from({ length: 12 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i);
                return {
                    date: date.toISOString().split("T")[0],
                    times: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"],
                };
            });
            localStorage.setItem("availableSlots", JSON.stringify(initialSlots));
            setAvailableSlots(initialSlots);
        }
        if (storedBookedSlots) {
            setBookedSlots(JSON.parse(storedBookedSlots));
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
        setFormData((prev) => ({ ...prev, date }));
        setSelectedTime("");
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        setFormData((prev) => ({ ...prev, time }));
    };

    const isTimeBooked = (date: string, time: string) => bookedSlots.some(slot => slot.date === date && slot.time === time);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.date || !formData.time) {
            alert("Please select a date and time for your appointment.");
            return;
        }
        const updatedBookedSlots = [...bookedSlots, { date: formData.date, time: formData.time }];
        setBookedSlots(updatedBookedSlots);
        localStorage.setItem("bookedSlots", JSON.stringify(updatedBookedSlots));
        alert("Appointment booked successfully!");
    };

    return (
        <div className="min-h-screen flex flex-row items-center bg-[url('/assets/home-banner.jpg')] bg-cover bg-center bg-no-repeat">
            <div className="container mx-auto px-6 md:px-16 py-16 grid md:grid-cols-2 gap-20">
                <DateSelector
                    availableSlots={availableSlots}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    onSelectDate={handleDateSelect}
                    onSelectTime={handleTimeSelect}
                    isTimeBooked={isTimeBooked}
                />
                <AppointmentForm formData={formData} onChange={handleChange} onSubmit={handleSubmit} />
            </div>
        </div>
    );
}
