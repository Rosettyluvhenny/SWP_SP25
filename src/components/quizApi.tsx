// src/components/quizApi.tsx
import axios, { AxiosError } from "axios";

const API_URL = "http://localhost:8080/swp";
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

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

export interface QuizResult {
  id: number;
  resultText: string;
  minPoint: number;
  maxPoint: number;
  quizId: number;
  quizName: string;
}

interface ApiResponse<T> {
  code: number;
  result: T;
  message?: string;
}

export const fetchQuizzes = async (): Promise<Quiz[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Quiz[]>>("/quiz");
    if (response.data.code !== 0) throw new Error(response.data.message || "Failed to fetch quizzes");
    return response.data.result || [];
  } catch (error) {
    throw handleApiError(error);
  }
};

export const fetchQuizResults = async (): Promise<QuizResult[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<QuizResult[]>>("/quizResult");
    if (response.data.code !== 0) throw new Error(response.data.message || "Failed to fetch quiz results");
    return response.data.result || [];
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createNewQuestion = async (quiz: Quiz, question: Question): Promise<Question> => {
  try {

    const response = await axiosInstance.post<ApiResponse<Question>>(
      `/question`,
      {
        quizId: quiz.id,
        text: question.text,
        type: "Danh mục dịch vụ",
      }
      // {
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      //   },
      // }
      
    );
    console.log(response);
    if (response.data.code !== 0) throw new Error(response.data.message || "Failed to create question");
    return response.data.result;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateQuestionText = async (quiz: Quiz, updatedQuestion: Question): Promise<Question> => {
  try {
    const response = await axiosInstance.put<ApiResponse<Question>>(
      `/question/${updatedQuestion.id}`,
      {
        quizId: quiz.id,
        text: updatedQuestion.text,
        type: "Danh mục dịch vụ",
      }
    );
    if (response.data.code !== 0) {
      throw new Error(response.data.message || "Failed to update question");
    }
    return response.data.result;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateAnswers = async (question: Question, answers: Answer[]): Promise<Answer[]> => {
  try {
    console.log(" Cập nhật danh sách đáp án:", JSON.stringify(answers, null, 2));
    const answerPromises = answers.map((answer) => {
      const data = {
        questionId: question.id,
        text: answer.text,
        point: answer.point,
      };
      console.log(` Gửi request ${answer.id ? "PUT" : "POST"} cho đáp án ID ${answer.id || "mới"}:`, data);
      answers.forEach((answer) =>
        console.log(` Đáp án: ${answer.text} | ID: ${answer.id ? answer.id : "Mới (Sẽ POST)"}`)
      );
      if (answer.id < 10000) {
        return axiosInstance.put<ApiResponse<Answer>>(`/answer/${answer.id}`, data);
      } else {
        return axiosInstance.post<ApiResponse<Answer>>(`/answer`, data).then((response) => {
          answer.id = response.data.result.id;
          return response;
        });
      }
    });
    const answerResponses = await Promise.all(answerPromises);
    return answerResponses.map((res) => res.data.result);
  } catch (error) {
    console.error("Lỗi cập nhật đáp án:", error);
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
    const response = await axiosInstance.delete(`/quiz/result/${resultId}`);
    if (response.data.code !== 0) throw new Error(response.data.message || "Failed to delete quiz result");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa kết quả:", error);
    throw handleApiError(error);
  }
};

export const updateQuizResult = async (updatedResult: QuizResult): Promise<QuizResult> => {
  try {
    const response = await axiosInstance.put<ApiResponse<QuizResult>>(
      `/quiz/result/${updatedResult.id}`,
      {
        quizId: updatedResult.quizId,
        resultText: updatedResult.resultText,
        minPoint: updatedResult.minPoint,
        maxPoint: updatedResult.maxPoint,
      }
    );
    if (response.data.code !== 0) {
      throw new Error(response.data.message || "Failed to update quiz result");
    }
    return response.data.result;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse<unknown>>;
    if (axiosError.response) {
      const { status, data } = axiosError.response;
      console.log("API Error:", { status, data });
      if (data && "message" in data) return data.message || "Có lỗi xảy ra.";
      if (status === 400) return "Yêu cầu không hợp lệ.";
      return "Lỗi không xác định.";
    }
    return "Không thể kết nối tới máy chủ.";
  }
  console.error("Unexpected Error:", error);
  return "Lỗi không mong muốn.";
};
// Trong quizApi.ts

// Tạo quiz mới

export const createNewQuiz = async (quizData: Partial<Quiz>): Promise<Quiz> => {
  // Hiển thị hộp thoại xác nhận trước khi tạo quiz
  const isConfirmed = window.confirm("Bạn có chắc chắn muốn tạo quiz mới không?");
  if (!isConfirmed) return Promise.reject("Hủy tạo quiz");

  try {
    const response = await axiosInstance.post<ApiResponse<Quiz>>("/quiz", {
      serviceCategoryId: 1,
      name: quizData.name,
    });

   

    console.log(response);
    if (response.data.code !== 0) throw new Error(response.data.message || "Failed to create question");
    return response.data.result;
  } catch (error) {
    throw handleApiError(error);
  }
};
// Cập nhật quiz
export const updateQuiz = async (quiz: Quiz): Promise<Quiz> => {
  // Hiển thị hộp thoại xác nhận trước khi cập nhật
  const isConfirmed = window.confirm("Bạn có chắc chắn muốn cập nhật quiz này không?");
  if (!isConfirmed) return Promise.reject("Hủy cập nhật quiz");

  try {
    const response = await axiosInstance.put<ApiResponse<Quiz>>(`/quiz/${quiz}`, {
      serviceCategoryId: 1,
      name: quiz.name,
    });

   

    console.log(response);
    if (response.data.code !== 0) throw new Error(response.data.message || "Failed to create question");
    return response.data.result;
  } catch (error) {
    throw handleApiError(error);
  }
};


// Xóa quiz
export const deleteQuiz = async (quizId: Quiz) => {
  try {
    const response = await axiosInstance.delete(`/quiz/${quizId}`);
    if (response.data.code !== 0) throw new Error(response.data.message || "Failed to delete quiz");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa kết quả:", error);
    throw handleApiError(error);
  }
};

export const deleteAnswer = async (answerId: number) => {
  try {
    const response = await axiosInstance.delete(`/answer/${answerId}`);
    if (response.data.code !== 0) throw new Error(response.data.message || "Failed to delete quiz");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa kết quả:", error);
    throw handleApiError(error);
  }
};
