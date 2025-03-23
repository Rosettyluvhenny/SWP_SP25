import { useState, useEffect, ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { type Blog } from "../data/blogData";
import Pagination from "../components/Pagination";
import BlogCard from "../components/BlogCard";
import { blogData } from "../data/blogData";

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearchTerm = searchParams.get("search") || "";
  const initialSortBy = searchParams.get("sort") || "date"; // Default to date
  const initialPage = Number(searchParams.get("page")) || 1;

  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm);
  const [sortBy, setSortBy] = useState<string>(initialSortBy);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const data = await blogData();
        let filteredBlogs = [...data];

        // Search filter
        if (searchTerm) {
          filteredBlogs = filteredBlogs.filter((blog) =>
            blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.content?.toLowerCase().includes(searchTerm.toLowerCase()) // Add content search
          );
        }

        // Enhanced sorting
        filteredBlogs.sort((a, b) => {
          switch (sortBy) {
            case "title":
              return a.title.localeCompare(b.title);
            case "date":
              return new Date(b.date).getTime() - new Date(a.date).getTime(); // Assuming date field exists
            default:
              return 0;
          }
        });

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

  // Pagination handler
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (sortBy && sortBy !== "date") params.set("sort", sortBy); // Don't set default sort in URL
    if (currentPage !== 1) params.set("page", String(currentPage));
    setSearchParams(params);
  }, [searchTerm, sortBy, currentPage, setSearchParams]);

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(blogs.length / ITEMS_PER_PAGE);
  const paginatedBlogs = blogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSelectService = (blogId: number) => {
    window.location.href = `/blog/${blogId}`; // Consider using navigate from react-router instead
  };

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-16 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gradient-to-t from-white to-pink-200 min-h-screen">
      <div className="relative w-full h-[200px] flex flex-col justify-center items-center bg-[url('/assets/sparkle-salon-title.jpg')] bg-cover bg-center bg-no-repeat mt-16">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <h1 className="mt-10 relative z-10 text-white text-7xl font-serif mb-2">Blog</h1>
        <p className="relative z-10 text-white text-xl">Discover our beauty treatments</p>
      </div>

      <div className="py-16 bg-gradient-to-r from-pink-100 to-white text-center flex flex-col items-center">
        <div className="container max-w-screen-lg mx-auto px-4">
          <div className="mb-8 flex justify-center gap-4 flex-wrap">
            <input
              type="text"
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm blog..."
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <select
              value={sortBy}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-300"
            >
              <option value="date">Mới nhất</option>
              <option value="title">Tiêu đề</option>
            </select>
          </div>

          {blogs.length === 0 && (
            <p className="text-gray-600">Không tìm thấy bài blog nào</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedBlogs.map((blog) => (
              <BlogCard
                key={blog.blogId}
                blog={blog}
                onSelectService={handleSelectService}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              paginate={paginate}
            />
          )}
        </div>
      </div>
    </div>
  );
}