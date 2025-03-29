import { useEffect, useRef, useState } from "react";
import axios from "axios";
import TextEditor from "./TextEditor";
import { serviceBlogById } from "../data/blogData";
import { toast } from "react-toastify";

// Define interface for QuizResult
interface QuizResult {
  id: number;
  resultText: string;
  minPoint: number;
  maxPoint: number;
  quizId: number;
  quizName: string;
}

const API_BASE_URL = "http://localhost:8081/swp";
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Add interceptor for token management
axiosInstance.interceptors.request.use(
  (config) => {
    if (config.method !== "get") {
      const token = localStorage.getItem("token");
      console.log("Request Method:", config.method);
      console.log("Request URL:", config.url);
      console.log("Token being sent:", token);
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      } else {
        console.warn("No token found for authenticated request");
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const BlogInfoForm = ({
  selectedBlog,
  handleCloseBlogForm,
}: {
  selectedBlog: string | null;
  handleCloseBlogForm: () => void;
}) => {
  const [selectedQuizResult, setSelectedQuizResult] = useState("0");
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState<string | null>(null);
  const [blogContentDefault, setBlogContentDefault] = useState<string | null>(null);
  const [approve, setApprove] = useState(true);
  const [blogImgUrl, setBlogImgUrl] = useState<string | null>(null);
  const [blogImage, setBlogImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const quillRef = useRef(null);

  // Fetch quiz results
  const fetchQuizResult = async () => {
    try {
      const response = await axiosInstance.get<{ result: QuizResult[] }>("/quizResult");
      console.log("Quiz Results:", response.data.result);
      setQuizResults(response.data.result);
    } catch (error) {
      console.error("Error fetching quiz results:", error);
    }
  };

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async (blogId: string) => {
      setIsLoading(true);
      try {
        const blog = await serviceBlogById(blogId);
        console.log("Blog data:", blog);
        if (blog) {
          setBlogTitle(blog.title);
          setBlogContentDefault(blog.content);
          setBlogContent(blog.content);
          setApprove(blog.approve);
          setBlogImgUrl(blog.img);
          setSelectedQuizResult(blog.categoryId?.toString() || "0");
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        toast.error("Không thể tải dữ liệu blog");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizResult();
    if (selectedBlog) {
      fetchBlog(selectedBlog);
    }
  }, [selectedBlog]);

  // Form validation
  const validateForm = () => {
    const errors: string[] = [];
    if (!blogTitle.trim()) errors.push("Tiêu đề blog không được để trống");
    if (!blogContent || blogContent === "<p><br></p>") errors.push("Nội dung blog không được để trống");
    if (selectedQuizResult === "0") errors.push("Vui lòng chọn một quiz result");
    return errors;
  };

  // Handle blog save
  const handleSaveBlog = async () => {
    const token = localStorage.getItem("token");
    console.log("Current token:", token);
    if (!token) {
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      return;
    }
  
    const errors = validateForm();
    if (errors.length > 0) {
      toast.error(errors.join("\n"));
      return;
    }
  
    const data = {
      quizResultId: Number(selectedQuizResult),
      title: blogTitle,
      content: blogContent,
    };
    const formData = new FormData();
    if (blogImage) {
      formData.append("img", blogImage);
    }
    formData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));
  
    try {
      setIsLoading(true);
      console.log("Saving blog with ID:", selectedBlog);
  
      const response = selectedBlog
        ? await axiosInstance.put(`/blogpost/${selectedBlog}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          }).catch(error => {
            if (axios.isAxiosError(error)) {
              if (error.response?.status === 403) {
                throw new Error("You don't have permission to update this blog post");
              }
              if (error.response?.status === 401) {
                throw new Error("Authentication failed. Please log in again");
              }
              throw new Error(error.response?.data?.message || "Failed to save blog");
            }
            throw error;
          })
        : await axiosInstance.post(`/blogpost`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
  
      if (response.status === 200 || response.status === 201) {
        toast.success(selectedBlog ? "Đã cập nhật blog" : "Đã lưu blog mới");
        
        // Reset form states
        setSelectedQuizResult("0");
        setBlogTitle("");
        setBlogContent(null);
        setBlogContentDefault(null);
        setApprove(true);
        setBlogImgUrl(null);
        setBlogImage(null);
        
        handleCloseBlogForm();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Lưu thất bại: ${errorMessage}`);
      console.error("Save error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBlogImage(file);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Đang tải...</div>;
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold text-pink-400">
        {selectedBlog ? "Chỉnh Sửa Blog" : "Tạo Blog"}
      </h1>
      <div className="flex flex-row gap-4 mt-4">
        <button
          className="bg-gray-400 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-md"
          onClick={handleCloseBlogForm}
          disabled={isLoading}
        >
          Close
        </button>
        <button
          className="bg-pink-400 text-white px-4 py-2 rounded-md"
          onClick={handleSaveBlog}
          disabled={isLoading}
        >
          Save
        </button>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <span className="flex flex-col w-full">
          <label className="pr-2" htmlFor="title">
            Tiêu Đề Blog
          </label>
          <input
            type="text"
            id="title"
            className="border-2 border-gray-300 h-[50px] rounded-md px-4 py-2 w-full"
            value={blogTitle}
            onChange={(e) => setBlogTitle(e.target.value)}
            disabled={isLoading}
          />
        </span>
      </div>
      <div className="flex flex-row gap-4 mt-4 justify-between w-full">
        {selectedBlog && blogImgUrl ? (
          <div className="flex flex-row gap-2 items-center w-full">
            <img
              src={blogImgUrl + "?timestamp=" + new Date().getTime()}
              alt="Blog Image"
              className="h-[74px] rounded-md"
            />
            <button
              className="text-blue-400"
              onClick={() => setBlogImgUrl(null)}
              disabled={isLoading}
            >
              Thay đổi ảnh
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <span className="flex flex-col w-full">
              <label className="pr-2" htmlFor="image">
                Hình ảnh
              </label>
              <input
                onChange={handleImageChange}
                type="file"
                id="image"
                className="border-2 border-gray-300 h-[50px] rounded-md px-4 py-2"
                disabled={isLoading}
              />
            </span>
          </div>
        )}
        <span className="flex flex-col w-full">
          <label className="pr-2" htmlFor="quizResult">
            Quiz Result
          </label>
          <select
            value={selectedQuizResult}
            onChange={(e) => setSelectedQuizResult(e.target.value)}
            className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 h-[50px]"
            disabled={isLoading}
          >
            <option value="0">Chọn Quiz Result</option>
            {quizResults.length > 0 ? (
              quizResults.map((quiz) => (
                <option key={quiz.id} value={quiz.id.toString()}>
                  {quiz.resultText}
                </option>
              ))
            ) : (
              <option value="0" disabled>
                Không có quiz results
              </option>
            )}
          </select>
        </span>
      </div>
      <div className="mt-4">
        <TextEditor
          ref={quillRef}
          defaultValue={blogContentDefault}
          onTextChange={setBlogContent}
        />
      </div>
    </div>
  );
};

export default BlogInfoForm;