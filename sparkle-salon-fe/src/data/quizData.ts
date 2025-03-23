import axios, { AxiosError } from "axios";

// Định nghĩa interfaces
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

// Định nghĩa interface cho API response
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
  timeout: 10000, // Timeout để tránh treo request
});

// Thêm interceptor để xử lý token từ localStorage
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

// Hàm xử lý lỗi API
const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse<unknown>>;
    if (axiosError.response) {
      const { status, data } = axiosError.response;
      if (status === 401) throw new Error("Không có quyền truy cập. Vui lòng đăng nhập lại.");
      if (status === 404) throw new Error("Không tìm thấy endpoint. Vui lòng kiểm tra server.");
      throw new Error(data?.message || "Có lỗi xảy ra khi tải dữ liệu quiz.");
    }
    throw new Error("Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng.");
  }
  console.error("Lỗi không xác định:", error);
  throw new Error("Có lỗi xảy ra. Vui lòng thử lại sau.");
};

// Hàm lấy danh sách quizzes từ API
const quizData = async (): Promise<Quiz[]> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Quiz[]>>("/quiz");

    // Kiểm tra response từ API
    if (response.data.code !== 0) {
      throw new Error(response.data.message || "Lỗi không xác định từ server");
    }

    const result = response.data.result;
    if (Array.isArray(result)) {
      return result;
    }

    console.warn("Dữ liệu trả về không phải là mảng:", result);
    return [];
  } catch (error) {
    handleApiError(error); // Ném lỗi để caller xử lý
  }
};

export default quizData;