import React from 'react';
import { BookingDate, TimeSlot } from '../types/bookingTypes';

interface DateTimeSelectorProps {
    nextSevenDates: BookingDate[];
    selectedDate: string | undefined;
    setSelectedDate: (date: string) => void;
    therapistSlots: TimeSlot[];
    selectedTime: string | null;
    setSelectedTime: (time: string) => void;
    setSelectedTherapistId: (id: string) => void;
    onBooking: () => void;
}

const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
    nextSevenDates,
    selectedDate,
    setSelectedDate,
    therapistSlots,
    selectedTime,
    setSelectedTime,
    setSelectedTherapistId,
    onBooking
}) => {
    return (
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
                    <button
                        onClick={() => {
                            setSelectedTime(slot.startTime);
                            if (slot.therapistId) {
                                setSelectedTherapistId(slot.therapistId);
                            }
                            console.log(slot.startTime + " " +slot.therapistId)
                        }}
                        key={slot.startTime}
                        className={`p-4 rounded-lg shadow-md bg-${
                            selectedTime === slot.startTime
                                ? "pink-400"
                                : "slate-400"
                        }`}
                    >
                        {slot.startTime.slice(0, 5)}
                    </button>
                ))}
            </div>
            <div className="flex justify-end mt-4">
                <button
                    className="bg-pink-400 text-white px-4 py-2 rounded-lg"
                    onClick={onBooking}
                >
                    Đặt lịch
                </button>
            </div>
        </div>
    );
};

export default DateTimeSelector;