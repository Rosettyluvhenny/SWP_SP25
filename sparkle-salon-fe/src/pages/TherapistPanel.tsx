import React, { useEffect, useState, FormEvent, useContext } from "react";
import { useLocation, useNavigate} from "react-router-dom";
import {
    getTherapistInfo,
    updateTherapist,
    type Therapist,
    getTherapistCompletedSession,
    type CompletedSession,
    type MetaData,
    type PageableRequest,
} from "../data/therapistData";
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
    UserIcon,
    PhoneIcon,
    EnvelopeIcon,
    StarIcon,
    DocumentTextIcon,
    ClockIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
} from "@heroicons/react/24/outline";
import { FaUser, FaBookMedical, FaAddressBook } from "react-icons/fa";
import { toast } from "react-toastify";
import ManagementModal from "../components/ManagementModal";
import { changePassword } from "../data/authData";
import { UserContext } from "../context/UserContext";

// Type Definitions
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

const getStatusColor = (status: string): string => {
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

export default function Therapist() {
    // const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [therapist, setTherapist] = useState<Therapist | null>(null);
    const [activeTab, setActiveTab] = useState<
        "account" | "schedule" | "notes" | "blog" | "history"
    >("account");
    const [loading, setLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [selectedSession, setSelectedSession] = useState<Session | null>(
        null
    );
    const [completedSessions, setCompletedSessions] = useState<
        CompletedSession[]
    >([]);
    const [sessionMeta, setSessionMeta] = useState<MetaData>({
        totalElements: 0,
        totalPages: 0,
        pageNumber: 0,
        pageSize: 0,
        first: true,
        last: false,
        numberOfElements: 0,
    });
    const [historyLoading, setHistoryLoading] = useState<boolean>(false);
    const [historyError, setHistoryError] = useState<string | null>(null);
    const [historyPage, setHistoryPage] = useState<number>(0);
    const [historyPageSize, setHistoryPageSize] = useState<number>(10);
    const [historyFromDate, setHistoryFromDate] = useState<string>(() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return date.toISOString().split("T")[0];
    });
    const [historyToDate, setHistoryToDate] = useState<string>(() => {
        const date = new Date();
        return date.toISOString().split("T")[0];
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]); // Added state for serviceIds
    const [modalType, setModalType] = useState<
        "edit" | "changePassword" | null
    >(null);
    const timestamp = Date.now();
    const [startDate, setStartDate] = useState<string>(() => {
        const date = new Date();
        // date.setDate(1);
        return date.toISOString().split("T")[0];
    });
    const [endDate, setEndDate] = useState<string>(() => {
        const date = new Date();
        date.setMonth(date.getMonth() + 1, 0);
        return date.toISOString().split("T")[0];
    });
    const { user } = useContext(UserContext);
    const location = useLocation();

    useEffect(() => {
        const tabFromState = location.state?.tab;
        console.log("therapist :", tabFromState);
        if (tabFromState) {
            setActiveTab(tabFromState);
        }
    }, [location.state]);
    const fetchTherapistInfoData = async () => {
        try {
            setLoading(true);
            const data = await getTherapistInfo();
            if (!data) throw new Error("Therapist info not found");
            setTherapist(data);
            setSelectedServiceIds(data.services?.map((s) => s.id) || []);
            setError(null);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Error fetching therapist info"
            );
            console.error("Fetch therapist info error:", error);
        } finally {
            setLoading(false);
        }
    };
    const openModal = (
        type: "edit" | "changePassword",
        therapistData: Therapist | null = null
    ) => {
        if (type === "edit" && therapistData) {
            setTherapist({ ...therapistData }); // Chỉ setTherapist khi chỉnh sửa thông tin
        }
        setModalType(type);
        setSelectedFile(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalType(null);
        setSelectedFile(null);
    };
    const fetchSessions = async () => {
        try {
            setLoading(true);
            const data = await getTherapistSessions(startDate, endDate);
            setSessions(data || []);
            setError(null);
        } catch (error) {
            setError("Error fetching sessions");
            console.error("Fetch sessions error:", error);
        } finally {
            setLoading(false);
        }
    };

    // completed sessions
    const fetchCompletedSessions = async () => {
        try {
            setHistoryLoading(true);
            const pageable: PageableRequest = {
                pageNumber: historyPage,
                pageSize: historyPageSize,
                sort: ["specificDateTime,desc"],
            };

            const { sessions, meta } = await getTherapistCompletedSession(
                historyFromDate,
                historyToDate,
                pageable
            );

            setCompletedSessions(sessions);
            setSessionMeta(meta);
            setHistoryError(null);
        } catch (error) {
            setHistoryError("Lỗi khi tải lịch sử");
            console.error("Fetch completed sessions error:", error);
        } finally {
            setHistoryLoading(false);
        }
    };

    // Effect Hooks
    useEffect(() => {
        if (activeTab === "account") {
            fetchTherapistInfoData();
        } else if (activeTab === "schedule") {
            fetchSessions();
        } else if (activeTab === "blog") {
            navigate(`/therapist/blog`);
        } else if (activeTab === "history") {
            fetchCompletedSessions();
        }
    }, [
        activeTab,
        startDate,
        endDate,
        historyPage,
        historyPageSize,
        historyFromDate,
        historyToDate,
    ]);

    // Form Handlers
    const handleSessionUpdate = async (
        sessionId: number,
        note: string,
        imgBefore: File,
        imgAfter: File
    ) => {
        try {
            setIsSubmitting(true);
            const updateRequest = {
                note,
                roomId: selectedSession?.roomId || 0,
            };
            await updateBookingSession(
                sessionId,
                updateRequest,
                imgBefore,
                imgAfter
            );
            toast.success("Đã được cập nhật thành công");
            await fetchSessions();
            setSelectedSession(null);
        } catch (error) {
            toast.error("Không cập nhật được");
            console.error("Lỗi cập nhật:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        try {
            setIsSubmitting(true);

            if (modalType === "edit" && therapist) {
                const experienceYears = parseInt(
                    (formData.get("experienceYears") as string) || "0"
                );
                const bio = (formData.get("bio") as string) || "";
                const fullName = (formData.get("fullName") as string) || "";
                const phone = (formData.get("phone") as string) || "";
                const email = (formData.get("email") as string) || "";
                const dob = (formData.get("dob") as string) || "";
                const serviceId = selectedServiceIds || [];
                const imageToSend =
                    selectedFile !== null ? selectedFile : undefined;

                const success = await updateTherapist(
                    therapist.id,
                    experienceYears,
                    bio,
                    dob,
                    fullName,
                    email,
                    phone,
                    imageToSend, // Gửi undefined để giữ hình cũ nếu cần
                    serviceId
                );

                console.log("Update result:", success);
                if (success) {
                    toast.success("Nhà trị liệu đã cập nhật thành công");
                } else {
                    throw new Error("Cập nhật thất bại");
                }
            } else if (modalType === "changePassword" && therapist) {
                const currentPassword = formData.get(
                    "currentPassword"
                ) as string;
                const newPassword = formData.get("newPassword") as string;
                const confirmPassword = formData.get(
                    "confirmPassword"
                ) as string;

                // Validation
                if (!currentPassword || !newPassword || !confirmPassword) {
                    toast.error("Vui lòng điền đầy đủ các trường mật khẩu");
                    return;
                }
                if (currentPassword === newPassword) {
                    toast.error(
                        "Mật khẩu mới không được trùng với mật khẩu cũ"
                    );
                    return;
                }
                if (newPassword !== confirmPassword) {
                    toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp");
                    return;
                }

                const therapistId = therapist.userId;
                if (!therapistId) {
                    throw new Error("Không tìm thấy ID chuyên viên");
                }

                const success = await changePassword(
                    therapistId,
                    currentPassword,
                    newPassword
                );
                if (success) {
                    toast.success("Đổi mật khẩu thành công!");
                } else {
                    throw new Error("Đổi mật khẩu thất bại");
                }
            }

            setIsModalOpen(false);
            setModalType(null);
        } catch (error: any) {
            console.error("Submit error:", error);
            toast.error(error.message || "Có lỗi xảy ra khi lưu dữ liệu");
        } finally {
            await fetchTherapistInfoData(); // Đảm bảo fetch lại dữ liệu sau khi hoàn tất
            setIsSubmitting(false);
            setSelectedFile(null);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    // Render
    return (
        <div className="flex h-screen bg-gray-50">
            <SidebarTherapist
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            <main className="flex-1 p-6 overflow-auto">
                {/* Account Tab */}
                {activeTab === "account" && (
                    <div className="w-full max-w-4xl mx-auto">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                                <ExclamationTriangleIcon className="w-6 h-6 inline-block mr-2 text-red-500" />
                                <span>{error}</span>
                            </div>
                        ) : therapist ? (
                            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                                <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-4">
                                    <h2 className="text-xl font-semibold text-white flex items-center">
                                        <UserIcon className="w-6 h-6 mr-2" />
                                        Thông tin chuyên viên
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
                                        <div className="relative">
                                            <img
                                                src={
                                                    therapist.img +
                                                        `?t=${timestamp}` ||
                                                    "/default-avatar.png"
                                                }
                                                alt={therapist.fullName}
                                                className="w-56 h-56 rounded-full object-cover border-4 border-white shadow-md"
                                            />
                                            <div className="absolute bottom-0 right-0 bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                                                {therapist.experienceYears} năm
                                            </div>
                                        </div>
                                        <div className="flex-1 text-center md:text-left">
                                            <h3 className="text-2xl font-bold text-gray-800">
                                                {therapist.fullName}
                                            </h3>
                                            <p className="text-gray-500 mb-2">
                                                @{therapist.username}
                                            </p>
                                            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                                                {therapist.services?.map(
                                                    (service) => (
                                                        <span
                                                            key={service.id}
                                                            className="bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                                                        >
                                                            {service.name}
                                                        </span>
                                                    )
                                                )}
                                                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                    {therapist.experienceYears}+
                                                    năm kinh nghiệm
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <div className="flex items-start">
                                                <EnvelopeIcon className="w-5 h-5 mr-2 text-pink-500 mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Email
                                                    </p>
                                                    <p className="text-gray-800">
                                                        {therapist.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <PhoneIcon className="w-5 h-5 mr-2 text-pink-500 mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Số điện thoại
                                                    </p>
                                                    <p className="text-gray-800">
                                                        {therapist.phone}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <CalendarIcon className="w-5 h-5 mr-2 text-pink-500 mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Ngày sinh
                                                    </p>
                                                    <p className="text-gray-800">
                                                        {therapist.dob
                                                            ? new Date(
                                                                  therapist.dob
                                                              ).toLocaleDateString(
                                                                  "vi-VN"
                                                              )
                                                            : "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-start">
                                                <StarIcon className="w-5 h-5 mr-2 text-pink-500 mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Kinh nghiệm
                                                    </p>
                                                    <p className="text-gray-800">
                                                        {
                                                            therapist.experienceYears
                                                        }{" "}
                                                        năm
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <DocumentTextIcon className="w-5 h-5 mr-2 text-pink-500 mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Tiểu sử
                                                    </p>
                                                    <p className="text-gray-800">
                                                        {therapist.bio ||
                                                            "Chưa có tiểu sử"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex justify-end">
                                        <button
                                            onClick={() =>
                                                openModal("edit", therapist)
                                            }
                                            className="px-4 py-2 mr-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition disabled:opacity-50"
                                            disabled={isSubmitting}
                                        >
                                            Sửa thông tin
                                        </button>
                                        <button
                                            onClick={() =>
                                                openModal("changePassword")
                                            }
                                            className="px-4 py-2 mr-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                                            disabled={isSubmitting}
                                        >
                                            Đổi Password
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-600 text-center py-8">
                                Không tìm thấy thông tin chuyên viên
                            </p>
                        )}
                    </div>
                )}

                {/* Schedule Tab */}
                {activeTab === "schedule" && (
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <header className="flex items-center mb-6">
                            <CalendarIcon className="w-6 h-6 mr-3 text-pink-600" />
                            <h1 className="text-2xl font-bold text-gray-800">
                                Lịch làm việc
                            </h1>
                        </header>
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                                <ExclamationTriangleIcon className="w-6 h-6 inline-block mr-2 text-red-500" />
                                <span>{error}</span>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-700">
                                            Ngày bắt đầu
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
                                            Ngày kết thúc
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
                                {sessions.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left text-gray-500">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                                <tr>
                                                    <th className="px-6 py-3">
                                                        Ngày
                                                    </th>
                                                    <th className="px-6 py-3">
                                                        Dịch vụ
                                                    </th>
                                                    <th className="px-6 py-3">
                                                        Trạng thái
                                                    </th>
                                                    <th className="px-6 py-3">
                                                        Hành động
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sessions.map((session) => (
                                                    <tr
                                                        key={session.id}
                                                        className="bg-white border-b hover:bg-gray-50"
                                                    >
                                                        <td className="px-6 py-4">
                                                            {new Date(
                                                                session.sessionDateTime
                                                            ).toLocaleString(
                                                                "vi-VN"
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {
                                                                session.serviceName
                                                            }
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
                                                                    if (
                                                                        !session.roomId
                                                                    ) {
                                                                        toast.error(
                                                                            "buổi trị liệu chưa được có phòng"
                                                                        );
                                                                    } else {
                                                                        setSelectedSession(
                                                                            session
                                                                        );
                                                                        setActiveTab(
                                                                            "notes"
                                                                        );
                                                                    }
                                                                }}
                                                                className="text-white bg-pink-600 hover:bg-pink-700 rounded-lg text-sm px-3 py-2 transition disabled:opacity-50"
                                                                disabled={
                                                                    isSubmitting
                                                                }
                                                            >
                                                                Xem chi tiết
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                                        <DocumentPlusIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                        <p className="text-gray-600">
                                            Không có buổi nào trong khoảng thời
                                            gian này
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* Notes Tab */}
                {activeTab === "notes" && (
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <header className="flex items-center mb-6">
                            <ClipboardDocumentListIcon className="w-6 h-6 mr-3 text-pink-600" />
                            <h1 className="text-2xl font-bold text-gray-800">
                                Ghi chú buổi trị liệu
                            </h1>
                        </header>
                        {selectedSession ? (
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    const form = e.target as HTMLFormElement;
                                    const note = (
                                        form.elements.namedItem(
                                            "note"
                                        ) as HTMLTextAreaElement
                                    ).value;
                                    const imgBefore = (
                                        form.elements.namedItem(
                                            "imgBefore"
                                        ) as HTMLInputElement
                                    ).files?.[0];
                                    const imgAfter = (
                                        form.elements.namedItem(
                                            "imgAfter"
                                        ) as HTMLInputElement
                                    ).files?.[0];

                                    if (!note || !imgBefore || !imgAfter) {
                                        toast.error(
                                            "Vui lòng điền đầy đủ thông tin (ghi chú và hình ảnh)"
                                        );
                                        return;
                                    }

                                    await handleSessionUpdate(
                                        selectedSession.id,
                                        note,
                                        imgBefore,
                                        imgAfter
                                    );
                                }}
                            >
                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                                            <CheckCircleIcon className="w-6 h-6 mr-2 text-pink-500" />
                                            Chi tiết buổi
                                        </h2>
                                        <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                                            <p className="text-gray-600 flex items-center">
                                                <FaBookMedical className="w-5 h-5 mr-2 text-pink-500" />
                                                ID buổi: {selectedSession.id}
                                            </p>
                                            <p className="text-gray-600 flex items-center">
                                                <FaAddressBook className="w-5 h-5 mr-2 text-pink-500" />
                                                ID Đặt lịch:{" "}
                                                {selectedSession.bookingId}
                                            </p>
                                            <p className="text-gray-600 flex items-center">
                                                <FaUser className="w-5 h-5 mr-2 text-pink-500" />
                                                Khách hàng:{" "}
                                                {selectedSession.userName}
                                            </p>
                                            <p className="text-gray-600 flex items-center">
                                                <CalendarIcon className="w-5 h-5 mr-2 text-pink-500" />
                                                Ngày:{" "}
                                                {new Date(
                                                    selectedSession.sessionDateTime
                                                ).toLocaleString("vi-VN")}
                                            </p>
                                            <p className="text-gray-600 flex items-center">
                                                <DocumentPlusIcon className="w-5 h-5 mr-2 text-pink-500" />
                                                Dịch vụ:{" "}
                                                {selectedSession.serviceName}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                                            Tải lên hình ảnh
                                        </h2>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label
                                                    htmlFor="imgBefore"
                                                    className="block mb-2 text-sm font-medium text-gray-700"
                                                >
                                                    Trước
                                                </label>
                                                {selectedSession.imgBefore && (
                                                    <div className="mb-2">
                                                        <img
                                                            src={
                                                                selectedSession.imgBefore +
                                                                `?t=${timestamp}`
                                                            }
                                                            alt="Hình ảnh trước"
                                                            className="w-full h-40 object-cover rounded-lg"
                                                        />
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    id="imgBefore"
                                                    name="imgBefore"
                                                    accept="image/*"
                                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                                                    required
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="imgAfter"
                                                    className="block mb-2 text-sm font-medium text-gray-700"
                                                >
                                                    Sau
                                                </label>
                                                {selectedSession.imgAfter && (
                                                    <div className="mb-2">
                                                        <img
                                                            src={
                                                                selectedSession.imgAfter +
                                                                `?t=${timestamp}`
                                                            }
                                                            alt="Hình ảnh sau"
                                                            className="w-full h-40 object-cover rounded-lg"
                                                        />
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    id="imgAfter"
                                                    name="imgAfter"
                                                    accept="image/*"
                                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                                                    required
                                                    disabled={isSubmitting}
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
                                        Ghi chú buổi
                                    </label>
                                    <textarea
                                        id="note"
                                        name="note"
                                        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-pink-500 focus:border-pink-500"
                                        rows={6}
                                        placeholder="Nhập ghi chú chi tiết cho buổi tại đây..."
                                        defaultValue={
                                            selectedSession.note || ""
                                        }
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full text-white bg-pink-600 hover:bg-pink-700 focus:ring-4 focus:ring-pink-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition disabled:opacity-50"
                                >
                                    {isSubmitting
                                        ? "Đang cập nhật..."
                                        : "Đã cập nhật"}
                                </button>
                            </form>
                        ) : (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <DocumentPlusIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-600 text-lg">
                                    Chọn một buổi để xem hoặc chỉnh sửa ghi chú
                                </p>
                            </div>
                        )}
                    </div>
                )}
                {/* History Tab */}
                {activeTab === "history" && (
                    <div className="bg-white shadow-md rounded-lg p-6">
                        <header className="flex items-center mb-6">
                            <ClockIcon className="w-6 h-6 mr-3 text-pink-600" />
                            <h1 className="text-2xl font-bold text-gray-800">
                                Lịch sử buổi điều trị
                            </h1>
                        </header>

                        <div className="mb-6 flex flex-col sm:flex-row gap-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Từ ngày
                                </label>
                                <input
                                    type="date"
                                    value={historyFromDate}
                                    onChange={(e) =>
                                        setHistoryFromDate(e.target.value)
                                    }
                                    className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block w-full p-2.5"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Đến ngày
                                </label>
                                <input
                                    type="date"
                                    value={historyToDate}
                                    onChange={(e) =>
                                        setHistoryToDate(e.target.value)
                                    }
                                    className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-pink-500 focus:border-pink-500 block w-full p-2.5"
                                />
                            </div>
                        </div>

                        {historyLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
                            </div>
                        ) : historyError ? (
                            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                                <ExclamationTriangleIcon className="w-6 h-6 inline-block mr-2 text-red-500" />
                                <span>{historyError}</span>
                            </div>
                        ) : (
                            <>
                                {completedSessions.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left text-gray-500">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                                <tr>
                                                    <th className="px-6 py-3">
                                                        Ngày
                                                    </th>
                                                    <th className="px-6 py-3">
                                                        Dịch vụ
                                                    </th>
                                                    <th className="px-6 py-3">
                                                        Khách hàng
                                                    </th>
                                                    <th className="px-6 py-3">
                                                        Trạng thái
                                                    </th>
                                                    <th className="px-6 py-3">
                                                        Đánh giá
                                                    </th>
                                                    <th className="px-6 py-3">
                                                        Ghi chú
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {completedSessions.map(
                                                    (session) => (
                                                        <tr
                                                            key={session.id}
                                                            className="bg-white border-b hover:bg-gray-50"
                                                        >
                                                            <td className="px-6 py-4">
                                                                {new Date(
                                                                    session.specificDateTime
                                                                ).toLocaleString(
                                                                    "vi-VN"
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {
                                                                    session.serviceName
                                                                }
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {
                                                                    session.userEmail
                                                                }
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span
                                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                        session.status.toLowerCase() ===
                                                                        "completed"
                                                                            ? "bg-green-100 text-green-800"
                                                                            : session.status.toLowerCase() ===
                                                                              "cancelled"
                                                                            ? "bg-red-100 text-red-800"
                                                                            : "bg-yellow-100 text-yellow-800"
                                                                    }`}
                                                                >
                                                                    {
                                                                        session.status
                                                                    }
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {session.rating >
                                                                0 ? (
                                                                    <div className="flex items-center">
                                                                        {Array.from(
                                                                            {
                                                                                length: 5,
                                                                            }
                                                                        ).map(
                                                                            (
                                                                                _,
                                                                                i
                                                                            ) => (
                                                                                <StarIcon
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                    className={`w-5 h-5 ${
                                                                                        i <
                                                                                        session.rating
                                                                                            ? "text-yellow-400"
                                                                                            : "text-gray-300"
                                                                                    }`}
                                                                                />
                                                                            )
                                                                        )}
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-gray-400">
                                                                        Chưa
                                                                        đánh giá
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {session.notes ? (
                                                                    <div
                                                                        className="max-w-xs truncate"
                                                                        title={
                                                                            session.notes
                                                                        }
                                                                    >
                                                                        {
                                                                            session.notes
                                                                        }
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-gray-400">
                                                                        Không có
                                                                        ghi chú
                                                                    </span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>

                                        {/* Pagination */}
                                        <div className="flex justify-between items-center mt-6">
                                            <div className="text-sm text-gray-700">
                                                Hiển thị{" "}
                                                <span className="font-medium">
                                                    {
                                                        sessionMeta.numberOfElements
                                                    }
                                                </span>{" "}
                                                trong tổng số{" "}
                                                <span className="font-medium">
                                                    {sessionMeta.totalElements}
                                                </span>{" "}
                                                buổi điều trị
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() =>
                                                        setHistoryPage((prev) =>
                                                            Math.max(
                                                                0,
                                                                prev - 1
                                                            )
                                                        )
                                                    }
                                                    disabled={sessionMeta.first}
                                                    className="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50"
                                                >
                                                    <ArrowLeftIcon className="w-5 h-5" />
                                                </button>
                                                <span className="px-3 py-1 border rounded-md bg-pink-50">
                                                    {sessionMeta.pageNumber + 1}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        setHistoryPage(
                                                            (prev) => prev + 1
                                                        )
                                                    }
                                                    disabled={sessionMeta.last}
                                                    className="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-50"
                                                >
                                                    <ArrowRightIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm text-gray-700">
                                                    Hiển thị
                                                </span>
                                                <select
                                                    value={historyPageSize}
                                                    onChange={(e) => {
                                                        setHistoryPageSize(
                                                            Number(
                                                                e.target.value
                                                            )
                                                        );
                                                        setHistoryPage(0); // Reset to first page when changing page size
                                                    }}
                                                    className="border rounded-md px-2 py-1 text-sm"
                                                >
                                                    <option value="5">5</option>
                                                    <option value="10">
                                                        10
                                                    </option>
                                                    <option value="20">
                                                        20
                                                    </option>
                                                    <option value="50">
                                                        50
                                                    </option>
                                                </select>
                                                <span className="text-sm text-gray-700">
                                                    mỗi trang
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                                        <DocumentPlusIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                        <p className="text-gray-600">
                                            Không có buổi điều trị nào trong
                                            khoảng thời gian này
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* Modal */}
                <ManagementModal
                    isOpen={isModalOpen}
                    title={
                        modalType === "edit"
                            ? "Sửa thông tin chuyên viên"
                            : "Đổi Password"
                    }
                    onClose={closeModal}
                    onSubmit={handleSubmit}
                >
                    {modalType === "edit" ? (
                        // Form sửa thông tin chuyên viên
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Họ và tên *
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        defaultValue={therapist?.fullName || ""}
                                        className="w-full p-2 border rounded-lg focus:ring-pink-500 focus:border-pink-500"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        defaultValue={therapist?.email || ""}
                                        className="w-full p-2 border rounded-lg focus:ring-pink-500 focus:border-pink-500"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Số điện thoại *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        defaultValue={therapist?.phone || ""}
                                        className="w-full p-2 border rounded-lg focus:ring-pink-500 focus:border-pink-500"
                                        required
                                        disabled={isSubmitting}
                                        pattern="0[0-9]{9}"
                                        title="Số điện thoại phải có 10 số và bắt đầu bằng 0 (ví dụ: 0123456789)"
                                        placeholder="Ví dụ: 0123456789"
                                        onInvalid={(e) => {
                                            e.currentTarget.setCustomValidity(
                                                "Số điện thoại phải có 10 số và bắt đầu bằng 0"
                                            );
                                        }}
                                        onInput={(e) => {
                                            e.currentTarget.setCustomValidity(
                                                ""
                                            );
                                        }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Ngày sinh *
                                    </label>
                                    <input
                                        type="date"
                                        name="dob"
                                        defaultValue={therapist?.dob || ""}
                                        className="w-full p-2 border rounded-lg focus:ring-pink-500 focus:border-pink-500"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Số năm kinh nghiệm *
                                    </label>
                                    <input
                                        type="number"
                                        name="experienceYears"
                                        defaultValue={
                                            therapist?.experienceYears || ""
                                        }
                                        className="w-full p-2 border rounded-lg focus:ring-pink-500 focus:border-pink-500"
                                        required
                                        disabled={isSubmitting}
                                        min="0"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tiểu sử *
                                    </label>
                                    <textarea
                                        name="bio"
                                        defaultValue={therapist?.bio || ""}
                                        className="w-full p-2 border rounded-lg h-32 focus:ring-pink-500 focus:border-pink-500"
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="col-span-full">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Hình ảnh
                                    </label>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                                        accept="image/*"
                                        disabled={isSubmitting}
                                    />
                                    {therapist?.img && !selectedFile && (
                                        <div className="mt-2">
                                            <img
                                                src={
                                                    therapist.img +
                                                    `?t=${timestamp}`
                                                }
                                                alt="Current therapist"
                                                className="mt-2 h-40 object-cover rounded"
                                            />
                                        </div>
                                    )}
                                    {selectedFile && (
                                        <div className="mt-2">
                                            <p className="mt-2 text-sm text-gray-500">
                                                Đã chọn: {selectedFile.name}
                                            </p>
                                            <img
                                                src={URL.createObjectURL(
                                                    selectedFile
                                                )}
                                                alt="Preview"
                                                className="mt-2 h-40 object-cover rounded"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Form đổi mật khẩu

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mật khẩu hiện tại *
                                </label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    className="w-full p-2 border rounded-lg focus:ring-pink-500 focus:border-pink-500"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mật khẩu mới *
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    className="w-full p-2 border rounded-lg focus:ring-pink-500 focus:border-pink-500"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Xác nhận mật khẩu mới *
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="w-full p-2 border rounded-lg focus:ring-pink-500 focus:border-pink-500"
                                    required
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                    )}
                </ManagementModal>
            </main>
        </div>
    );
}
