import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "../components/SideBarDashboard";
import ManagementModal from "../components/ManagementModal";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaSearch, FaPlus } from "react-icons/fa";
import { deleteBlogById, type Blog } from "../data/blogData";
import { blogData } from "../data/blogData";
import BlogInfoForm from "../components/BlogForm";
import { jwtDecode } from "jwt-decode";
import instance from "../services/customizedAxios";
import SidebarTherapist from "../components/SidebarTherapist";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface DecodedToken {
  scope: string;
  [key: string]: any;
}

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  paginate: (pageNumber: number) => void;
}

const axiosInstance = instance;

// Pagination Component
const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  paginate,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="mt-4 flex justify-center">
      <ul className="flex items-center space-x-2">
        <motion.button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50"
          whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
          whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
        >
          Trước
        </motion.button>

        {pageNumbers.map((number) => (
          <motion.li
            key={number}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={() => paginate(number)}
              className={`px-3 py-1 rounded-lg ${
                currentPage === number
                  ? "bg-pink-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {number}
            </button>
          </motion.li>
        ))}

        <motion.button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 disabled:opacity-50"
          whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
          whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
        >
          Sau
        </motion.button>
      </ul>
    </nav>
  );
};

export default function BlogManagement() {
  const [isOpenCreateBlog, setIsOpenBlogForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất Cả");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingBlogId, setLoadingBlogId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        console.log("Decoded token scope:", decoded.scope);
        setIsAdmin(decoded.scope === "ROLE_ADMIN");
      } catch (error) {
        console.error("Error decoding token:", error);
        setIsAdmin(false);
      }
    }
  }, []);
  
useEffect(() => {
        if (activeTab === "blog") {
            navigate("/therapist/blog");
        } else if (activeTab === "notes") {
            navigate("/therapist/notes");
        } else if (activeTab === "schedule") {
            navigate("/therapist/schedule");
        }
    }, [activeTab, navigate]);

  const handleOpenBlogForm = (blogId: string | null) => {
    setSelectedBlog(blogId);
    setIsOpenBlogForm(true);
  };

  const handleCloseBlogForm = () => {
    setSelectedBlog(null);
    setIsOpenBlogForm(false);
    getBlogList();
  };

  const getBlogList = useCallback(async () => {
    try {
      const blogs = await blogData();
      console.log("Blogs từ API:", blogs);
      const blogListData: Blog[] = blogs.map((blogItem) => ({
        blogId: blogItem.blogId,
        categoryId: blogItem.categoryId,
        categoryName: blogItem.categoryName,
        title: blogItem.title,
        content: blogItem.content,
        therapistName: blogItem.therapistName,
        approve: blogItem.approve,
        img: blogItem.img,
        defaultBlog: blogItem.defaultBlog,
      }));
      setBlogs(blogListData);
      setTotalPages(Math.ceil(blogListData.length / blogsPerPage));
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Không thể tải danh sách blog");
    }
  }, [blogsPerPage]);

  useEffect(() => {
    getBlogList();
  }, [getBlogList]);
  const closeBlogModal = () => {
    setIsModalOpen(false);
    setEditingBlog(null);
  };

  const handleBlogSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;

    setBlogs((prev) =>
      prev.some((b) => b.blogId === editingBlog.blogId)
        ? prev.map((b) => (b.blogId === editingBlog.blogId ? editingBlog : b))
        : [...prev, editingBlog]
    );
    closeBlogModal();
    getBlogList();
  };

  const handleBlogDelete = async (blogId: number) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa blog này?");
    if (confirmDelete) {
      try {
        const deletedBlog = await deleteBlogById(blogId.toString());
        if (deletedBlog) {
          toast.success("Xóa blog thành công");
          await getBlogList();
        } else {
          toast.error("Xóa blog thất bại");
        }
      } catch (error) {
        console.error("Error deleting blog:", error);
        toast.error("Có lỗi xảy ra khi xóa blog");
      }
    }
  };

  const handleApproveChange = async (
    blogId: string,
    currentStatus: boolean
  ) => {
    if (!isAdmin) {
      toast.error("Chỉ admin mới có quyền thay đổi trạng thái approve");
      return;
    }
    const token = localStorage.getItem("token");
    setLoadingBlogId(blogId);
    const newStatus = !currentStatus;

    try {
      const response = await axiosInstance.put(
        `/blogpost/approve/${blogId}`,
        { approve: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        }
      );

      if (response.result) {
        await getBlogList();
        toast.success(`Đã ${newStatus ? "duyệt" : "hủy duyệt"} blog thành công`);
        setLoadingBlogId(null);
      }
    } catch (error) {
      console.error("Error approving blog:", error);
      setLoadingBlogId(null);
      toast.error("Có lỗi xảy ra khi thay đổi trạng thái");
    }
  };

  const handleSetDefault = async (blogId: string) => {
    if (!isAdmin) {
      toast.error("Chỉ admin mới có quyền set default");
      return;
    }

    const token = localStorage.getItem("token");
    setLoadingBlogId(blogId);

    try {
      const response = await axiosInstance.put(
        `/blogpost/default/${blogId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        }
      );

      if (response.result) {
        await getBlogList();
        setLoadingBlogId(null);
        toast.success("Đã set blog làm mặc định thành công");
      } else {
        throw new Error(response.data.message || "Failed to set default blog");
      }
    } catch (error) {
      console.error("Error setting default blog:", error);
      setLoadingBlogId(null);
      toast.error("Có lỗi xảy ra khi set blog mặc định");
    }
  };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "Tất Cả" || blog.categoryName === selectedCategory)
  );

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredBlogs.length / blogsPerPage));
    setCurrentPage(1);
  }, [filteredBlogs.length, blogsPerPage]);

  return (
    <div className="flex h-screen bg-white">
                {isAdmin ? <Sidebar />  : (
  <SidebarTherapist activeTab={activeTab} setActiveTab={setActiveTab} />
)}
                
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          {isAdmin ? "Quản Lý Blog" : "Write Blog"}
        </h1>

        {isOpenCreateBlog ? (
          <BlogInfoForm
            selectedBlog={selectedBlog}
            handleCloseBlogForm={handleCloseBlogForm}
          />
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <motion.button
                onClick={() => handleOpenBlogForm(null)}
                className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-600 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaPlus /> Thêm Blog
              </motion.button>
            </div>

            <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-pink-100 p-4 rounded-lg shadow">
              <div className="w-full md:w-1/4 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm blog theo tiêu đề..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
              <div className="w-full md:w-3/4">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                  <option value="Tất Cả">Tất Cả</option>
                  {[...new Set(blogs.map((b) => b.categoryName))].map(
                    (category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            <table className="w-full border-collapse rounded-lg ">
              <thead>
                <tr className="bg-white text-black">
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Tiêu Đề</th>
                  <th className="p-3 text-left">Hình Ảnh</th>
                  <th className="p-3 text-left">Tác Giả</th>
                  <th className="p-3 text-left">Trạng Thái</th>
                  <th className="p-3 text-left">Danh Mục</th>
                  <th className="p-3 text-left">Default</th>
                  <th className="p-3 text-left">Hành Động</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {currentBlogs.length > 0 ? (
                  currentBlogs.map((blog) => (
                    <motion.tr
                      key={blog.blogId}
                      className="border-t hover:bg-pink-50 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <td className="p-3">{blog.blogId}</td>
                      <td className="p-3 font-medium">{blog.title}</td>
                      <td className="p-3">
                        <img
                          src={blog.img || "/placeholder.jpg"}
                          alt={blog.title}
                          className="w-auto h-16 object-cover"
                          onError={(e) =>
                            (e.currentTarget.src = "/placeholder.jpg")
                          }
                        />
                      </td>
                      <td className="p-3">
                        {blog.therapistName || "Không có"}
                      </td>
                      <td className="p-3 flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            blog.approve
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {blog.approve ? "Đã duyệt" : "Chưa duyệt"}
                        </span>
                        {isAdmin && !blog.approve && (
                          <motion.button
                            onClick={() =>
                              handleApproveChange(
                                blog.blogId.toString(),
                                blog.approve
                              )
                            }
                            className="px-2 py-1 rounded-lg text-white text-xs bg-green-500 hover:bg-green-600"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={loadingBlogId === blog.blogId.toString()}
                          >
                            {loadingBlogId === blog.blogId.toString()
                              ? "Đang xử lý..."
                              : "Duyệt"}
                          </motion.button>
                        )}
                      </td>
                      <td className="p-3">
                        <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs">
                          {blog.categoryName}
                        </span>
                      </td>
                      <td className="p-3">
                        {isAdmin && (
                          <motion.button
                            onClick={() =>
                              handleSetDefault(blog.blogId.toString())
                            }
                            className={`px-2 py-1 rounded-lg text-white text-xs ${
                              blog.defaultBlog
                                ? "bg-blue-700 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600"
                            }`}
                            whileHover={{ scale: blog.defaultBlog ? 1 : 1.05 }}
                            whileTap={{ scale: blog.defaultBlog ? 1 : 0.95 }}
                            disabled={
                              blog.defaultBlog ||
                              loadingBlogId === blog.blogId.toString()
                            }
                          >
                            {loadingBlogId === blog.blogId.toString()
                              ? "Đang xử lý..."
                              : blog.defaultBlog
                              ? "Đã mặc định"
                              : "Set mặc định"}
                          </motion.button>
                        )}
                        {!isAdmin && (
                          <span
                            className={
                              blog.defaultBlog
                                ? "text-blue-700"
                                : "text-gray-500"
                            }
                          >
                            {blog.defaultBlog ? "Mặc định" : "Không"}
                          </span>
                        )}
                      </td>
                      <td className="p-3 flex space-x-2">
                        <motion.button
                          onClick={() =>
                            handleOpenBlogForm(blog.blogId.toString())
                          }
                          className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 flex items-center gap-1"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaEdit size={14} />
                          Sửa
                        </motion.button>
                        <motion.button
                          onClick={() => handleBlogDelete(blog.blogId)}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 flex items-center gap-1"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaTrash size={14} /> Xóa
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-gray-500">
                      Không tìm thấy blog nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              paginate={paginate}
            />
          </>
        )}

        {isModalOpen && editingBlog && (
          <ManagementModal
            isOpen={isModalOpen}
            onClose={closeBlogModal}
            onSubmit={handleBlogSave}
            title={editingBlog.blogId ? "Chỉnh Sửa Blog" : "Thêm Blog"}
          >
            <form onSubmit={handleBlogSave}>
              <label className="block mb-2">
                <span className="text-gray-700">Tiêu Đề Blog</span>
                <input
                  type="text"
                  value={editingBlog.title}
                  onChange={(e) =>
                    setEditingBlog({ ...editingBlog, title: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </label>
              <label className="block mb-2">
                <span className="text-gray-700">Danh Mục</span>
                <input
                  type="text"
                  value={editingBlog.categoryName}
                  onChange={(e) =>
                    setEditingBlog({
                      ...editingBlog,
                      categoryName: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </label>
            </form>
          </ManagementModal>
        )}
      </main>
    </div>
  );
}
