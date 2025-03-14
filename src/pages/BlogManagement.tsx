import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "../components/SideBarDashboard";
import ManagementModal from "../components/ManagementModal";
import { motion } from "framer-motion";
import { FaEdit, FaTrash, FaSearch, FaPlus } from "react-icons/fa";
import { deleteBlogById, type Blog } from "../data/blogData";
import { blogData } from "../data/blogData";
import BlogInfoForm from "../components/BlogForm";

export default function BlogManagement() {
    const [isOpenCreateBlog, setIsOpenBlogForm] = useState(false);

    // Blog state
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Tất Cả");
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
    const [selectedBlog, setSelectedBlog] = useState<string | null>(null);

    const handleOpenBlogForm = (blogId: string | null) => {
        setSelectedBlog(blogId);
        setIsOpenBlogForm(true);
    };

    const handleCloseBlogForm = () => {
        setSelectedBlog(null);
        setIsOpenBlogForm(false);
    };

    // Blog logic
    const getBlogList = useCallback(async () => {
        const blogs = await blogData();
        const blogListData: Blog[] = blogs.map((blogItem) => ({
            blogId: blogItem.blogId,
            categoryId: blogItem.categoryId,
            categoryName: blogItem.categoryName,
            title: blogItem.title,
            content: blogItem.content,
            therapistName: blogItem.therapistName,
            approve: blogItem.approve,
            img: blogItem.img,
        }));
        if (blogListData.length > 0) {
            setBlogs(blogListData);
        }
    }, []);

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
    };

    // Delete handlers
    const handleBlogDelete = async (blogId: number) => {
        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa blog này?");
        if (confirmDelete) {
            const deletedBlog = await deleteBlogById(blogId.toString());
            console.log(blogId); 

            if (deletedBlog) {
                alert("Xóa blog thành công");
                setBlogs(blogs.filter((blog) => blog.blogId !== blogId));
            } else {
                alert("Xóa blog thất bại");
            }
        }
    };
    
    const filteredBlogs = blogs.filter(
        (blog) =>
            blog.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedCategory === "Tất Cả" || blog.categoryName === selectedCategory)
    );

    return (
        <div className="flex h-screen bg-white">
            <Sidebar />
            <main className="flex-1 p-6 overflow-auto">
               
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Quản Lý Blog</h1>
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

                            {/* Search & Filter Section */}
                           
                                <div   className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-pink-100 p-4 rounded-lg shadow"
                               
                               >
                                    <div className="w-full md:w-1/2 relative">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm blog..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full p-2 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                                    />
                                </div>
                                    
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full md:w-auto p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                                >
                                    <option value="Tất Cả">Tất Cả</option>
                                    {[...new Set(blogs.map((b) => b.categoryName))].map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                </div> 

                            {/* Blog Table */}
                            
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse rounded-lg overflow-hidden">
                                        <thead>
                                            <tr className="bg-white text-black">
                                                <th className="p-3 text-left">ID</th>
                                                <th className="p-3 text-left">Tiêu Đề</th>
                                                <th className="p-3 text-left">Hình Ảnh</th>
                                                <th className="p-3 text-left">Tác Giả</th>
                                                <th className="p-3 text-left">Trạng Thái</th>
                                                <th className="p-3 text-left">Danh Mục</th>
                                                <th className="p-3 text-left">Hành Động</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white">
                                            {filteredBlogs.length > 0 ? (
                                                filteredBlogs.map((blog) => (
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
                                                                src={blog.img}
                                                                alt={blog.title}
                                                                className="w-auto h-16"
                                                            />
                                                        </td>
                                                        <td className="p-3">{blog.therapistName}</td>
                                                        <td className="p-3">
                                                            <span
                                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                    blog.approve
                                                                        ? "bg-green-100 text-green-800"
                                                                        : "bg-yellow-100 text-yellow-800"
                                                                }`}
                                                            >
                                                                {blog.approve ? "Đã duyệt" : "Chưa duyệt"}
                                                            </span>
                                                        </td>
                                                        <td className="p-3">
                                                            <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs">
                                                                {blog.categoryName}
                                                            </span>
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
                                                    <td
                                                        colSpan={7}
                                                        className="p-4 text-center text-gray-500"
                                                    >
                                                        Không tìm thấy blog nào
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            
                        </>
                    )}
                
            </main>

            {/* Blog Modal */}
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
                                    setEditingBlog({
                                        ...editingBlog,
                                        title: e.target.value,
                                    })
                                }
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                            />
                        </label>
                        <label className="block mb-2">
                            <span className="text-gray-700">Tên Chuyên Gia</span>
                            <input
                                type="text"
                                value={editingBlog.therapistName}
                                onChange={(e) =>
                                    setEditingBlog({
                                        ...editingBlog,
                                        therapistName: e.target.value,
                                    })
                                }
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                            />
                        </label>
                        <label className="block mb-2">
                            <span className="text-gray-700">Trạng Thái</span>
                            <select
                                value={editingBlog.approve.toString()}
                                onChange={(e) =>
                                    setEditingBlog({
                                        ...editingBlog,
                                        approve: e.target.value === "true",
                                    })
                                }
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                            >
                                <option value="true">Đã duyệt</option>
                                <option value="false">Chưa duyệt</option>
                            </select>
                        </label>
                        <label className="block mb-4">
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
        </div>
    );
}