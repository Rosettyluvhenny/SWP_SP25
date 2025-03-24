import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTherapistById } from "../data/therapistData";
import SidebarTherapist from "../components/SidebarTherapist";

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

export default function Therapist() {
    const { id } = useParams<{ id: string }>(); 
    const [therapist, setTherapist] = useState<Therapist | null>(null);
    const [activeTab, setActiveTab] = useState("account");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            setLoading(true); 
            setError(null);
            console.log("Fetching therapist with ID:", id);
            getTherapistById(id)
                .then((data) => {
                    if (data) {
                        console.log("Fetched therapist data:", data);
                        setTherapist(data);
                    } else {
                        setError("Therapist not found.");
                    }
                })
                .catch((error) => {
                    console.error("Error fetching therapist:", error);
                    setError("Error fetching therapist data.");
                })
                .finally(() => {
                    setLoading(false); 
                });
        }
    }, [id]);

    const renderTabContent = () => {
        switch (activeTab) {
            case "account":
                return (
                    <div className="bg-pink-100 p-6 rounded-lg shadow-lg">
                        <img src={therapist?.img} alt={therapist?.fullName} className="w-32 h-32 rounded-full mb-4" />
                        <h2 className="text-xl font-semibold">{therapist?.fullName}</h2>
                        <p className="text-gray-700">{therapist?.bio}</p>
                        <p className="mt-2"><strong>Email:</strong> {therapist?.email}</p>
                        <p><strong>Phone:</strong> {therapist?.phone}</p>
                        <p><strong>DOB:</strong> {therapist?.dob}</p>
                        <p><strong>Experience:</strong> {therapist?.experienceYears} years</p>
                    </div>
                );
            case "schedule":
                return <div>Schedule content goes here</div>;
            case "notes":
                return <div>Therapy session notes content goes here</div>;
            case "blog":
                return <div>Blog writing content goes here</div>;
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen bg-white">
            {/* Sidebar */}
            <SidebarTherapist activeTab={activeTab} setActiveTab={setActiveTab} />
            
            {/* Main Content */}
            <main className="flex-1 p-6 overflow-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    {activeTab === "account" && "Therapist Information"}
                    {activeTab === "schedule" && "Work Schedule"}
                    {activeTab === "notes" && "Therapy Session Notes"}
                    {activeTab === "blog" && "Write Blog"}
                </h1>
                {loading ? (
                    <p>Loading therapist information...</p>
                ) : error ? (
                    <p className="text-red-600">{error}</p>
                ) : therapist ? (
                    renderTabContent()
                ) : (
                    <p>No therapist found.</p>
                )}
            </main>
        </div>
    );
}
