import { useState, useEffect, useCallback } from "react";
import axios, { AxiosError } from "axios";
import quizData, { Quiz } from "../data/quizData";

// Định nghĩa các hằng số
const API_BASE_URL = "http://localhost:8080/swp";

// Interface cho state
interface QuizState {
  quizzes: Quiz[];
  selectedQuiz: Quiz | null;
  showResults: boolean;
  loading: boolean;
  answers: { [key: number]: number };
  isQuizStarted: boolean;
  result: string;
  quizResultId: number | null; // Thêm quizResultId
  error: string | null;
  fetchingResult: boolean;
}

// Initial state
const initialState: QuizState = {
  quizzes: [],
  selectedQuiz: null,
  showResults: false,
  loading: true,
  answers: {},
  isQuizStarted: false,
  result: "",
  quizResultId: null, // Khởi tạo quizResultId
  error: null,
  fetchingResult: false,
};

// Hàm tiện ích xử lý lỗi API
const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; code?: number }>;
    if (axiosError.response) {
      const { status, data } = axiosError.response;
      if (status === 404) return "Không tìm thấy endpoint. Vui lòng kiểm tra cấu hình server.";
      if (data?.code === 1029) return "Không tìm thấy kết quả. Vui lòng kiểm tra lại câu trả lời.";
      return data?.message || "Có lỗi xảy ra khi xử lý kết quả. Vui lòng thử lại sau.";
    }
    if (axiosError.request) return "Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng.";
  }
  console.error("Lỗi không xác định:", error);
  return "Có lỗi xảy ra. Vui lòng thử lại sau.";
};

export const useQuiz = () => {
  const [state, setState] = useState<QuizState>(initialState);

  // Tải dữ liệu quiz từ API hoặc mock data
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await quizData();
        setState((prev) => ({
          ...prev,
          quizzes: Array.isArray(data) ? data : [],
          loading: false,
          error: null,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: "Không thể tải dữ liệu bài kiểm tra. Vui lòng thử lại sau.",
          quizzes: [],
          loading: false,
        }));
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };
    fetchQuizzes();
  }, []);

  // Chọn một bài quiz
  const handleSelectQuiz = useCallback((quiz: Quiz) => {
    setState((prev) => ({ ...prev, selectedQuiz: quiz }));
  }, []);

  // Bắt đầu bài kiểm tra
  const handleStartQuiz = useCallback(() => {
    if (state.selectedQuiz) {
      setState((prev) => ({
        ...prev,
        isQuizStarted: true,
        showResults: false,
        result: "",
        quizResultId: null, // Reset quizResultId khi bắt đầu
        error: null,
        answers: {},
      }));
    }
  }, [state.selectedQuiz]);

  // Quay lại màn hình chọn bài kiểm tra
  const handleBack = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isQuizStarted: false,
      selectedQuiz: null,
      answers: {},
      showResults: false,
      result: "",
      quizResultId: null, // Reset quizResultId khi quay lại
      error: null,
    }));
  }, []);

  // Gửi kết quả lên server và lấy phản hồi
  const fetchResultFromBackend = useCallback(
    async (total: number, quizId: number) => {
      try {
        setState((prev) => ({ ...prev, fetchingResult: true }));
        const response = await axios.post(`${API_BASE_URL}/quiz/result`, {
          quizId,
          score: total,
        });

        if (response.data.code !== 0) {
          throw new Error(response.data.message || "Lỗi không xác định từ server");
        }

        const quizResultId = response.data.result?.id; // Lấy quizResultId từ response

        setState((prev) => ({
          ...prev,
          result: response.data.result?.resultText || "Kết quả đã được xử lý thành công!",
          quizResultId: quizResultId || null, // Lưu quizResultId vào state
          error: null,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: handleApiError(error),
        }));
      } finally {
        setState((prev) => ({ ...prev, fetchingResult: false }));
      }
    },
    []
  );

  // Hoàn thành bài kiểm tra
  const handleQuizComplete = useCallback(
    (quizAnswers: { [key: number]: number }) => {
      if (!state.selectedQuiz) return;

      const total = Object.values(quizAnswers).reduce((sum, value) => sum + value, 0);
      setState((prev) => ({
        ...prev,
        answers: quizAnswers,
        showResults: true,
        error: null,
      }));

      fetchResultFromBackend(total, state.selectedQuiz.id);
    },
    [state.selectedQuiz, fetchResultFromBackend]
  );

  return {
    state,
    handleSelectQuiz,
    handleStartQuiz,
    handleBack,
    handleQuizComplete,
  };
};