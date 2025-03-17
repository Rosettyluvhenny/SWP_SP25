import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTherapistById } from "../data/therapistData";

interface Therapist {
    id: string;
    username: string;
    fullName: string;
    email: string;
    phone: string;
    dob: string;
    experienceYears: number;
    bio: string;
    img: string;
}

const TherapistSidebar = () => {
    return (
        <aside className="bg-gray-900 text-white w-64 p-5 shadow-lg h-screen">
            <h2 className="text-xl font-bold text-center mb-4">Therapist Panel</h2>
            <nav>
                <ul>
                    <li className="p-3 hover:bg-gray-700 rounded-lg cursor-pointer">
                        Phiên trị liệu
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default function Therapist() {
    const { id } = useParams<{ id: string }>(); 
    const [therapist, setTherapist] = useState<Therapist | null>(null);

    useEffect(() => {
        if (id) {
            console.log("Fetching therapist with ID:", id); // Debugging
            getTherapistById(id)
                .then((data) => {
                    console.log("Fetched therapist data:", data); // Debugging
                    setTherapist(data);
                })
                .catch(error => console.error("Error fetching therapist:", error));
        }
    }, [id]);

    return (
        <div className="flex h-screen bg-white">
            {/* Sidebar */}
            <TherapistSidebar />
            
            {/* Main Content */}
            <main className="flex-1 p-6 overflow-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    Therapist Information
                </h1>
                {therapist ? (
                    <div className="bg-pink-100 p-6 rounded-lg shadow-lg">
                        <img src={therapist.img} alt={therapist.fullName} className="w-32 h-32 rounded-full mb-4" />
                        <h2 className="text-xl font-semibold">{therapist.fullName}</h2>
                        <p className="text-gray-700">{therapist.bio}</p>
                        <p className="mt-2"><strong>Email:</strong> {therapist.email}</p>
                        <p><strong>Phone:</strong> {therapist.phone}</p>
                        <p><strong>DOB:</strong> {therapist.dob}</p>
                        <p><strong>Experience:</strong> {therapist.experienceYears} years</p>
                    </div>
                ) : (
                    <p>Loading therapist information...</p>
                )}
            </main>
        </div>
    );
}
