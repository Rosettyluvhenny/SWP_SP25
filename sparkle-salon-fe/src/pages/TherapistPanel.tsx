import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTherapistById } from "../data/therapistData";
import {
    getTherapistSessions,
    updateBookingSession,
} from "../data/sessionData";
import SidebarTherapist from "../components/SidebarTherapist";
import {
    CalendarIcon,
    ClipboardDocumentListIcon,
    DocumentPlusIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    PencilSquareIcon
} from "@heroicons/react/24/outline";
import { FaUser,FaBookMedical,FaAddressBook  } from "react-icons/fa";
import { toast } from "react-toastify";

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
    const navigate = useNavigate(); // For navigation to blog
    const [therapist, setTherapist] = useState<Therapist | null>(null);
    const [activeTab, setActiveTab] = useState("schedule");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // States for schedule and notes
    const [sessions, setSessions] = useState<Session[]>([]);
    const [selectedSession, setSelectedSession] = useState<Session | null>(
        null
    );

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

    // Status color mapping
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    // Fetch therapist data
    useEffect(() => {
        const fetchTherapistData = async () => {
            if (id) {
                setLoading(true);
                setError(null);
                try {
                    const data = await getTherapistById(id);
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


    useEffect(() => {
        if (activeTab === "blog") {
            navigate(`/therapist/blog`);
        }
    }, [activeTab, navigate]);

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

            toast.success("Cập Nhật Thành Công!");
        } catch (error) {
            console.error("Error updating session:", error);
            toast.error("Cập nhật không thành công. Vui lòng thử lại.");
        }
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <SidebarTherapist
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-auto">
                {/* Header with Dynamic Icons */}
                <header className="flex items-center mb-6">
                    {activeTab === "schedule" && (
                        <CalendarIcon className="w-6 h-6 mr-3 text-pink-600" />
                    )}
                    {activeTab === "notes" && (
                        <ClipboardDocumentListIcon className="w-6 h-6 mr-3 text-pink-600" />
                    )}
                    <h1 className="text-2xl font-bold text-gray-800">
                        {activeTab === "schedule" && "Work Schedule"}
                        {activeTab === "notes" && "Therapy Session Notes"}
                        {activeTab === "blog" && "Blog Posts"}
                    </h1>
                </header>

                {/* Loading and Error States with Enhanced Styling */}
                {loading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
                    </div>
                )}

                {error && (
                    <div
                        className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative"
                        role="alert"
                    >
                        <ExclamationTriangleIcon className="w-6 h-6 inline-block mr-2 text-red-500" />
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {/* Sessions Content */}
                {activeTab === "schedule" && (
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <div className="mb-6 flex justify-between items-center">
                            <div className="flex space-x-4">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) =>
                                            setStartDate(e.target.value)
                                        }
                                        className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block w-full p-2.5"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) =>
                                            setEndDate(e.target.value)
                                        }
                                        className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block w-full p-2.5"
                                    />
                                </div>
                            </div>
                        </div>

                        {sessions.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <DocumentPlusIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-600">
                                    No sessions found for the selected date
                                    range.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                        <tr>
                                            <th className="px-6 py-3">Date</th>
                                            <th className="px-6 py-3">
                                                Service
                                            </th>
                                            <th className="px-6 py-3">
                                                Status
                                            </th>
                                            <th className="px-6 py-3">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sessions.map((session) => (
                                            <tr
                                                key={session.id}
                                                className="bg-white border-b hover:bg-gray-50 transition duration-200"
                                            >
                                                <td className="px-6 py-4">
                                                    {new Date(
                                                        session.sessionDateTime
                                                    ).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {session.serviceName}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                            session.status
                                                        )}`}
                                                    >
                                                        {session.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedSession(
                                                                session
                                                            );
                                                            setActiveTab(
                                                                "notes"
                                                            );
                                                        }}
                                                        className="text-white bg-pink-600 hover:bg-pink-700 focus:ring-4 focus:ring-pink-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
                                                    >
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Notes Content */}
                {activeTab === "notes" && (
                    <div className="bg-white shadow-md rounded-lg p-6">
                        {selectedSession ? (
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    const form = e.target as HTMLFormElement;
                                    const noteElement = form.elements.namedItem(
                                        "note"
                                    ) as HTMLTextAreaElement;
                                    const imgBeforeElement =
                                        form.elements.namedItem(
                                            "imgBefore"
                                        ) as HTMLInputElement;
                                    const imgAfterElement =
                                        form.elements.namedItem(
                                            "imgAfter"
                                        ) as HTMLInputElement;

                                    const note = noteElement.value.trim();
                                    const imgBefore =
                                        imgBeforeElement.files?.[0];
                                    const imgAfter = imgAfterElement.files?.[0];

                                    // Validation
                                    if (!note) {
                                        toast.error(
                                            "Please enter session notes."
                                        );
                                        return;
                                    }
                                    if (!imgBefore) {
                                        toast.error(
                                            "Please upload an image before the session."
                                        );
                                        return;
                                    }
                                    if (!imgAfter) {
                                        toast.error(
                                            "Please upload an image after the session."
                                        );
                                        return;
                                    }

                                    try {
                                        // Disable submit button during upload
                                        const submitButton = form.querySelector(
                                            'button[type="submit"]'
                                        ) as HTMLButtonElement;
                                        submitButton.disabled = true;
                                        submitButton.textContent =
                                            "Updating...";

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
                                        console.error(
                                            "Error updating session:",
                                            error
                                        );
                                        toast.error(
                                            "Failed to update session. Please try again."
                                        );
                                    } finally {
                                        // Re-enable submit button
                                        const submitButton = form.querySelector(
                                            'button[type="submit"]'
                                        ) as HTMLButtonElement;
                                        submitButton.disabled = false;
                                        submitButton.textContent =
                                            "Update Session";
                                    }
                                }}
                            >
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                                            <CheckCircleIcon className="w-6 h-6 mr-2 text-pink-500" />
                                            Session Details
                                        </h2>
                                        <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                                            <p className="text-gray-600 flex items-center">
                                                <FaBookMedical className="w-5 h-5 mr-2 text-pink-500" />
                                                Session ID: {selectedSession.id}
                                            </p>
                                            <p className="text-gray-600 flex items-center">
                                                <FaAddressBook className="w-5 h-5 mr-2 text-pink-500" />
                                                Booking ID:{" "}
                                                {selectedSession.bookingId}
                                            </p>
                                            <p className="text-gray-600 flex items-center">
                                                <FaUser className="w-5 h-5 mr-2 text-pink-500" />
                                                Therapist:{" "}
                                                {selectedSession.therapistName}
                                            </p>
                                            <p className="text-gray-600 flex items-center">
                                                <FaUser className="w-5 h-5 mr-2 text-pink-500" />
                                                Client:{" "}
                                                {selectedSession.userName}
                                            </p>
                                            <p className="text-gray-600 flex items-center">
                                                <CalendarIcon className="w-5 h-5 mr-2 text-pink-500" />
                                                Date:{" "}
                                                {new Date(
                                                    selectedSession.sessionDateTime
                                                ).toLocaleString()}
                                            </p>
                                            <p className="text-gray-600 flex items-center">
                                                <DocumentPlusIcon className="w-5 h-5 mr-2 text-pink-500" />
                                                Service:{" "}
                                                {selectedSession.serviceName}
                                            </p>
                                            <p className="text-gray-600 flex items-center">
                                                <ClipboardDocumentListIcon className="w-5 h-5 mr-2 text-pink-500" />
                                                Room:{" "}
                                                {selectedSession.roomName ||
                                                    "N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                                            Upload Images
                                        </h2>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label
                                                    htmlFor="imgBefore"
                                                    className="block mb-2 text-sm font-medium text-gray-700"
                                                >
                                                    Before Session
                                                </label>
                                                <input
                                                    type="file"
                                                    id="imgBefore"
                                                    name="imgBefore"
                                                    accept="image/*"
                                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="imgAfter"
                                                    className="block mb-2 text-sm font-medium text-gray-700"
                                                >
                                                    After Session
                                                </label>
                                                <input
                                                    type="file"
                                                    id="imgAfter"
                                                    name="imgAfter"
                                                    accept="image/*"
                                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label
                                        htmlFor="note"
                                        className="block mb-2 text-sm font-medium text-gray-700"
                                    >
                                        Session Notes
                                    </label>
                                    <textarea
                                        id="note"
                                        name="note"
                                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-pink-500 focus:border-pink-500"
                                        rows={6}
                                        placeholder="Enter detailed session notes here..."
                                        defaultValue={
                                            selectedSession.note || ""
                                        }
                                        required
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full text-white bg-pink-600 hover:bg-pink-700 focus:ring-4 focus:ring-pink-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                                >
                                    Update Session
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <DocumentPlusIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-600 text-lg">
                                    Select a session to view or edit notes
                                </p>
                            </div>
                        )}
                    </div>
                )}
                {/* Blog Content */}
                {activeTab === "blog" && (
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <p className="text-gray-600">Loading blog content...</p>
                    </div>
                )}
            </main>
        </div>
    );
}
