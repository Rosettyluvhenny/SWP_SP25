import { useState, useEffect } from "react";
import quizData, { Quiz } from "../data/quizData";
import QuizInterface from "../components/QuizInterface";
import axios from "axios";

// Interface cho state
interface QuizState {
  quizzes: Quiz[];
  selectedQuiz: string;
  showResults: boolean;
  loading: boolean;
  answers: { [key: number]: number };
  isQuizStarted: boolean;
  result: string;
  error: string | null;
}

// Initial state
const initialState: QuizState = {
  quizzes: [],
  selectedQuiz: "",
  showResults: false,
  loading: true,
  answers: {},
  isQuizStarted: false,
  result: "",
  error: null
};

export default function KiemTraDa() {
  const [state, setState] = useState<QuizState>(initialState);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await quizData();
        setState((prev) => ({
          ...prev,
          quizzes: Array.isArray(data) ? data : [],
          error: null
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: "Không thể tải dữ liệu bài kiểm tra. Vui lòng thử lại sau.",
          quizzes: []
        }));
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    };
    fetchQuizzes();
  }, []);

  const handleStartQuiz = () => {
    if (state.selectedQuiz) {
      setState((prev) => ({
        ...prev,
        isQuizStarted: true,
        showResults: false,
        result: "",
        error: null
      }));
    }
  };

  const handleBack = () => {
    setState((prev) => ({
      ...prev,
      isQuizStarted: false,
      selectedQuiz: "",
      answers: {},
      showResults: false,
      result: "",
      error: null
    }));
  };

  const fetchResultFromBackend = async (total: number, quizId: number) => {
    try {
      console.log("Gửi yêu cầu tới:", "/swp/quiz/result");
      console.log("Dữ liệu gửi:", { totalPoints: total, quizId });
      const response = await axios.post("/swp/quiz/result", {
        totalPoints: total,
        quizId
      });
      console.log("Phản hồi từ server:", response.data);
      // ...
    } catch (error) {
      console.error("Lỗi chi tiết:", error.response);
      // ...
    }
  };
  const calculateTotalPoints = () => {
    return Object.values(state.answers).reduce((sum, value) => sum + value, 0);
  };

  const handleQuizComplete = (quizAnswers: { [key: number]: number }) => {
    const total = Object.values(quizAnswers).reduce((sum, value) => sum + value, 0);
    const quiz = state.quizzes.find((q) => q.name === state.selectedQuiz);
    
    if (!quiz) {
      setState(prev => ({
        ...prev,
        error: "Không tìm thấy thông tin bài kiểm tra",
        loading: false
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      answers: quizAnswers,
      showResults: true,
      error: null
    }));

    fetchResultFromBackend(total, quiz.id);
  };

  const handlePrint = () => {
    window.print();
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

      {!state.isQuizStarted && !state.showResults && (
        <div className="flex flex-col items-center mt-6 px-4">
          <h1 className="py-8 text-4xl font-bold text-center">Chọn Bộ Câu Hỏi</h1>
          <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            {state.quizzes.length > 0 ? (
              state.quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  onClick={() => setState((prev) => ({ ...prev, selectedQuiz: quiz.name }))}
                  className={`cursor-pointer group relative overflow-hidden rounded-2xl transition-all duration-300 ${
                    state.selectedQuiz === quiz.name
                      ? "ring-4 ring-blue-500 shadow-xl scale-105"
                      : "hover:shadow-xl hover:scale-105"
                  }`}
                >
                  <div className={`bg-white p-6 border-2 h-full transition-colors ${state.selectedQuiz === quiz.name ? "border-blue-500 bg-blue-50" : "border-gray-200 group-hover:border-blue-300 group-hover:bg-gray-50"}`}>
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
            <button onClick={handleStartQuiz} className="mt-8 px-8 py-4 text-lg font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-lg transition">
              Bắt Đầu Kiểm Tra
            </button>
          )}
        </div>
      )}

      {state.isQuizStarted && !state.showResults && (
        <QuizInterface
          quiz={state.quizzes.find((q) => q.name === state.selectedQuiz)!}
          onComplete={handleQuizComplete}
          onBack={handleBack}
        />
      )}

      {state.showResults && (
        <div className="p-8 max-w-3xl mx-auto bg-white rounded-2xl shadow-lg space-y-6 mt-10">
          <h2 className="text-3xl font-bold text-center">Kết Quả Kiểm Tra</h2>
          <p className="text-xl font-semibold text-center">Tổng điểm: {calculateTotalPoints()}</p>
          <p className="text-lg text-center">{state.result || "Đang tải kết quả..."}</p>
          <button onClick={handlePrint} className="w-full bg-green-600 text-white py-3 text-lg font-semibold rounded-xl hover:bg-green-700 transition">
            In Kết Quả
          </button>
          <button onClick={handleBack} className="w-full bg-gray-600 text-white py-3 text-lg font-semibold rounded-xl hover:bg-gray-700 transition">
            Làm Lại Bài Kiểm Tra
          </button>
        </div>
      )}
    </div>
  );
}
