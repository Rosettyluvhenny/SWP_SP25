import React, { useState, useEffect } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { getUserFeedbacks, updateFeedbackById, Feedback } from "../data/feedbacksData";

interface Booking {
  id: string;
  serviceId?: number;
  serviceName: string;
  img: string;
  status: string;
  sessionRemain: number;
}

const FeedbackPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string>("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [rating, setRating] = useState<number>(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get current user ID from token
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Vui lòng đăng nhập để xem đánh giá");
          setLoading(false);
          return;
        }
        
        // Extract user ID from token
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          try {
            const payload = JSON.parse(atob(tokenParts[1]));
            if (payload && payload.sub) {
              setUserId(payload.sub);
              
              // Get user's feedbacks
              const userFeedbacks = await getUserFeedbacks(payload.sub);
              setFeedbacks(userFeedbacks || []);
            }
          } catch (e) {
            console.error("Error parsing token:", e);
            toast.error("Không thể xác thực người dùng.");
          }
        } else {
          toast.error("Token không hợp lệ.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Không thể tải dữ liệu đánh giá.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditFeedback = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setFeedbackText(feedback.feedbackText || "");
    setRating(feedback.rating);
    setIsModalOpen(true);
  };

  const handleSubmitFeedback = async () => {
    if (!selectedFeedback) return;

    try {
      const feedbackId = selectedFeedback.feedbackId?.toString() || "";
      
      const updatedFeedback: Feedback = {
        ...selectedFeedback,
        feedbackText,
        rating,
      };

      const success = await updateFeedbackById(feedbackId, updatedFeedback);
      
      if (success) {
        toast.success("Cập nhật đánh giá thành công!");

        // Update the feedbacks list
        setFeedbacks(prevFeedbacks => 
          prevFeedbacks.map(f => 
            f.feedbackId === selectedFeedback.feedbackId
              ? { ...f, feedbackText, rating }
              : f
          )
        );
      } else {
        toast.error("Không thể cập nhật đánh giá.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Đã xảy ra lỗi khi gửi đánh giá.");
    } finally {
      setIsModalOpen(false);
    }
  };

  // Convert feedbacks to bookings for the "pending" tab
  // This is just for UI consistency with the original code
  const getPendingFeedbacks = (): Booking[] => {
    // In this simplified version, we don't have pending feedbacks
    // as we're only using getUserFeedbacks and updateFeedbackById
    return [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-pink-200 pt-24 flex justify-center items-start">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-64 bg-slate-200 rounded mb-4"></div>
            <div className="h-32 w-full bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const pendingServices = getPendingFeedbacks();
  const completedFeedbacks = feedbacks;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-200 pt-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Đánh giá dịch vụ
          </h1>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`flex-1 py-3 font-medium text-center ${
                activeTab === "pending"
                  ? "text-pink-600 border-b-2 border-pink-600"
                  : "text-gray-500 hover:text-pink-400"
              }`}
              onClick={() => setActiveTab("pending")}
            >
              Chưa đánh giá
            </button>
            <button
              className={`flex-1 py-3 font-medium text-center ${
                activeTab === "completed"
                  ? "text-pink-600 border-b-2 border-pink-600"
                  : "text-gray-500 hover:text-pink-400"
              }`}
              onClick={() => setActiveTab("completed")}
            >
              Đã đánh giá
            </button>
          </div>

          {/* Pending Feedbacks Tab */}
          {activeTab === "pending" && (
            <div>
              {pendingServices.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">
                    Bạn không có dịch vụ nào cần đánh giá.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingServices.map((service) => (
                    <div
                      key={service.id}
                      className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 hover:shadow-md transition"
                    >
                      <img
                        src={service.img}
                        alt={service.serviceName}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="font-semibold text-lg">
                          {service.serviceName}
                        </h3>
                        <p className="text-gray-500 text-sm mb-2">
                          Trạng thái: {service.status}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Số buổi: {service.sessionRemain}
                        </p>
                      </div>
                      <button
                        className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition"
                      >
                        Đánh giá
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Completed Feedbacks Tab */}
          {activeTab === "completed" && (
            <div>
              {completedFeedbacks.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">
                    Bạn chưa có đánh giá nào.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {completedFeedbacks.map((feedback) => (
                    <div
                      key={feedback.feedbackId}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex items-center space-x-4 mb-3">
                        <img
                          src={feedback.img}
                          alt={feedback.serviceName}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-semibold">
                            {feedback.serviceName}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            Ngày đánh giá:{" "}
                            {new Date(
                              feedback.bookingDate
                            ).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map(
                              (_, i) => (
                                <span
                                  key={i}
                                  className="text-yellow-400"
                                >
                                  {i <
                                  feedback.rating ? (
                                    <FaStar />
                                  ) : (
                                    <FaRegStar />
                                  )}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                        <div className="ml-auto">
                          <button
                            onClick={() =>
                              handleEditFeedback(feedback)
                            }
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                          >
                            Sửa
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-700 mt-2">
                        {feedback.feedbackText}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      {isModalOpen && selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4">
              Chỉnh sửa đánh giá
            </h2>
            <div className="mb-4">
              <p className="font-medium">
                {selectedFeedback.serviceName}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Đánh giá của bạn
              </label>
              <div className="flex space-x-2 text-2xl mb-2">
                {[...Array(5)].map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setRating(index + 1)}
                    className="focus:outline-none text-yellow-400"
                  >
                    {index < rating ? (
                      <FaStar />
                    ) : (
                      <FaRegStar />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">
                Nhận xét
              </label>
              <textarea
                value={feedbackText}
                onChange={(e) =>
                  setFeedbackText(e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
                rows={4}
                placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ này..."
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitFeedback}
                className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;