import React, { useCallback, useEffect, useState, useContext } from "react";
import QuizInterface from "../components/QuizInterface";
import { useQuiz } from "../components/useQuiz";
import { Blog, getDefaultByQuizResult } from "../data/blogData";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";
import { getUser } from "../data/authData";
import { QuizResultModal } from "../components/QuizResultModal";

export interface User {
  id: string;
  skinTypeId: number; // Optional since it might not always be present
}

export default function KiemTraDa() {
  const {
    state,
    maxScore,
    handleResultSkin,
    handleSelectQuiz,
    handleStartQuiz,
    handleBack,
    handleQuizComplete,
  } = useQuiz();

  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [foundBlog, setFoundBlog] = useState<Blog | null>(null);
  const [showBlogDetail, setShowBlogDetail] = useState(false);
  const [showSkintestAgain, setShowSkintestAgain] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userInforelod, setUserInforelod] = useState(false);

  const navigate = useNavigate();
  const { setIsLoginOpen, user } = useContext(UserContext);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const userData = await getUser();
        setUserInfo(userData || null);
        
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Không thể tải thông tin người dùng");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUser();

  }, [userInforelod]);

  // Fetch blog based on quiz result
  useEffect(() => {
    const fetchBlog = async () => {
      if (!state.result || state.quizResultId === null) return;
      setIsLoading(true);
      try {
        const data = await getDefaultByQuizResult(state.quizResultId);
        setFoundBlog(data || null);
      } catch (error) {
        console.error("Error fetching blog:", error);
        toast.error("Không thể tải blog");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlog();
  }, [state.result, state.quizResultId]);

  // View quiz result based on skin type ID
  const handleQuizResultById = () => {
    if (userInfo.skinTypeId) {
      setShowSkintestAgain(true);
      console.log(userInfo.skinTypeId);
    } else {
      toast.error("Bạn chưa làm bài kiểm tra da");
    }
  };

  const handleShowBlogDetail = useCallback(() => {
    if (foundBlog) {
      setShowBlogDetail(true);
      const userId = userInfo?.id ?? null;
      handleResultSkin(userId, state.quizResultId);
      
    } else {
      toast.error("Không tìm thấy blog phù hợp với kết quả");
    }
  }, [foundBlog, userInfo, state.quizResultId, handleResultSkin]);

  const closeViewModal = () => {
    setShowSkintestAgain(false);
    setIsLoading(false);
  };
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white">
        <div className="text-pink-600 text-xl">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-pink-50 to-white min-h-screen font-sans mt-16">
      {/* Header */}
      <div
        className="relative w-full h-64 flex flex-col justify-center items-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/sparkle-salon-title.jpg')" }}
      >
        <div className="absolute inset-0 bg-pink-900/40 backdrop-blur-sm" />
        <h1 className="relative z-10 text-white text-5xl md:text-6xl font-serif mb-2 drop-shadow-lg">
          Kiểm Tra Da
        </h1>
        <p className="relative z-10 text-white text-lg md:text-xl drop-shadow font-light">
          Khám phá liệu trình chăm sóc phù hợp với bạn
        </p>
      </div>

      {/* Quiz Selection */}
      {!state.isQuizStarted && !state.showResults && (
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
          {user&& user.auth&& (
          <button
            onClick={handleQuizResultById}
            className="absolute left-10 px-3 py-2 bg-pink-600 text-white rounded-xl hover:bg-pink-800 transition font-semibold shadow-md "
          >
            Xem Lại Kết Quả
          </button>
)}

          <div className="relative max-w-6xl mx-auto py-12 px-4 sm:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-pink-800 text-center">
              Chọn Bộ Câu Hỏi
            </h2>
          </div>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {state.quizzes.length > 0 ? (
              state.quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  onClick={() => handleSelectQuiz(quiz)}
                  className={`cursor-pointer group rounded-2xl transition-all duration-300 ${
                    state.selectedQuiz?.id === quiz.id
                      ? "ring-4 ring-pink-500 shadow-xl scale-105"
                      : "hover:shadow-xl hover:scale-102"
                  }`}
                >
                  <div
                    className={`h-full p-8 rounded-2xl transition-colors duration-300 ${
                      state.selectedQuiz?.id === quiz.id
                        ? "bg-gradient-to-br from-pink-100 to-pink-50 border-pink-300"
                        : "bg-white border border-gray-200 group-hover:bg-pink-50"
                    }`}
                  >
                    <h3 className="text-2xl font-semibold mb-3 text-gray-800">
                      {quiz.name}
                    </h3>
                    <div className="flex items-center">
                      <span className="text-pink-600 mr-2">
                        {quiz.questions.length} câu hỏi
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="ml-2 text-gray-600">
                        ~{quiz.questions.length * 2} phút
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center text-gray-500 py-16 bg-white rounded-xl border border-gray-200">
                <p className="text-xl">Hiện tại không có bộ câu hỏi nào.</p>
                <p className="mt-2">Vui lòng quay lại sau.</p>
              </div>
            )}
          </div>
          {state.selectedQuiz && (
            <div className="flex justify-center mt-10">
              <button
                onClick={handleStartQuiz}
                className="px-8 py-4 text-lg font-medium rounded-full bg-pink-600 text-white hover:bg-pink-700 shadow-lg hover:shadow-pink-200 transition-all duration-300"
              >
                Bắt Đầu Kiểm Tra
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quiz Result Modal */}
      {showSkintestAgain && (
        <QuizResultModal
          quizResult={userInfo?.skinTypeId }
          onClose={closeViewModal}
        />
      )}

      {/* Quiz Interface */}
      {state.isQuizStarted && !state.showResults && state.selectedQuiz && (
        <QuizInterface
          quiz={state.selectedQuiz}
          onComplete={handleQuizComplete}
          onBack={handleBack}
        />
      )}

      {/* Results */}
      {state.showResults && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-8 text-center">
              <h2 className="text-3xl font-bold mb-2">Kết Quả Kiểm Tra</h2>
              <div className="inline-flex items-center justify-center bg-white/20 px-6 py-2 rounded-full">
                <span className="font-semibold">Điểm số của bạn:</span>
                <span className="ml-2 text-2xl font-bold">
                  {state.score}/{maxScore()}
                </span>
              </div>
            </div>
            <div className="p-8">
              <div className="bg-pink-50 rounded-2xl p-6 mb-8">
                <h3 className="text-xl font-semibold text-pink-800 mb-3">
                  Phân Tích Da
                </h3>
                <p className="text-gray-700">
                  {state.result || "Không có kết quả để hiển thị"}
                </p>
              </div>

              {!showBlogDetail && user?.auth && (
                <button
                  onClick={handleShowBlogDetail}
                  className="w-full py-4 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition font-semibold shadow-md hover:shadow-lg"
                >
                  Xem Chi Tiết Về Da Của Bạn
                </button>
              )}

              {!showBlogDetail && !user?.auth && (
                <div className="text-center bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <p className="text-gray-700 mb-4">
                    Để xem phân tích chi tiết và nhận tư vấn cá nhân hóa
                  </p>
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition font-medium"
                  >
                    Đăng Nhập Ngay
                  </button>
                </div>
              )}

              {showBlogDetail && foundBlog && (
                <div className="mt-8">
                  <article className="prose prose-pink max-w-none">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                      {foundBlog.title}
                    </h1>
                    <img
                      src={foundBlog.img }
                      alt={foundBlog.title}
                      className="w-full h-72 object-cover rounded-xl my-6"
                     
                    />
                    <div
                      className="mt-6 text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: foundBlog.content }}
                    />
                  </article>

                  {state.services?.length > 0 && (
                    <div className="mt-12">
                      <h3 className="text-2xl font-bold text-center text-pink-800 mb-8">
                        Dịch Vụ Gợi Ý Cho Bạn
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {state.services.map((service) => (
                          <div
                            key={service.id}
                            onClick={() => navigate(`/service/${service.id}`)}
                            className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-100"
                          >
                            <div className="h-40 overflow-hidden">
                              <img
                                src={service.img }
                                alt={service.name}
                                className="w-full h-full object-cover"
                                
                                
                              />
                            </div>
                            <div className="p-4">
                              <h4 className="font-medium text-gray-800 text-center">
                                {service.name}
                              </h4>
                              <div className="mt-2 flex justify-center">
                                <span className="px-3 py-1 bg-pink-100 text-pink-800 text-xs rounded-full">
                                  Xem Chi Tiết
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {showBlogDetail && !foundBlog && (
                <div className="text-center text-gray-500 mt-6 p-8 bg-gray-50 rounded-xl">
                  <p className="mb-2">
                    Không tìm thấy blog phù hợp với kết quả của bạn.
                  </p>
                  <p>
                    Vui lòng thử bộ câu hỏi khác hoặc liên hệ chuyên gia của
                    chúng tôi.
                  </p>
                </div>
              )}

              <button
                onClick= {() =>{ handleBack();
                  setShowBlogDetail(false);
                  setShowSkintestAgain(false);
                  setUserInforelod(!userInforelod);
                }
                }
                className="w-full mt-8 py-4 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition font-semibold"
              >
                Quay Lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
