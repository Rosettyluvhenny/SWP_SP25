import { useState, useEffect } from "react";
import { 
  createFeedback, 
  updateFeedbackById, 
  getUserFeedbacks,
  Feedback, 
  FeedbackResponse 
} from "../data/feedbacksData";
import { motion } from "framer-motion";
import { getUser } from "../data/authData";
import { getUserBookings, Booking } from "../data/userData";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";

export interface User {
  id: string;
  username: string;
  fullName: string;
  dob: string;
  email: string;
  phone: string;
}

const useCurrentUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading: loading };
};

export default function FeedbackPage() {
  const [userFeedbacks, setUserFeedbacks] = useState<FeedbackResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<Feedback | null>(null);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  
  const { user } = useCurrentUser();
  const userId = user?.id;

  // Fetch user feedbacks
  useEffect(() => {
    const fetchUserFeedbacks = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        // Use getUserFeedbacks instead of getFeedbackById since we want an array of feedbacks
        const feedbacks = await getUserFeedbacks(userId);
        setUserFeedbacks(feedbacks);
      } catch (error) {
        toast.error("Không thể tải đánh giá của bạn. Vui lòng thử lại sau.");
        console.error("Error fetching user feedbacks:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserFeedbacks();
  }, [userId]);

  // Fetch user bookings
  useEffect(() => {
    const fetchUserBookings = async () => {
      if (!userId) return;
      
      try {
        const bookings = await getUserBookings();
        if (bookings) {
          // Fixed: Use case-insensitive comparison for payment status
          const paidBookings = bookings.filter(booking => 
            booking.paymentStatus.toUpperCase() === "PAID"
          );
          
          // Debug: Log the bookings to verify the filter works
          console.log("All bookings:", bookings);
          console.log("Filtered paid bookings:", paidBookings);
          
          setUserBookings(paidBookings);
        }
      } catch (error) {
        console.error("Error fetching user bookings:", error);
      }
    };
    
    fetchUserBookings();
  }, [userId]);

  // Open modal for creating new feedback
  const handleCreateFeedback = () => {
    // Check if user has any paid bookings
    if (userBookings.length === 0) {
      toast.warning("Bạn không có dịch vụ nào để đánh giá.");
      return;
    }
    
    setCurrentFeedback(null);
    setFeedbackText("");
    setRating(5);
    setSelectedBooking(null);
    setEditMode(false);
    setModalOpen(true);
  };

  // Open modal for editing existing feedback
  const handleEditFeedback = (feedback: FeedbackResponse) => {
    setCurrentFeedback({
      id: feedback.id,
      feedbackText: feedback.feedbackText,
      rating: feedback.rating,
      serviceName: feedback.serviceName || "",
      img: feedback.img || "",
      bookingDate: feedback.bookingDate,
      therapistName: feedback.therapistName || "",
      serviceId: feedback.serviceId,
      therapistId: feedback.therapistId,
      userId: feedback.userId
    });
    setFeedbackText(feedback.feedbackText);
    setRating(feedback.rating);
    setSelectedBooking(null);
    setEditMode(true);
    setModalOpen(true);
  };

  // Handle booking selection
  const handleBookingSelect = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  // Handle form submission (create or update)
  const handleSubmit = async () => {
    if (!userId) {
      toast.error("Bạn cần đăng nhập để thực hiện thao tác này");
      return;
    }
    
    try {
      let success = false;
      
      if (editMode && currentFeedback) {
        // Update existing feedback
        const updatedFeedback: Feedback = {
          ...currentFeedback,
          feedbackText,
          rating,
        };
        
        success = await updateFeedbackById(currentFeedback.id?.toString() || null, updatedFeedback);
        
        if (success) {
          toast.success("Cập nhật đánh giá thành công!");
          // Update the feedback in the local state
          setUserFeedbacks(userFeedbacks.map(feedback => 
            feedback.id === currentFeedback.id 
              ? { ...feedback, feedbackText, rating } 
              : feedback
          ));
        }
      } else {
        // Create new feedback
        if (!selectedBooking) {
          toast.error("Vui lòng chọn dịch vụ để đánh giá");
          return;
        }
        
        const newFeedback: Feedback = {
          feedbackText,
          rating,
          serviceName: selectedBooking.serviceName,
          img: selectedBooking.img,
          bookingDate: new Date().toISOString().split('T')[0],
          therapistName: "Chuyên viên", // This might need to be fetched from booking details
          serviceId: selectedBooking.serviceId,
          therapistId: "0", // This might need to be fetched from booking details
          userId
        };
        
        success = await createFeedback(newFeedback);
        
        if (success) {
          toast.success("Gửi đánh giá thành công!");
          // Refresh feedbacks to show the new one
          if (userId) {
            const updatedFeedbacks = await getUserFeedbacks(userId);
            setUserFeedbacks(updatedFeedbacks);
          }
        }
      }
      
      if (!success) {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
      console.error("Error submitting feedback:", error);
    }
    
    setModalOpen(false);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Banner */}
      <div className="relative w-full h-[200px] flex flex-col justify-center items-center bg-[url('/assets/sparkle-salon-title.jpg')] bg-cover bg-center bg-no-repeat mt-16 mb-8">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <h1 className="relative z-10 text-white text-5xl md:text-7xl font-serif">
          My Feedbacks
        </h1>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Status and action button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Đánh giá của bạn
          </h2>
          <button 
            onClick={handleCreateFeedback}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow transition-colors duration-300 flex items-center gap-2"
          >
            <span className="text-xl">+</span> Thêm đánh giá mới
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {/* Empty state */}
        {!loading && userFeedbacks.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-5xl text-gray-300 mb-4">⭐</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Không có sản phẩm nào để đánh giá</h3>
            <p className="text-gray-500 mb-6">Bạn đã hoàn tất đánh giá tất cả sản phẩm.</p>
            <button 
              onClick={handleCreateFeedback}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow transition-colors duration-300"
            >
              Xem sản phẩm đã đánh giá
            </button>
          </div>
        )}

        {/* Feedback list */}
        {!loading && userFeedbacks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userFeedbacks.map((feedback) => (
              <div key={feedback.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="h-48 bg-gray-200 relative">
                  <img 
                    src={feedback.img} 
                    alt={feedback.serviceName} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/assets/default-service.jpg";
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <h3 className="text-white font-bold text-xl truncate">
                      {feedback.serviceName}
                    </h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={i < feedback.rating ? "text-yellow-400" : "text-gray-300"} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(feedback.bookingDate)}
                    </span>
                  </div>
                  <p className="text-gray-800 mb-3 line-clamp-3">{feedback.feedbackText}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Chuyên viên: {feedback.therapistName}
                    </span>
                    <button 
                      onClick={() => handleEditFeedback(feedback)}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors duration-300"
                    >
                      Chỉnh sửa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {modalOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={() => setModalOpen(false)}
        >
          <motion.div 
            className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editMode ? "Chỉnh sửa đánh giá" : "Thêm đánh giá mới"}
                </h2>
                <button 
                  onClick={() => setModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {/* Service Selection (only for new feedback) */}
              {!editMode && (
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Chọn dịch vụ
                  </label>
                  <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg">
                    {userBookings.length > 0 ? (
                      userBookings.map((booking) => (
                        <div 
                          key={booking.id}
                          onClick={() => handleBookingSelect(booking)}
                          className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-200 ${
                            selectedBooking?.id === booking.id ? 'bg-indigo-50' : ''
                          }`}
                        >
                          <div className="w-12 h-12 flex-shrink-0 mr-4">
                            <img 
                              src={booking.img} 
                              alt={booking.serviceName}
                              className="w-full h-full object-cover rounded"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/assets/default-service.jpg";
                              }}
                            />
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-medium text-gray-800">{booking.serviceName}</h4>
                            <p className="text-sm text-gray-500">Giá: {booking.price.toLocaleString('vi-VN')} VND</p>
                          </div>
                          {selectedBooking?.id === booking.id && (
                            <span className="ml-3 text-indigo-600">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              </svg>
                            </span>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        Không có dịch vụ nào đã thanh toán
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Star Rating */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Đánh giá của bạn
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`text-2xl cursor-pointer ${
                        star <= (hoveredRating || rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                    />
                  ))}
                </div>
              </div>

              {/* Feedback Text */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Nhận xét của bạn
                </label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ này..."
                  className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-300"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <button 
                  onClick={handleSubmit}
                  disabled={!feedbackText.trim() || (!editMode && !selectedBooking)}
                  className={`flex-1 py-3 rounded-lg font-medium ${
                    feedbackText.trim() && (editMode || selectedBooking)
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  } transition-colors duration-300`}
                >
                  {editMode ? "Cập nhật" : "Gửi đánh giá"}
                </button>
                <button 
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-300"
                >
                  Hủy
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}