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
export const updateQuestionText = async (updatedQuestion: Question): Promise<Question> => {
  try {
    console.log("Updating question:", JSON.stringify(updatedQuestion, null, 2));

    const response = await axiosInstance.put<ApiResponse<Question>>(
      `/question/${updatedQuestion.id}`,
      {
        text: updatedQuestion.text
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
// export const updateAnswers = async (Question: Question, answers: Answer[]): Promise<Answer[]> => {
//   try {
//     console.log("Updating answers:", JSON.stringify(answers, null, 2));

//     // Gửi tất cả request song song
//     const answerPromises = answers.map(answer =>
//       axiosInstance.put<ApiResponse<Answer>>(`/answer/${answer.id}`, {
//         id: Question.id,
//         text: answer.text,
//         point: answer.point
//       })
//     );

//     const answerResponses = await Promise.all(answerPromises);

//     // Kiểm tra nếu có lỗi trong danh sách câu trả lời
//     const failedAnswers = answerResponses.filter(res => res.data.code !== 0);

//     if (failedAnswers.length > 0) {
//       console.warn("Some answers failed to update:", failedAnswers);
//       throw new Error("Some answers failed to update. Please check logs.");
//     }

//     return answerResponses.map(res => res.data.result);
//   } catch (error) {
//     throw handleApiError(error);
//   }
// };


export const deleteQuestion = async (questionId: number) => {
  try {
    const response = await axios.delete(`http://localhost:8080/swp/question/${questionId}`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa câu hỏi:", error);
    throw error;
  }
};


export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse<unknown>>;
    if (axiosError.response) {
      const { status, data } = axiosError.response;
      console.log("API Error:", { status, data }); // Log lỗi
      if (data && "message" in data) return data.message || "Có lỗi xảy ra.";
      if (status === 400) return "Yêu cầu không hợp lệ.";
      return "Lỗi không xác định.";
    }
    return "Không thể kết nối tới máy chủ.";
  }
  console.error("Unexpected Error:", error);
  return "Lỗi không mong muốn.";
};