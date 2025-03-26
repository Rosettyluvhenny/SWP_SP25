import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { roomsByService, updateBookingSession, updateSessionRoom, updateSessionStatus } from '../data/sessionData';

// Interfaces for component props and data
interface Room {
    id: number;
    name: string;
    capacity: number;
    inUse: boolean;
}

interface Session {
    id: number;
    bookingId: number;
    bookingDate: string;
    img: string | null;
    imgAfter: string | null;
    imgBefore: string | null;
    note: string;
    roomId: number;
    roomName: string | null;
    serviceName: string;
    serviceId: number;
    sessionDateTime: string;
    staffName: string | null;
    status: string;
    therapistName: string;
    userName: string;
}

interface UpdateSessionModalProps {
    isOpen: boolean;
    setIsOpen: (check: boolean) => void;
    session: Session;
}

export default function UpdateSessionModal({
    isOpen,
    setIsOpen,
    session,
}: UpdateSessionModalProps) {
    const [isCompleted, setIsCompleted] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState(session.roomId);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedRoomId(session.roomId);
        }
    }, [isOpen, session]);

    useEffect(() => {
        const fetchRoom = async () => {
            const rq = await roomsByService(session.serviceId);
            setRooms(rq);
        }
        fetchRoom();
    }, [session,isLoading])
    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate inputs
        if (!selectedRoomId) {
            toast.error('Vui lòng chọn phòng');
            return;
        }
        if (!isCompleted) {
            try {
                console.log(selectedRoomId);
                setIsSubmitting(true);
                await updateSessionRoom(session.id,selectedRoomId);

                toast.success('Cập nhật phiên thành công');
                setIsOpen(false);
            } catch (error) {
                console.error('Error updating session:', error);
                toast.error('Có lỗi xảy ra khi cập nhật');
            } finally {
                setIsSubmitting(false);
            }
        }else{
            await updateSessionStatus(session.id,"COMPLETED");
            toast.success('Cập nhật phiên thành công');
                setIsOpen(false);
                setIsLoading(!isLoading);
        }
    };


    // Modal backdrop and container animations
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    const modalVariants = {
        hidden: {
            opacity: 0,
            y: -50
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 20
            }
        }
    };

    // If modal is not open, return null
    if (!isOpen) return null;

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
        >
            <motion.div
                className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
                variants={modalVariants}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                        Cập nhật phiên #{session.id}
                    </h2>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <FaTimes className="text-2xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="room"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Phòng
                        </label>
                        <select
                            id="room"
                            value={selectedRoomId}
                            onChange={(e) => setSelectedRoomId(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option
                                    key={"default"}
                                >
                                    Chọn phòng
                            </option>
                            {rooms.map(room => (
                                <option
                                    key={room.id}
                                    value={room.id}
                                    disabled={session.roomId === room.id || room.inUse == room.capacity}
                                >
                                    {room.name} - Sức chứa: {room.capacity} - Đang sử dụng: {room.inUse}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="completed"
                            checked={isCompleted}
                            onChange={() => setIsCompleted(!isCompleted)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label
                            htmlFor="completed"
                            className="ml-2 block text-sm text-gray-900"
                        >
                            Đánh dấu hoàn thành
                        </label>
                    </div>
                    {/* Submit Button */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Hủy
                        </button>
                        <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-2 disabled:opacity-50"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaSave />
                            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}