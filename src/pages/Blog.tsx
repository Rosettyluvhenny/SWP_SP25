import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { type Blog } from "../data/blogData";
import Pagination from "../components/Pagination";
import BlogCard from "../components/BlogCard";
import { blogData } from "../data/blogData";
export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearchTerm = searchParams.get("search") || "";
  const initialSortBy = searchParams.get("sort") || "";
  const initialPage = Number(searchParams.get("page")) || 1;

  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [sortBy, setSortBy] = useState<string>(initialSortBy);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Lấy dữ liệu blog
  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const data = await blogData();
        let filteredBlogs = [...data];

        if (searchTerm) {
          filteredBlogs = filteredBlogs.filter((blog) =>
            blog.title.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        if (sortBy) {
          filteredBlogs.sort((a, b) => {
            if (sortBy === "title") return a.title.localeCompare(b.title);
            return 0;
          });
        }

        setBlogs(filteredBlogs);
      } catch (err) {
        setError("Không thể tải bài blog");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [searchTerm, sortBy]);

  // Cập nhật URL params
  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchTerm) params.search = searchTerm;
    if (sortBy) params.sort = sortBy;
    if (currentPage !== 1) params.page = currentPage.toString();
    setSearchParams(params);
  }, [searchTerm, sortBy, currentPage, setSearchParams]);

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(blogs.length / ITEMS_PER_PAGE);
  const paginatedBlogs = blogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Xử lý khi chọn blog
  const handleSelectService = (blogId: number) => {
    console.log("Blog selected:", blogId);
    window.location.href = `/blog/${blogId}`; // Điều hướng đến trang chi tiết
  };

  if (isLoading) {
    return <div className="text-center py-16">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gradient-to-t from-white to-pink-200 min-h-screen">
      {/* Banner */}
      <div className="h-64 flex items-center justify-center bg-[url('/assets/sparkle-salon-title.jpg')] bg-cover bg-no-repeat">
        <h1 className="text-7xl font-serif text-white">Blog</h1>
      </div>

      {/* Danh sách Blog */}
      <div className="py-16 bg-gradient-to-r from-pink-100 to-white text-center flex flex-col items-center">
        <div className="container max-w-screen-lg mx-auto px-4">
          {/* Tìm kiếm và sắp xếp */}
          <div className="mb-8 flex justify-center gap-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm blog..."
              className="px-4 py-2 rounded-lg border border-gray-300"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300"
            >
              <option value="">Sắp xếp theo</option>
              <option value="title">Tiêu đề</option>
            </select>
          </div>

          {blogs.length === 0 && (
            <p className="text-gray-600">Không tìm thấy bài blog nào</p>
          )}

          {/* Hiển thị danh sách BlogCard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedBlogs.map((blog) => (
              <BlogCard
                key={blog.blogId}
                blog={blog}
                onSelectService={handleSelectService}
              />
            ))}
          </div>

          {/* Phân trang */}
          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}