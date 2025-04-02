
import React from 'react';
import { GoChevronRight } from "react-icons/go";
import { FaCheck } from "react-icons/fa";
import { Therapist } from '../types/bookingTypes';
import { fromPairs } from 'lodash';
interface TherapistSelectorProps {
    therapists: Therapist[];
    selectedTherapist: string | undefined;
    setSelectedTherapist: (id: string) => void;
    setSelectedTherapistId: (id: string) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const TherapistSelector: React.FC<TherapistSelectorProps> = ({ 
    therapists, 
    selectedTherapist, 
    setSelectedTherapist,
    setSelectedTherapistId,
    isOpen,
    setIsOpen
}) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <i className="fas fa-user-md text-pink-400 mr-2"></i>{" "}
                    Chọn Chuyên Viên
                </h2>
                <span
                    className={`transition-transform transform ${
                        isOpen ? "rotate-90" : ""
                    } text-xl`}
                >
                    <GoChevronRight />
                </span>
            </div>
            <div
                className={`transition-all overflow-hidden ${
                    isOpen ? "max-h-[500px] mt-4" : "max-h-0"
                }`}
            >
                <div className="flex space-x-3 overflow-x-auto scrollbar-hide p-2">
                    <div
                        className={`relative border-2 p-3 rounded-lg cursor-pointer min-w-[130px] transition-all duration-300 ease-in-out flex flex-col items-center ${
                            selectedTherapist === ""
                                ? "border-pink-400 bg-pink-100 scale-105"
                                : "border-gray-300 bg-white hover:scale-105 hover:shadow-md"
                        }`}
                        onClick={() => setSelectedTherapist("")}
                    >
                        <img
                                src={"/assets/favicon.jpg"}
                                className="rounded-lg h-24 w-full object-cover"
                            />
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
                                selectedTherapist === therapist.id.toString()
                                    ? "border-pink-400 bg-pink-100 scale-105"
                                    : "border-gray-300 bg-white hover:scale-105 hover:shadow-md"
                            }`}
                            onClick={() => {
                                setSelectedTherapist(therapist.id.toString());
                                setSelectedTherapistId(therapist.id.toString());
                            }}
                        >
                            <img
                                src={therapist.img}
                                alt={therapist.fullName}
                                className="rounded-lg h-24 w-full object-cover"
                            />
                            <p className="text-sm mt-2 font-semibold text-center text-gray-700">
                                {therapist.fullName}
                            </p>
                            {selectedTherapist === therapist.id.toString() && (
                                <div className="absolute top-0 right-0 bg-pink-300 text-white rounded-full p-1">
                                    <FaCheck />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TherapistSelector;