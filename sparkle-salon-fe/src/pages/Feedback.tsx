import React, { useState, useEffect } from 'react';
import { getUserBookings, Booking } from '../data/userData';
import { getUserFeedbacks, Feedback, createFeedback, updateFeedbackById } from '../data/feedbacksData';
import { getUser } from '../data/authData';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { toast } from 'react-toastify';

const FeedbackPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [pendingServices, setPendingServices] = useState<Booking[]>([]);
  const [completedFeedbacks, setCompletedFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string>('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<Booking | null>(null);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentFeedbackId, setCurrentFeedbackId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userData = await getUser();
        if (userData && userData.id) {
          setUserId(userData.id);
          
          // Get user's paid bookings
          const bookingsResponse = await getUserBookings();
          const bookings = bookingsResponse || []; // Handle null case
          const paidBookings = bookings.filter((booking: Booking) => booking.paymentStatus === 'PAID');
          
          // Get user's feedbacks
          const feedbacksResponse = await getUserFeedbacks(userData.id);
          const feedbacks = feedbacksResponse || []; // Handle null case
          
          // Find services that don't have feedback yet
          const feedbackServiceIds = feedbacks.map((feedback: Feedback) => feedback.serviceId);
          const pendingServices = paidBookings.filter(
            (booking: Booking) => !feedbackServiceIds.includes(booking.serviceId)
          );
          
          setPendingServices(pendingServices);
          setCompletedFeedbacks(feedbacks);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Không thể tải dữ liệu đánh giá.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleFeedbackClick = (service: Booking) => {
    setSelectedService(service);
    setFeedbackText('');
    setRating(5);
    setIsEditing(false);
    setIsModalOpen(true);
  };
  
  const handleEditFeedback = (feedback: Feedback) => {
    setFeedbackText(feedback.feedbackText);
    setRating(feedback.rating);
    setIsEditing(true);
    setCurrentFeedbackId(feedback.id?.toString() || null);
    
    // Create a dummy booking object from feedback data
    const dummyBooking: Booking = {
      id: feedback.id?.toString() || '',
      serviceId: feedback.serviceId || 0,
      serviceName: feedback.serviceName,
      img: feedback.img,
      status: 'COMPLETED',
      paymentStatus: 'PAID',
      paymentMethod: '',
      notes: '',
      sessionRemain: 0,
      price: 0
    };
    
    setSelectedService(dummyBooking);
    setIsModalOpen(true);
  };
  
  const handleSubmitFeedback = async () => {
    if (!selectedService) return;
    
    try {
      if (isEditing && currentFeedbackId) {
        // Update existing feedback
        const feedbackData: Feedback = {
          feedbackText,
          rating,
          serviceName: selectedService.serviceName,
          img: selectedService.img,
          bookingDate: new Date().toISOString(),
          therapistName: 'Therapist', // This might need to be retrieved from booking details
          serviceId: selectedService.serviceId,
          userId
        };
        
        const success = await updateFeedbackById(currentFeedbackId, feedbackData);
        if (success) {
          toast.success('Cập nhật đánh giá thành công!');
          
          // Update the completed feedbacks list
          setCompletedFeedbacks(prev => 
            prev.map(f => f.id?.toString() === currentFeedbackId ? {
              ...f,
              feedbackText,
              rating
            } : f)
          );
        } else {
          toast.error('Không thể cập nhật đánh giá.');
        }
      } else {
        // Create new feedback
        const feedbackData: Feedback = {
          feedbackText,
          rating,
          serviceName: selectedService.serviceName,
          img: selectedService.img,
          bookingDate: new Date().toISOString(),
          therapistName: 'Therapist', // This might need to be retrieved from booking details
          serviceId: selectedService.serviceId,
          userId
        };
        
        const success = await createFeedback(feedbackData);
        if (success) {
          toast.success('Đánh giá thành công!');
          
          // Remove from pending and add to completed
          setPendingServices(prev => 
            prev.filter(service => service.serviceId !== selectedService.serviceId)
          );
          
          // Add to completed feedbacks
          setCompletedFeedbacks(prev => [...prev, {...feedbackData, id: Date.now()}]);
          
          // Switch to completed tab
          setActiveTab('completed');
        } else {
          toast.error('Không thể tạo đánh giá.');
        }
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Đã xảy ra lỗi khi gửi đánh giá.');
    } finally {
      setIsModalOpen(false);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-pink-200 pt-24 px-4 md:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Đánh giá dịch vụ</h1>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`flex-1 py-3 font-medium text-center ${
                activeTab === 'pending' 
                ? 'text-pink-600 border-b-2 border-pink-600' 
                : 'text-gray-500 hover:text-pink-400'
              }`}
              onClick={() => setActiveTab('pending')}
            >
              Chưa đánh giá
            </button>
            <button
              className={`flex-1 py-3 font-medium text-center ${
                activeTab === 'completed' 
                ? 'text-pink-600 border-b-2 border-pink-600' 
                : 'text-gray-500 hover:text-pink-400'
              }`}
              onClick={() => setActiveTab('completed')}
            >
              Đã đánh giá
            </button>
          </div>
          
          {/* Pending Feedbacks Tab */}
          {activeTab === 'pending' && (
            <div>
              {pendingServices.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">Bạn không có dịch vụ nào cần đánh giá.</p>
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
                        <h3 className="font-semibold text-lg">{service.serviceName}</h3>
                        <p className="text-gray-500 text-sm mb-2">Ngày đặt: {new Date().toLocaleDateString('vi-VN')}</p>
                        <p className="text-gray-500 text-sm">Chuyên viên: Đang cập nhật</p>
                      </div>
                      <button
                        onClick={() => handleFeedbackClick(service)}
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
          {activeTab === 'completed' && (
            <div>
              {completedFeedbacks.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">Bạn chưa có đánh giá nào.</p>
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
                          <h3 className="font-semibold">{feedback.serviceName}</h3>
                          <p className="text-gray-500 text-sm">Ngày đánh giá: {new Date(feedback.bookingDate).toLocaleDateString('vi-VN')}</p>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-yellow-400">
                                {i < feedback.rating ? <FaStar /> : <FaRegStar />}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="ml-auto">
                          <button
                            onClick={() => handleEditFeedback(feedback)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                          >
                            Sửa
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-700 mt-2">{feedback.feedbackText}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Feedback Modal */}
      {isModalOpen && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg p-6">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? 'Chỉnh sửa đánh giá' : 'Đánh giá dịch vụ'}
            </h2>
            <div className="mb-4">
              <p className="font-medium">{selectedService.serviceName}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Đánh giá của bạn</label>
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
              <label className="block text-gray-700 mb-2">Nhận xét</label>
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
                onClick={handleSubmitFeedback}
                className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition"
              >
                {isEditing ? 'Cập nhật' : 'Gửi đánh giá'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;