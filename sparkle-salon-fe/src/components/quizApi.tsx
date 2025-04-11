import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:8080/swp";
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 600, // Thêm timeout để tránh treo request
});
// const axiosInstance = instance;

// Interceptor để thêm token vào mọi request trừ GET
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



// Các interface giữ nguyên
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
  status: boolean;
  questions: Question[];
}

export interface Service {
  id: number;
  name: string;
}

export interface QuizResult {
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

// Hàm xử lý lỗi API
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse<unknown>>;
    if (axiosError.response) {
      const { status, data } = axiosError.response;
      console.log("API Error:", { status, data });
      if (data && "message" in data) return data.message || "Có lỗi xảy ra.";
      if (status === 401) return "Không có quyền truy cập. Vui lòng đăng nhập lại.";
      if (status === 400) return "Yêu cầu không hợp lệ.";
      return "Lỗi không xác định.";
    }
    return "Không thể kết nối tới máy chủ.";
  }
  console.error("Unexpected Error:", error);
  return "Lỗi không mong muốn.";
};



// Các hàm API
export const fetchQuizzes = async (): Promise<Quiz[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Quiz[]>>("/quiz");
    if (response.data.code !== 0)
      throw new Error(response.data.message || "Failed to fetch quizzes");
    return response.data.result || [];
  } catch (error) {
    throw handleApiError(error);
  }
};



export const fetchQuizResults = async (): Promise<QuizResult[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<QuizResult[]>>("/quizResult");
    if (response.data.code !== 0)
      throw new Error(response.data.message || "Failed to fetch quiz results");
    return response.data.result || [];
  } catch (error) {
    throw handleApiError(error);
  }
};



export const fetchServices = async (
  page: number = 0,
  size: number = 10
): Promise<Service[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<{ content: Service[] }>>(
      `/services?page=${page}&size=${size}`
    );
    console.log(
      `Response từ /services (Trang ${page + 1}, Kích thước ${size}):`,
      response.data
    );
    if (response.data.code !== 0) {
      throw new Error(response.data.message || "Không thể lấy danh sách dịch vụ");
    }
    return response.data.result.content || [];
  } catch (error) {
    console.error("Lỗi khi gọi /services:", error);
    throw handleApiError(error);
  }
};

export const createNewQuestion = async (
  quiz: Quiz,
  question: Question
): Promise<Question> => {
  try {
    const response = await axiosInstance.post<ApiResponse<Question>>(
      `/question`,
      {
        quizId: quiz.id,
        text: question.text,
        type: question.type || "multiple-choice",
      }
    );
    if (response.data.code !== 0)
      throw new Error(response.data.message || "Failed to create question");
    return response.data.result;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateQuestionText = async (
  quiz: Quiz,
  updatedQuestion: Question
): Promise<Question> => {
  try {
    const response = await axiosInstance.put<ApiResponse<Question>>(
      `/question/${updatedQuestion.id}`,
      {
        quizId: quiz.id,
        text: updatedQuestion.text,
        type: updatedQuestion.type || "multiple-choice",
      }
    );
    if (response.data.code !== 0)
      throw new Error(response.data.message || "Failed to update question");
    return response.data.result;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateAnswers = async (
  question: Question,
  answers: Answer[]
): Promise<Answer[]> => {
   
  try {
    const newAnswerIds = new Set<number>(
      (answers || []).map((a) => a.id).filter((id): id is number => id != null)
    );

   

    const answerPromises = answers.map((answer) => {
      const data = {
        questionId: question.id,
        text: answer.text,
        point: answer.point,
      };
      return answer.id && answer.id < 10000
        ? axiosInstance.put<ApiResponse<Answer>>(`/answer/${answer.id}`, data)
        : axiosInstance.post<ApiResponse<Answer>>(`/answer`, data).then((response) => {
            answer.id = response.data.result.id;
            return response;
          });
    });

    const answerResponses = await Promise.all(answerPromises);
    return answerResponses.map((res) => res.data.result);
  } catch (error) {
    console.error("Lỗi cập nhật đáp án:", error);
    throw handleApiError(error);
  }
};

export const deleteAnswer = async (answerId: number) => {


  try {
    const response = await axiosInstance.delete(`/answer/${answerId}`);
    if (response.data.code !== 0)
      throw new Error(response.data.message || "Failed to delete answer");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa đáp án:", error);
    throw handleApiError(error);
  }
};

export const deleteQuestion = async (questionId: number) => {
  try {
    const response = await axiosInstance.delete(`/question/${questionId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa câu hỏi:", error);
    throw handleApiError(error);
  }
};

export const deleteQuizResult = async (resultId: number) => {
  try {
    const response = await axiosInstance.delete(`/quizResult/${resultId}`);
    if (response.data.code !== 0)
      throw new Error(response.data.message || "Failed to delete quiz result");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa kết quả:", error);
    throw handleApiError(error);
  }
};

export const updateQuizResult = async (
  updatedResult: QuizResult
): Promise<QuizResult> => {
  const isConfirmed = window.confirm(
    "Bạn có chắc chắn muốn lưu kết quả bài kiểm tra không?"
  );
  if (!isConfirmed) return Promise.reject("Hủy lưu kết quả bài kiểm tra");
  try {
    const serviceIds = updatedResult.services.map((s) => s.id);
    const response = await axiosInstance.put<ApiResponse<QuizResult>>(
      `/quizResult/${updatedResult.id}`,
      {
        quizId: updatedResult.quizId,
        resultText: updatedResult.resultText,
        minPoint: updatedResult.minPoint,
        maxPoint: updatedResult.maxPoint,
        serviceId: serviceIds,
      }
    );
    if (response.data.code !== 0)
      throw new Error(response.data.message || "Failed to update quiz result");
    return response.data.result;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createQuizResult = async (
  quizId: number,
  resultData: Omit<QuizResult, "id">
): Promise<QuizResult> => {
  const isConfirmed = window.confirm(
    "Bạn có chắc chắn muốn tạo kết quả bài kiểm tra mới không?"
  );
  if (!isConfirmed) return Promise.reject("Hủy tạo kết quả bài kiểm tra");
  try {
    const serviceIds = resultData.services.map((s) => s.id);
    const response = await axiosInstance.post<ApiResponse<QuizResult>>(
      `/quizResult`,
      {
        quizId: quizId,
        resultText: resultData.resultText,
        minPoint: resultData.minPoint,
        maxPoint: resultData.maxPoint,
        serviceId: serviceIds,
      }
    );
    if (response.data.code !== 0)
      throw new Error(response.data.message || "Failed to create quiz result");
    return response.data.result;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createNewQuiz = async (quizData: Partial<Quiz>): Promise<Quiz> => {
  const isConfirmed = window.confirm(
    "Bạn có chắc chắn muốn tạo quiz mới không?"
  );
  if (!isConfirmed) return Promise.reject("Hủy tạo quiz");
console.log(quizData.categoryId)
  try {
    const response = await axiosInstance.post<ApiResponse<Quiz>>("/quiz", {
      serviceCategoryId: quizData.categoryId || 1,
      name: quizData.name,
    });
    if (response.data.code !== 0)
      throw new Error(response.data.message || "Failed to create quiz");
    return response.data.result;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateQuiz = async (quiz: Quiz): Promise<Quiz> => {
  const isConfirmed = window.confirm(
    "Bạn có chắc chắn muốn cập nhật quiz này không?"
  );
  if (!isConfirmed) return Promise.reject("Hủy cập nhật quiz");

  try {
    const response = await axiosInstance.put<ApiResponse<Quiz>>(
      `/quiz/${quiz.id}`,
      {
        serviceCategoryId: quiz.categoryId,
        name: quiz.name,
      }
    );
    if (response.data.code !== 0)
      throw new Error(response.data.message || "Failed to update quiz");
    return response.data.result;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteQuiz = async (quizId: number) => {
  const isConfirmed = window.confirm(
    "Bạn có chắc chắn muốn xóa quiz này không?"
  );
  if (!isConfirmed) return Promise.reject("Hủy xóa quiz");
  try {
    const response = await axiosInstance.delete(`/quiz/${quizId}`);
    if (response.data.code !== 0)
      throw new Error(response.data.message || "Failed to delete quiz");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa quiz:", error);
    throw handleApiError(error);
  }
};


export const quizResultbyId = async (id: number): Promise<QuizResult[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<QuizResult[]>>(`/quizResult/${id}`);
    if (response.data.code !== 0)
      throw new Error(response.data.message || "Failed to fetch quiz results");
    return response.data.result || [];
  } catch (error) {
    throw handleApiError(error);
  }
};
export const disableQuiz = async (id: number): Promise<boolean> => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.put(`/quiz/disable/${id}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return true;
  } catch (error) {
    toast.error(error.response.data.message);
    console.error("Lỗi khi vô hiệu hóa quiz:", error);
    return false;
  }
};

export const enableQuiz = async (id: number): Promise<boolean> => {
  const token = localStorage.getItem("token");
  try {
    const response = await axiosInstance.put(`/quiz/enable/${id}`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

console.log(response)
    return true;
  } catch (error) {
     toast.error(error.response.data.message);
    
    console.error("Lỗi khi kích hoạt quiz:", error);
    return false;
  }
};