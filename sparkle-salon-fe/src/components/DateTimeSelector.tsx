import React from "react";

interface DateSelectorProps {
    availableSlots: { date: string; times: string[] }[];
    selectedDate: string;
    selectedTime: string;
    onSelectDate: (date: string) => void;
    onSelectTime: (time: string) => void;
    isTimeBooked: (date: string, time: string) => boolean;
}

export default function DateSelector({
    availableSlots,
    selectedDate,
    selectedTime,
    onSelectDate,
    onSelectTime,
    isTimeBooked,
}: DateSelectorProps) {
    return (
        <div>
            <h2 className="text-xl font-serif text-white">CHỌN NGÀY GIỜ</h2>
            <div className="grid grid-cols-7 gap-2 mt-4">
                {availableSlots.length > 0 ? (
                    availableSlots.map(({ date }) => (
                        <button
                            key={date}
                            onClick={() => {
                                console.log("Date selected:", date);
                                onSelectDate(date);
                            }}
                            className={`rounded-lg ${
                                selectedDate === date
                                    ? "bg-gray-500"
                                    : "bg-gray-300"
                            }`}
                        >
                            {date}
                        </button>
                    ))
                ) : (
                    <p className="text-white">Loading available dates...</p>
                )}
            </div>
            {selectedDate && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                    {availableSlots
                        .find((s) => s.date === selectedDate)
                        ?.times.map((time) => {
                            const isBooked = isTimeBooked(selectedDate, time);
                            return (
                                <button
                                    key={time}
                                    onClick={() => {
                                        console.log("Time selected:", time);
                                        onSelectTime(time);
                                    }}
                                    disabled={isBooked}
                                    className={`p-2 rounded-lg ${
                                        selectedTime === time
                                            ? "bg-green-400"
                                            : isBooked
                                            ? "bg-gray-500 cursor-not-allowed"
                                            : "bg-gray-300"
                                    }`}
                                >
                                    {time}
                                </button>
                            );
                        })}
                </div>
            )}
        </div>
    );
}
