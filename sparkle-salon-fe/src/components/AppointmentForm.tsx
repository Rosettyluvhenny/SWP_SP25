import React from "react";

interface AppointmentFormProps {
    formData: { name: string; phone: string; date: string; time: string };
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export default function AppointmentForm({
    formData,
    onChange,
    onSubmit,
}: AppointmentFormProps) {
    return (
        <div className="bg-gray-500 p-8 rounded-lg shadow-lg">
            <h3 className="text-3xl font-serif mb-4 text-white">
                Thông tin đặt lịch hẹn
            </h3>
            <form onSubmit={onSubmit} className="space-y-6">
                <div className="relative">
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={onChange}
                        placeholder="Enter your name"
                        required
                        className="w-full bg-white text-black border border-gray-700 p-3 rounded-lg"
                    />
                </div>

                <div className="relative">
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={onChange}
                        placeholder="Enter your phone number"
                        required
                        className="w-full bg-white text-black border border-gray-700 p-3 rounded-lg"
                    />
                </div>
                <button
                    type="submit"
                    className="w-1/2 bg-gradient-to-b from-[#9da6cc] to-[#ffacac] text-black hover:bg-gradient-to-r from-[#abb5df] to-[#ffd2d2] hover:text-white font-semibold py-3 rounded-3xl"
                >
                    Đặt lịch ngay
                </button>
            </form>
        </div>
    );
}
