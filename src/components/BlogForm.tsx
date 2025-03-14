import { useEffect, useRef, useState } from "react";
import axios from "axios";
import TextEditor from "./TextEditor";
import { serviceBlogById } from "../data/blogData";

// Định nghĩa interface cho QuizResult
interface QuizResult {
  id: number;
  resultText: string;
  minPoint:number;
  maxPoint:number;
  quizId:number;
  quizName:string;
}

const BlogInfoForm = ({
  selectedBlog,
  handleCloseBlogForm,
}: {
  selectedBlog: string | null;
  handleCloseBlogForm: () => void;
}) => {
  const [selectedQuizresult, setSelectedquizresuld] = useState("0");
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]); // Khởi tạo mảng rỗng
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState<string | null>(null);
  const [blogContentDefault, setBlogContentDefault] = useState<string | null>(null);
  const [therapistName, setTherapistName] = useState("");
  const [approve, setApprove] = useState(true);
  const [blogImgUrl, setBlogImgUrl] = useState<string | null>(null);
  const [blogImage, setBlogImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const quillRef = useRef(null);

  // Lấy danh sách quiz results

  const fetchQuizResult = async () => {
    try {
        const response = await axios.get<{ result: QuizResult[] }>(
            "http://localhost:8080/swp/quizResult"
        );
        console.log(response.data.result)
        setQuizResults(response.data.result);
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
};
console.log()
  useEffect(() => {
    const fetchBlog = async (blogId: string) => {
      setIsLoading(true);
      try {
        const blog = await serviceBlogById(blogId);
        console.log(blog, "blog");
        if (blog) {
          setBlogTitle(blog.title);
          setBlogContentDefault(blog.content);
          setBlogContent(blog.content);
          setTherapistName(blog.therapistName);
          setApprove(blog.approve);
          setBlogImgUrl(blog.img);
          setSelectedquizresuld(blog.categoryId.toString() || "0");
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        alert("Không thể tải dữ liệu blog");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizResult();
    if (selectedBlog) {
      fetchBlog(selectedBlog);
    }
  }, [selectedBlog]);

  const handleSaveBlog = async () => {
    if (!blogTitle.trim()) {
      alert("Tiêu đề blog không được để trống");
      return;
    }
    if (!blogContent || blogContent === "<p><br></p>") {
      alert("Nội dung blog không được để trống");
      return;
    }
    if (selectedQuizresult === "0") {
      alert("Vui lòng chọn một quiz result");
      return;
    }

   
    const data = {
      quizResultId: Number(selectedQuizresult),
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
      console.log(selectedBlog);

      const response = selectedBlog
        ? await axios.put(`http://localhost:8080/swp/blogpost/${selectedBlog}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : await axios.post(`http://localhost:8080/swp/blogpost`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

      if (response.status === 200 || response.status === 201) {
        alert(selectedBlog ? "Đã cập nhật blog" : "Đã lưu blog mới");
        handleCloseBlogForm();
      }
    } catch (err) {
      alert("Lưu thất bại");
      console.log(data);

      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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
        <span className="flex flex-col w-full">
          <label className="pr-2" htmlFor="therapistName">
            Tên Chuyên Gia
          </label>
          <input
            type="text"
            id="therapistName"
            className="border-2 border-gray-300 h-[50px] rounded-md px-4 py-2 w-full"
            value={therapistName}
            onChange={(e) => setTherapistName(e.target.value)}
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
            value={selectedQuizresult}
            onChange={(e) => setSelectedquizresuld(e.target.value)}
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
        <span className="flex flex-col w-full">
          <label className="pr-2" htmlFor="approve">
            Trạng Thái
          </label>
          <select
            value={approve.toString()}
            onChange={(e) => setApprove(e.target.value === "true")}
            className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 h-[50px]"
            disabled={isLoading}
          >
            <option value="true">Đã duyệt</option>
            <option value="false">Chưa duyệt</option>
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