import React from "react";
import { Link } from "react-router-dom";

interface DateTimeSelectorProps {
  selectedDate: number | null;
  selectedTime: string | null;
  onSelect: (date: number | null, time: string | null) => void;
}

const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({ selectedDate, selectedTime, onSelect }) => {
  const dates = [
    { id: 1, day: "Thứ 6", date: "14/02" },
    { id: 2, day: "Thứ 7", date: "15/02" },
    { id: 3, day: "Chủ nhật", date: "16/02" },
    { id: 4, day: "Thứ 2", date: "17/02" },
    { id: 5, day: "Thứ 3", date: "18/02" },
  ];

  const timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];

  const handleDateSelection = (dateId: number) => {
    // Reset selected time when a new date is selected
    onSelect(dateId, null);
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <h2 className="text-lg font-bold mb-3">Chọn Ngày Giờ</h2>

      {/* Date Selection */}
      <div className="flex space-x-2 mb-3 overflow-x-auto">
        {dates.map((date) => (
          <button
            key={date.id}
            className={`p-3 min-w-[90px] text-center rounded-lg text-sm ${
              selectedDate === date.id ? "bg-pink-200 text-black" : "bg-gray-200"
            }`}
            onClick={() => handleDateSelection(date.id)}
          >
            <p className="font-bold">{date.day}</p>
            <p>{date.date}</p>
          </button>
        ))}
      </div>

      {/* Time Selection */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {timeSlots.map((time, index) => (
          <button
            key={index}
            className={`p-2 rounded-lg text-sm ${selectedTime === time ? "bg-green-500 text-white" : "bg-gray-200"}`}
            onClick={() => onSelect(selectedDate, time)}
            disabled={!selectedDate}
          >
            {time}
          </button>
        ))}
      </div>
      
      <div className="flex justify-between">
        <Link to="/service">
          <button className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg">Quay lại</button>
        </Link>
        <button
          className="bg-pink-400 text-white hover:bg-pink-500 px-4 py-2 rounded-lg"
          onClick={() => onSelect(selectedDate, selectedTime)}
          disabled={!selectedDate || !selectedTime}
        >
          Đặt hẹn
        </button>
      </div>
    </div>
  );
};

export default DateTimeSelector;
