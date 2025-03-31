import axios from "axios";

export interface Blog {
  blogId: number;
  categoryId: number;
  categoryName: string;
  title: string;
  content: string;
  therapistName: string;
  approve: boolean;
  img: string;
  defaultBlog: boolean;

}

const API_BASE_URL = "http://localhost:8081/swp";
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000, // Timeout tránh treo request
});

// Thêm interceptor để tự động gửi token
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

const blogData = async (): Promise<Blog[]> => {
  try {
    const response = await axiosInstance.get("/blogpost?isApprove=false");
    return response.data?.result?.content || [];
    
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu blog:", error);
    return [];
  }
};

const serviceBlogById = async (blogId: number) => {
  try {
    const response = await axiosInstance.get(`/blogpost/${blogId}`);
    return response.data?.result || null;
  } catch (error) {
    console.error(`Lỗi khi lấy blog với ID ${blogId}:`, error);
    return null;
  }
};

const deleteBlogById = async (blogId: number): Promise<boolean> => {
  try {
    const response = await axiosInstance.delete(`/blogpost/${blogId}`);
    return response.status === 200;
  } catch (error) {
    console.error(`Lỗi khi xóa blog với ID ${blogId}:`, error);
    return false;
  }
};

const getDefaultByQuizResult = async (categoryId: number) => {
  try {
    const response = await axiosInstance.get(`/blogpost/default/${categoryId}`);
    return response.data?.result || [];
  } catch (error) {
    console.error(`Lỗi khi lấy blog mặc định cho category ${categoryId}:`, error);
    return [];
  }
};

export { blogData, deleteBlogById, serviceBlogById, getDefaultByQuizResult };
