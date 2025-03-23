import React, { useCallback, useEffect, useState } from "react";
import QuizInterface from "../components/QuizInterface";
import { useQuiz } from "../components/useQuiz";
import { Blog, getDefaultByQuizResult } from "../data/blogData";
import { useNavigate } from "react-router-dom";

export default function KiemTraDa() {
  const {
    state,
    handleSelectQuiz,
    handleStartQuiz,
    handleBack,
    handleQuizComplete,
  } = useQuiz();
  const [foundBlog, setFoundBlog] = useState<Blog | null>(null);
  const [showBlogDetail, setShowBlogDetail] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        if (state.result && state.quizResultId !== null) {
          const data = await getDefaultByQuizResult(state.quizResultId);
          setFoundBlog(data || null);
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };
    fetchBlog();
  }, [state.result, state.quizResultId]);

  const handleShowBlogDetail = useCallback(() => {
    if (foundBlog) {
      setShowBlogDetail(true);
    } else {
      alert("Không tìm thấy blog phù hợp với kết quả");
    }
  }, [foundBlog]);

  if (state.loading) {
    return <div className="pt-16 text-center">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="bg-gradient-to-t from-white to-pink-200 min-h-screen">
      <div className="relative w-full h-[200px] flex flex-col justify-center items-center bg-[url('/assets/sparkle-salon-title.jpg')] bg-cover bg-center bg-no-repeat mt-16">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <h1 className="mt-10 relative z-10 text-white text-7xl font-serif mb-2">
          Skin Test
        </h1>
        <p className="relative z-10 text-white text-xl">
          Discover our beauty treatments
        </p>
      </div>

      {/* Chọn quiz */}
      {!state.isQuizStarted && !state.showResults && (
        <div className="flex flex-col items-center mt-6 px-4">
          <h1 className="py-8 text-4xl font-bold text-center">
            Chọn Bộ Câu Hỏi
          </h1>
          <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            {state.quizzes.length > 0 ? (
              state.quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  onClick={() => handleSelectQuiz(quiz)}
                  className={`cursor-pointer group relative overflow-hidden rounded-2xl transition-all duration-300 ${
                    state.selectedQuiz?.id === quiz.id
                      ? "ring-4 ring-blue-500 shadow-xl scale-105"
                      : "hover:shadow-xl hover:scale-105"
                  }`}
                >
                  <div
                    className={`bg-white p-6 border-2 h-full transition-colors ${
                      state.selectedQuiz?.id === quiz.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 group-hover:border-blue-300 group-hover:bg-gray-50"
                    }`}
                  >
                    <h3 className="text-2xl font-semibold mb-3">{quiz.name}</h3>
                    <p>{quiz.questions.length} câu hỏi</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center text-gray-500 py-8">
                Không có bộ câu hỏi nào.
              </div>
            )}
          </div>
          {state.selectedQuiz && (
            <button
              onClick={handleStartQuiz}
              className="mt-8 px-8 py-4 text-lg font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-lg transition"
            >
              Bắt Đầu Kiểm Tra
            </button>
          )}
        </div>
      )}

      {/* Giao diện quiz */}
      {state.isQuizStarted && !state.showResults && state.selectedQuiz && (
        <QuizInterface
          quiz={state.selectedQuiz}
          onComplete={handleQuizComplete}
          onBack={handleBack}
        />
      )}

      {/* Kết quả quiz và nút hiển thị chi tiết blog */}
      {state.showResults && (
        <div className="p-8 max-w-3xl mx-auto bg-white rounded-2xl shadow-lg mt-10 space-y-6">
          {/* Phần kết quả quiz */}
          <div className="text-center mb-6">
            <p className="text-4xl font-bold text-blue-600">
              Điểm số của bạn: {state.score}
            </p>
          </div>
          <h2 className="text-3xl font-bold text-center">Kết Quả Kiểm Tra</h2>
          <p className="text-lg text-center">{state.result || "Không có kết quả để hiển thị"}</p>


          {/* Nút "Chi tiết về da của bạn" - chỉ hiển thị khi chưa show blog */}
          {!showBlogDetail && (
            <button
              onClick={handleShowBlogDetail}
              className="w-full mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Chi tiết về da của bạn
            </button>
          )}

          {/* Phần chi tiết blog (chỉ hiển thị khi showBlogDetail là true) */}
          {showBlogDetail && foundBlog ? (
            <>
              
              <article className="bg-white rounded-lg p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                  {foundBlog.title}
                </h1>
                <img
                  src={foundBlog.img || "/placeholder.jpg"}
                  alt={`Hình ảnh minh họa cho ${foundBlog.title}`}
                  className="w-full h-64 object-cover rounded-md my-4"
                />
                <div className="prose prose-lg text-gray-700">
                  <p
                    className="mt-6 text-lg text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: foundBlog.content }}
                  ></p>
                </div>
              </article>

              {/* Dịch vụ gợi ý */}
              {state.services != null && state.services.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                    Dịch vụ gợi ý cho bạn
                  </h3>
                  <div className="flex flex-row flex-wrap gap-6 justify-center">
                    {state.services.map((service) => (
                      <div
                        key={service.id}
                        className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-xl"
                        style={{
                          minWidth: `${Math.min(
                            100 / Math.min(state.services.length, 4),
                            25
                          )}%`,
                        }}
                      >
                        <img
                          src={service.img || "/placeholder.jpg"}
                          alt={`Hình ảnh của ${service.name}`}
                          className="w-32 h-32 object-cover rounded-full mb-3 cursor-pointer"
                          onClick={() => navigate(`/service/${service.id}`)}
                        />
                        <h4 className="text-sm font-semibold text-gray-800 text-center">
                          {service.name}
                        </h4>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : showBlogDetail && !foundBlog ? (
            <p className="text-center text-gray-500 mt-6">
              Không tìm thấy blog phù hợp với kết quả của bạn.
            </p>
          ) : null}

          {/* Nút quay lại */}
          <button
            onClick={handleBack}
            className="w-full bg-gray-600 text-white py-3 text-lg font-semibold rounded-xl hover:bg-gray-700 transition mt-6"
          >
            Quay Lại
          </button>
        </div>
      )}
    </div>
  );
}