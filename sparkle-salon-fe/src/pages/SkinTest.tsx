import React, { useCallback } from "react";
import QuizInterface from "../components/QuizInterface";
import { useQuiz } from "../components/useQuiz"; // Import custom hook
import QuizResult from "../components/QuizResult"; // Import component kết quả
import { useNavigate } from 'react-router-dom';

export default function KiemTraDa() {
  const { state, handleSelectQuiz, handleStartQuiz, handleBack, handleQuizComplete } = useQuiz();
const Navigate = useNavigate();
  const handleNavigate = useCallback(() => {
    Navigate('/new-page');
  }, [Navigate]);

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

      {!state.isQuizStarted && !state.showResults && (
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

      {state.isQuizStarted && !state.showResults && state.selectedQuiz && (
        <QuizInterface
          quiz={state.selectedQuiz}
          onComplete={handleQuizComplete}
          onBack={handleBack}
        />
      )}

      {state.showResults && (
        <QuizResult
          result={state.result}
          error={state.error}
          fetchingResult={state.fetchingResult}
          onLink={handleNavigate}
          onBack={handleBack}
        />
      )}
    </div>
  );
}