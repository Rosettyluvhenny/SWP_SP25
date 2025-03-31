import { useState, useEffect, useCallback } from "react";
import axios, { AxiosError } from "axios";

// Định nghĩa các interface
export interface Answer {
  id: number;
  text: string;
  point: number;
}

export interface Question {
  id: number;
  text: string;
  type: string;
  answers: Answer[];
}

export interface Quiz {
  id: number;
  name: string;
  categoryId: number;
  categoryName: string;
  questions: Question[];
}

export interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
  session: number;
  img: string;
  description: string;
}

interface QuizResult {
  id: number;
  resultText: string;
  minPoint: number;
  maxPoint: number;
  quizId: number;
  quizName: string;
  services: Service[];
}

interface ApiResponse<T> {
  code: number;
  result: T;
  message?: string;
}

// Cấu hình Axios instance
const API_BASE_URL = "http://localhost:8080/swp";
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Thêm interceptor để xử lý token
axiosInstance.interceptors.request.use(
  (config) => {
    // Chỉ thêm token nếu không phải phương thức GET
    if (config.method !== "get") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      console.log("Token added for non-GET request:", token);
    } else {
      console.log("No token added for GET request");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interface cho state
interface QuizState {
  quizzes: Quiz[];
  selectedQuiz: Quiz | null;
  showResults: boolean;
  loading: boolean;
  answers: { [key: number]: number };
  isQuizStarted: boolean;
  result: string;
  quizResultId: number | null;
  services: Service[] | null;
  error: string | null;
  fetchingResult: boolean;
  score: number | null; // Thêm trường này
}

const initialState: QuizState = {
  quizzes: [],
  selectedQuiz: null,
  showResults: false,
  loading: true,
  answers: {},
  isQuizStarted: false,
  result: "",
  quizResultId: null,
  services: null,
  error: null,
  fetchingResult: false,
  score: null, // Khởi tạo score
};

// Hàm xử lý lỗi API
const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse<unknown>>;
    if (axiosError.response) {
      const { status, data } = axiosError.response;
      if (status === 404) return "Không tìm thấy endpoint. Vui lòng kiểm tra cấu hình server.";
      if (status === 401) return "Không có quyền truy cập. Vui lòng đăng nhập lại.";
      if (data?.code === 1029) return "Không tìm thấy kết quả. Vui lòng kiểm tra lại câu trả lời.";
      return data?.message || "Có lỗi xảy ra khi xử lý kết quả. Vui lòng thử lại sau.";
    }
    return "Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng.";
  }
  console.error("Lỗi không xác định:", error);
  return "Có lỗi xảy ra. Vui lòng thử lại sau.";
};

// Hàm lấy danh sách quizzes từ API (thay thế quizData mock)
const fetchQuizzesFromApi = async (): Promise<Quiz[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Quiz[]>>("/quiz");
    if (response.data.code !== 0) {
      throw new Error(response.data.message || "Failed to fetch quizzes");
    }
    return response.data.result || [];
  } catch (error) {
    throw handleApiError(error);
  }
};

// Hook useQuiz
export const useQuiz = () => {
  const [state, setState] = useState<QuizState>(initialState);

  // Tải dữ liệu quizzes từ API
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await fetchQuizzesFromApi();
        setState((prev) => ({
          ...prev,
          quizzes: Array.isArray(data) ? data : [],
          loading: false,
          error: null,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : "Không thể tải dữ liệu bài kiểm tra.",
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
        quizResultId: null,
        services: null,
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
      quizResultId: null,
      services: null,
      error: null,
    }));
  }, []);

  // Gửi kết quả lên server và lấy phản hồi
  const fetchResultFromBackend = useCallback(
    async (total: number, quizId: number) => {
      try {
        setState((prev) => ({ ...prev, fetchingResult: true }));
        const response = await axiosInstance.post<ApiResponse<QuizResult>>(
          "/quiz/result",
          {
            quizId,
            score: total,
          }
        );

        if (response.data.code !== 0) {
          throw new Error(response.data.message || "Lỗi không xác định từ server");
        }

        const { result } = response.data;
        setState((prev) => ({
          ...prev,
          result: result?.resultText || "Kết quả đã được xử lý thành công!",
          quizResultId: result?.id || null,
          services: result?.services || null,
          error: null,
          fetchingResult: false,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: handleApiError(error),
          fetchingResult: false,
        }));
      }
    },
    []
  );

  // Hoàn thành bài kiểm tra
  const handleQuizComplete = useCallback(
    (quizAnswers: { [key: number]: number }) => {
      if (!state.selectedQuiz) {
        setState((prev) => ({ ...prev, error: "Không có bài kiểm tra nào được chọn." }));
        return;
      }
  
      const total = Object.values(quizAnswers).reduce((sum, value) => sum + value, 0);
      setState((prev) => ({
        ...prev,
        answers: quizAnswers,
        showResults: true,
        score: total, // Lưu điểm số
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