import React, { useCallback, useEffect, useState } from "react";
import QuizInterface from "../components/QuizInterface";
import { useQuiz } from "../components/useQuiz";
import QuizResult from "../components/QuizResult";
import { Blog, getDefaultByquizresult } from "../data/blogData";

export default function KiemTraDa() {
  const { state, handleSelectQuiz, handleStartQuiz, handleBack, handleQuizComplete } = useQuiz();
  const [foundBlog, setFoundBlog] = useState<Blog | null>(null);
  const [showBlogDetail, setShowBlogDetail] = useState(false); // Trạng thái hiển thị chi tiết blog

  // Tìm blog dựa trên state.result
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        if (state.result && state.quizResultId !== null) {
          const data = await getDefaultByquizresult(state.quizResultId);
          setFoundBlog(data || null);
          console.log(state.quizResultId );

        } else {
          console.log("Quiz Result ID is null or state.result is falsy,  fetch data",state.quizResultId );
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };
  
    fetchBlog();
  }, [state.result, state.quizResultId]);
  

  // Xử lý khi nhấp OK: Hiển thị chi tiết blog
  const handleNavigate = useCallback(() => {
    if (foundBlog) {
      setShowBlogDetail(true); // Hiển thị chi tiết blog
    } else {
      alert("Không tìm thấy blog phù hợp với kết quả");
    }
  }, [foundBlog]);

  // Quay lại từ chi tiết blog hoặc reset quiz
  const handleBackFromBlog = () => {
    setShowBlogDetail(false);
  };

  if (state.loading) {
    return <div className="pt-16 text-center">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="pt-16 flex flex-col min-h-screen bg-gray-50">
      <div className="h-72 flex items-center justify-center bg-[url('/assets/skin-title.jpg')] bg-cover bg-no-repeat">
        <div className="text-start text-white">
          <h1 className="text-7xl font-serif leading-tight">Kiểm Tra Da</h1>
        </div>
      </div>

      {/* Chọn quiz */}
      {!state.isQuizStarted && !state.showResults && !showBlogDetail && (
        <div className="flex flex-col items-center mt-6 px-4">
          <h1 className="py-8 text-4xl font-bold text-center">Chọn Bộ Câu Hỏi</h1>
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
      {state.isQuizStarted && !state.showResults && !showBlogDetail && state.selectedQuiz && (
        <QuizInterface
          quiz={state.selectedQuiz}
          onComplete={handleQuizComplete}
          onBack={handleBack}
        />
      )}

      {/* Kết quả quiz */}
      {state.showResults && !showBlogDetail && (
        <QuizResult
          result={state.result}
          error={state.error}
          fetchingResult={state.fetchingResult}
          onLink={handleNavigate}
          onBack={handleBack}
        />
      )}

      {/* Hiển thị chi tiết blog */}
      {showBlogDetail && foundBlog && (
        <div className="p-8 max-w-3xl mx-auto bg-white rounded-2xl shadow-lg space-y-6 mt-10">
          <h2 className="text-3xl font-bold text-center">Kết quả về da của bạn</h2>
          <article className="bg-white rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">{foundBlog.title}</h1>
            <img
              src={foundBlog.img || "/placeholder.jpg"}
              alt={`Hình ảnh minh họa cho ${foundBlog.title}`}
              className="w-full h-64 object-cover rounded-md my-4"
            />
            <div className="prose prose-lg text-gray-700">
              <p>{foundBlog.content}</p>
            </div>
           
          </article>
          <button
            onClick={handleBackFromBlog}
            className="w-full bg-gray-600 text-white py-3 text-lg font-semibold rounded-xl hover:bg-gray-700 transition"
          >
            Quay Lại
          </button>
        </div>
      )}
    </div>
  );
}