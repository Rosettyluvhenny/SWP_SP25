import { StarIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

const SessionDetailsModal = ({ session, onClose }) => {
    if (!session) return null;
    const [activeImageTab, setActiveImageTab] = useState('before');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                <div className="flex justify-between items-center border-b px-6 py-4 bg-gradient-to-r from-pink-500 to-pink-600">
                    <h3 className="text-xl font-medium text-white">
                        Chi tiết phiên dịch vụ #{session.id}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-pink-700 rounded-full p-1"
                    >
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* Service Information */}
                        <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">
                            <h4 className="font-medium text-pink-800 mb-3 border-b border-pink-200 pb-2">Thông tin dịch vụ</h4>
                            <div className="grid grid-cols-1 gap-3">
                                <div>
                                    <h5 className="text-sm font-medium text-gray-500 mb-1">Dịch vụ</h5>
                                    <p className="text-gray-900 font-medium">{session.serviceName}</p>
                                </div>
                                <div>
                                    <h5 className="text-sm font-medium text-gray-500 mb-1">ID Dịch vụ</h5>
                                    <p className="text-gray-900">{session.serviceId}</p>
                                </div>
                                <div>
                                    <h5 className="text-sm font-medium text-gray-500 mb-1">Trạng thái</h5>
                                    <span className="px-2.5 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                        {session.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Booking Information */}
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <h4 className="font-medium text-blue-800 mb-3 border-b border-blue-200 pb-2">Thông tin đặt lịch</h4>
                            <div className="grid grid-cols-1 gap-3">
                                <div>
                                    <h5 className="text-sm font-medium text-gray-500 mb-1">Booking ID</h5>
                                    <p className="text-gray-900">{session.bookingId}</p>
                                </div>
                                <div>
                                    <h5 className="text-sm font-medium text-gray-500 mb-1">Ngày đặt</h5>
                                    <p className="text-gray-900">{new Date(session.bookingDate).toLocaleString("vi-VN")}</p>
                                </div>
                                <div>
                                    <h5 className="text-sm font-medium text-gray-500 mb-1">Ngày & Giờ buổi</h5>
                                    <p className="text-gray-900 font-medium">{new Date(session.sessionDateTime).toLocaleString("vi-VN")}</p>
                                </div>
                            </div>
                        </div>

                        {/* People Information */}
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                            <h4 className="font-medium text-purple-800 mb-3 border-b border-purple-200 pb-2">Thông tin người liên quan</h4>
                            <div className="grid grid-cols-1 gap-3">
                                <div>
                                    <h5 className="text-sm font-medium text-gray-500 mb-1">Khách hàng</h5>
                                    <p className="text-gray-900 font-medium">{session.userName}</p>
                                </div>
                                <div>
                                    <h5 className="text-sm font-medium text-gray-500 mb-1">Chuyên viên</h5>
                                    <p className="text-gray-900 font-medium">{session.therapistName}</p>
                                </div>
                                <div>
                                    <h5 className="text-sm font-medium text-gray-500 mb-1">Nhân viên hỗ trợ</h5>
                                    <p className="text-gray-900 font-medium">{session.staffName}</p>
                                </div>
                            </div>
                        </div>

                        {/* Room Information */}
                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                            <h4 className="font-medium text-amber-800 mb-3 border-b border-amber-200 pb-2">Thông tin phòng</h4>
                            <div className="grid grid-cols-1 gap-3">
                                <div>
                                    <h5 className="text-sm font-medium text-gray-500 mb-1">Phòng</h5>
                                    <p className="text-gray-900 font-medium">{session.roomName}</p>
                                </div>
                            
                            </div>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="mb-6">
                        <h4 className="text-lg font-medium text-gray-800 mb-3">Hình ảnh trước và sau</h4>
                        <div className="flex border-b mb-4">
                            <button
                                className={`px-4 py-2 font-medium ${activeImageTab === 'before'
                                    ? 'border-b-2 border-pink-500 text-pink-600'
                                    : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveImageTab('before')}
                            >
                                Trước điều trị
                            </button>
                            <button
                                className={`px-4 py-2 font-medium ${activeImageTab === 'after'
                                    ? 'border-b-2 border-pink-500 text-pink-600'
                                    : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveImageTab('after')}
                            >
                                Sau điều trị
                            </button>
                        </div>
                        <div className="flex justify-center bg-gray-50 rounded-lg p-4 border border-gray-200">
                            {activeImageTab === 'before' && session.imgBefore && (
                                <img
                                    src={session.imgBefore}
                                    alt="Trước điều trị"
                                    className="max-h-64 object-contain"
                                />
                            )}
                            {activeImageTab === 'after' && session.imgAfter && (
                                <img
                                    src={session.imgAfter}
                                    alt="Sau điều trị"
                                    className="max-h-64 object-contain"
                                />
                            )}
                            {((activeImageTab === 'before' && !session.imgBefore) ||
                                (activeImageTab === 'after' && !session.imgAfter)) && (
                                    <div className="text-gray-400 text-center py-8">
                                        Không có hình ảnh
                                    </div>
                                )}
                        </div>
                    </div>

                    {/* Notes Section */}
                    {session.note && (
                        <div className="mb-6">
                            <h4 className="text-lg font-medium text-gray-800 mb-3">Ghi chú</h4>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <p className="text-gray-800 whitespace-pre-line">{session.note}</p>
                            </div>
                        </div>
                    )}

                    {/* Description Section (if available) */}
                    {session.description && (
                        <div className="mb-6">
                            <h4 className="text-lg font-medium text-gray-800 mb-3">Mô tả</h4>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <p className="text-gray-800 whitespace-pre-line">{session.description}</p>
                            </div>
                        </div>
                    )}

                    {/* Feedback Section */}
                    <div className="mb-6">
                        <h4 className="text-lg font-medium text-gray-800 mb-3">Đánh giá & Phản hồi</h4>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center mb-3">
                                <span className="font-medium mr-2">Đánh giá:</span>
                                {session.rating > 0 ? (
                                    <div className="flex items-center">
                                        <span className="text-yellow-500 mr-1">{session.rating}</span>
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon
                                                    key={i}
                                                    className={`w-4 h-4 ${i < session.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <span className="text-gray-400">Chưa đánh giá</span>
                                )}
                            </div>
                            {session.feedbackText && (
                                <div>
                                    <span className="font-medium">Nội dung:</span>
                                    <p className="mt-1 text-gray-800 whitespace-pre-line">{session.feedbackText}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="border-t px-6 py-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SessionDetailsModal;