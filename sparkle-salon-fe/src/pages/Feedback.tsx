import React, { useState, useEffect } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { 
  getUserFeedbacks, 
  updateFeedbackById,
  Feedback 
} from "../data/feedbacksData";

const FeedbackPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"PENDING" | "COMPLETE">("PENDING");
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [feedbackText, setFeedbackText] = useState<string>("");
  const [rating, setRating] = useState<number>(5);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setLoading(true);
        
        const userFeedbacks = await getUserFeedbacks();
        
        if (userFeedbacks) {
          setFeedbacks(userFeedbacks);
        } else {
          toast.error("Không thể tải dữ liệu đánh giá.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Đã xảy ra lỗi khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const handleUpdateFeedback = async () => {
    if (!selectedFeedback) return;

    try {
      const updatedFeedback: Feedback = {
        ...selectedFeedback,
        feedbackText,
        rating,
        rated: true
      };

      const success = await updateFeedbackById(
        selectedFeedback.id, 
        updatedFeedback
      );
      
      if (success) {
        toast.success("Gửi đánh giá thành công!");

        // Refresh feedbacks list
        const updatedFeedbacks = await getUserFeedbacks();
        if (updatedFeedbacks) {
          setFeedbacks(updatedFeedbacks);
        }
      } else {
        toast.error("Không thể gửi đánh giá.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Đã xảy ra lỗi khi gửi đánh giá.");
    } finally {
      setIsModalOpen(false);
    }
  };

  const handlePrepareFeedback = (feedback: Feedback) => {
    setSelectedFeedback(feedback);
    setFeedbackText("");
    setRating(5);
    setIsModalOpen(true);
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

  // Separate pending and completed feedbacks
  const pendingFeedbacks = feedbacks.filter(f => !f.rated);
  const completedFeedbacks = feedbacks.filter(f => f.rated);

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
                activeTab === "PENDING"
                  ? "text-pink-600 border-b-2 border-pink-600"
                  : "text-gray-500 hover:text-pink-400"
              }`}
              onClick={() => setActiveTab("PENDING")}
            >
              Chưa đánh giá
            </button>
            <button
              className={`flex-1 py-3 font-medium text-center ${
                activeTab === "COMPLETE"
                  ? "text-pink-600 border-b-2 border-pink-600"
                  : "text-gray-500 hover:text-pink-400"
              }`}
              onClick={() => setActiveTab("COMPLETE")}
            >
              Đã đánh giá
            </button>
          </div>

          {/* Pending Feedbacks Tab */}
          {activeTab === "PENDING" && (
            <div>
              {pendingFeedbacks.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">
                    Bạn không có dịch vụ nào cần đánh giá.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pendingFeedbacks.map((feedback) => (
                    <div
                      key={feedback.id}
                      className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 hover:shadow-md transition"
                    >
                      <img
                        src={feedback.img}
                        alt={feedback.serviceName}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div className="flex-1 text-center md:text-left">
                        <h3 className="font-semibold text-lg">
                          {feedback.serviceName}
                        </h3>
                        <p className="text-gray-500 text-sm mb-2">
                          Ngày: {new Date(feedback.bookingDate).toLocaleDateString('vi-VN')}
                        </p>
                        <p className="text-gray-500 text-sm">
                          Therapist: {feedback.therapistName}
                        </p>
                      </div>
                      <button
                        onClick={() => handlePrepareFeedback(feedback)}
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
          {activeTab === "COMPLETE" && (
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
                      key={feedback.id}
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
                            {new Date(feedback.bookingDate).toLocaleDateString('vi-VN')}
                          </p>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-yellow-400">
                                {i < feedback.rating ? <FaStar /> : <FaRegStar />}
                              </span>
                            ))}
                          </div>
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
              Đánh giá
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
                    {index < rating ? <FaStar /> : <FaRegStar />}
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
                onChange={(e) => setFeedbackText(e.target.value)}
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
                onClick={handleUpdateFeedback}
                className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition"
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;