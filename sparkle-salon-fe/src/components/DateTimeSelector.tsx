import React, { useState, useEffect } from "react";

interface DateTimeSelectorProps {
  selectedDate: string | null;
  selectedTime: string | null;
  availableSlots: { date: string; times: string[] }[];
  onSelect: (date: string | null, time: string | null) => void;
}

const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({ selectedDate, selectedTime, availableSlots, onSelect }) => {
  const [bookedSlots, setBookedSlots] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem("bookedSlots") || "{}");
    setBookedSlots(storedBookings);
  }, []);

  const handleDateSelection = (dateId: string) => {
    onSelect(dateId, null);
  };

  const isSlotBooked = (date: string, time: string) => {
    return bookedSlots[date]?.includes(time);
  };

  return (
    <div className="bg-pink-100 p-5 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-3">Chọn Ngày & Giờ</h2>

      {/* Date Selection */}
      <div className="flex space-x-2 mb-3 overflow-x-auto">
        {availableSlots.map((slot) => (
          <button
            key={slot.date}
            className={`px-3 py-2 rounded-md ${
              selectedDate === slot.date ? "bg-pink-400 text-white" : "bg-white text-gray-700"
            }`}
            onClick={() => handleDateSelection(slot.date)}
          >
            {slot.date}
          </button>
        ))}
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div className="grid grid-cols-3 gap-2">
          {availableSlots.find((slot) => slot.date === selectedDate)?.times.map((time) => (
            <button
              key={time}
              className={`px-3 py-2 rounded-md ${
                selectedTime === time ? "bg-pink-400 text-white" : "bg-white text-gray-700"
              } ${isSlotBooked(selectedDate, time) ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => !isSlotBooked(selectedDate, time) && onSelect(selectedDate, time)}
              disabled={isSlotBooked(selectedDate, time)}
            >
              {time}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DateTimeSelector;
