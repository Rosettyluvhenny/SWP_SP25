import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTherapistById } from "../data/therapistData";
import {
    getTherapistSessions,
    updateBookingSession,
} from "../data/sessionData";
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

interface Session {
    id: number;
    bookingId: number;
    bookingDate: string;
    sessionDateTime: string;
    serviceName: string;
    status: string;
    note?: string;
    imgBefore?: string;
    imgAfter?: string;
    roomId: number;
    roomName: string;
    userId: string;
    userName: string;
    therapistId: string;
    therapistName: string;
    staffId: string;
    staffName: string;
    img?: string;
}

export default function Therapist() {
    const { id } = useParams<{ id: string }>();
    const [therapist, setTherapist] = useState<Therapist | null>(null);
    const [activeTab, setActiveTab] = useState("schedule");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // States for schedule and notes
    const [sessions, setSessions] = useState<Session[]>([]);
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);

    // Date range states
    const [startDate, setStartDate] = useState<string>(() => {
        const date = new Date();
        date.setDate(1);
        return date.toISOString().split("T")[0];
    });
    const [endDate, setEndDate] = useState<string>(() => {
        const date = new Date();
        date.setMonth(date.getMonth() + 1, 0);
        return date.toISOString().split("T")[0];
    });

    // Fetch therapist data
    useEffect(() => {
        const fetchTherapistData = async () => {
            console.log("Fetching therapist data for ID:", id);
            if (id) {
                setLoading(true);
                setError(null);
                try {
                    const data = await getTherapistById(id);
                    console.log("Therapist data:", data);
                    if (data) {
                        setTherapist(data);
                    } else {
                        setError("Therapist not found.");
                    }
                } catch (error) {
                    console.error("Error fetching therapist:", error);
                    setError("Error fetching therapist data.");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchTherapistData();
    }, [id]);

    // Fetch sessions when schedule tab is active or date range changes
    useEffect(() => {
        const fetchSessions = async () => {
            if (activeTab === "schedule") {
                setLoading(true);
                try {
                    const data = await getTherapistSessions(startDate, endDate);
                    console.log("Sessions data:", data);
                    if (data) {
                        setSessions(data);
                    } else {
                        setError("Could not fetch sessions.");
                    }
                } catch (error) {
                    console.error("Error fetching sessions:", error);
                    setError("Error fetching sessions.");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchSessions();
    }, [activeTab, startDate, endDate]);

    // Handle session update
    const handleSessionUpdate = async (
        sessionId: number,
        note: string,
        imgBefore: File,
        imgAfter: File
    ) => {
        try {
            const updateRequest = {
                note: note,
                roomId: selectedSession?.roomId || 0,
            };

            await updateBookingSession(
                sessionId,
                updateRequest,
                imgBefore,
                imgAfter
            );
            alert("Session updated successfully!");
        } catch (error) {
            console.error("Error updating session:", error);
            alert("Failed to update session.");
        }
    };

    // Debug logging
    useEffect(() => {
        console.log("Current therapist state:", therapist);
        console.log("Current sessions state:", sessions);
    }, [therapist, sessions]);

    return (
        <div className="flex h-screen bg-white">
            {/* Sidebar */}
            <SidebarTherapist
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    {activeTab === "schedule" && "Work Schedule"}
                    {activeTab === "notes" && "Therapy Session Notes"}
                </h1>

                {/* Debugging Information */}
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-600">{error}</p>}

                {/* Therapist Not Found Message */}
                {!loading && !therapist && (
                    <div className="text-center text-gray-600">
                        <p>No therapist found. Please check the therapist ID.</p>
                    </div>
                )}

                {/* Sessions Content */}
                {activeTab === "schedule" && (
                    <div>
                        <div className="mb-4 flex space-x-4">
                            <div>
                                <label className="block mb-2">Start Date</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="border p-2 rounded"
                                />
                            </div>
                            <div>
                                <label className="block mb-2">End Date</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="border p-2 rounded"
                                />
                            </div>
                        </div>

                        <h2 className="text-xl font-semibold mb-4">
                            Your Sessions
                        </h2>
                        {sessions.length === 0 ? (
                            <p>No sessions found for the selected date range.</p>
                        ) : (
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border p-2">Date</th>
                                        <th className="border p-2">Service</th>
                                        <th className="border p-2">Status</th>
                                        <th className="border p-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sessions.map((session) => (
                                        <tr
                                            key={session.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="border p-2">
                                                {new Date(session.sessionDateTime).toLocaleString()}
                                            </td>
                                            <td className="border p-2">
                                                {session.serviceName}
                                            </td>
                                            <td className="border p-2">
                                                {session.status}
                                            </td>
                                            <td className="border p-2">
                                                <button
                                                    className="bg-blue-500 text-white px-2 py-1 rounded"
                                                    onClick={() => {
                                                        setSelectedSession(session);
                                                        setActiveTab("notes");
                                                    }}
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
                
                {/* Notes Content */}
                {activeTab === "notes" && (
                    <div>
                        {selectedSession ? (
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    const form = e.target as HTMLFormElement;
                                    const noteElement = form.elements.namedItem("note") as HTMLTextAreaElement;
                                    const imgBeforeElement = form.elements.namedItem("imgBefore") as HTMLInputElement;
                                    const imgAfterElement = form.elements.namedItem("imgAfter") as HTMLInputElement;

                                    const note = noteElement.value.trim();
                                    const imgBefore = imgBeforeElement.files?.[0];
                                    const imgAfter = imgAfterElement.files?.[0];

                                    // Validation
                                    if (!note) {
                                        alert("Please enter session notes.");
                                        return;
                                    }
                                    if (!imgBefore) {
                                        alert("Please upload an image before the session.");
                                        return;
                                    }
                                    if (!imgAfter) {
                                        alert("Please upload an image after the session.");
                                        return;
                                    }

                                    try {
                                        // Disable submit button during upload
                                        const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
                                        submitButton.disabled = true;
                                        submitButton.textContent = "Updating...";

                                        await handleSessionUpdate(
                                            selectedSession.id,
                                            note,
                                            imgBefore,
                                            imgAfter
                                        );

                                        // Clear form and reset
                                        noteElement.value = "";
                                        imgBeforeElement.value = "";
                                        imgAfterElement.value = "";
                                    } catch (error) {
                                        console.error("Error updating session:", error);
                                        alert("Failed to update session. Please try again.");
                                    } finally {
                                        // Re-enable submit button
                                        const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
                                        submitButton.disabled = false;
                                        submitButton.textContent = "Update Session";
                                    }
                                }}
                            >
                                {/* Form content remains the same as previous version */}
                                <div className="mb-4">
                                    <label className="block mb-2 font-medium">
                                        Session Details
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-gray-600">
                                                Date: {new Date(selectedSession.sessionDateTime).toLocaleString()}
                                            </p>
                                            <p className="text-gray-600">
                                                Service: {selectedSession.serviceName}
                                            </p>
                                            <p className="text-gray-600">
                                                Room: {selectedSession.roomName || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Rest of the form remains the same */}
                                <div className="mb-4">
                                    <label
                                        htmlFor="note"
                                        className="block mb-2 font-medium"
                                    >
                                        Session Notes
                                    </label>
                                    <textarea
                                        id="note"
                                        name="note"
                                        className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                                        rows={6}
                                        placeholder="Enter detailed session notes here..."
                                        defaultValue={selectedSession.note || ""}
                                        required
                                    ></textarea>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="mb-4">
                                        <label
                                            htmlFor="imgBefore"
                                            className="block mb-2 font-medium"
                                        >
                                            Image Before Session
                                        </label>
                                        <input
                                            type="file"
                                            id="imgBefore"
                                            name="imgBefore"
                                            accept="image/*"
                                            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label
                                            htmlFor="imgAfter"
                                            className="block mb-2 font-medium"
                                        >
                                            Image After Session
                                        </label>
                                        <input
                                            type="file"
                                            id="imgAfter"
                                            name="imgAfter"
                                            accept="image/*"
                                            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors duration-300"
                                >
                                    Update Session
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-8 bg-gray-100 rounded">
                                <p className="text-gray-600 text-lg">
                                    Select a session to view or edit notes
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}