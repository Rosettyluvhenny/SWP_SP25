import { useParams } from "react-router-dom";
import { Blog, serviceBlogById } from  "../data/blogData";
import { useState, useEffect } from "react";

export default function BlogDetail() {
  const { blogId } = useParams<{ blogId: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!blogId) {
      setError("ID blog không hợp lệ");
      setIsLoading(false);
      return;
    }

    const fetchBlog = async (id: string) => {
      try {
        setIsLoading(true);
        setError(null);
        const blogData = await serviceBlogById(id);
        if (!blogData) {
          setError("Blog không tồn tại");
          setBlog(null);
        } else {
          setBlog(blogData);
        }
      } catch (err) {
        setError("Không thể tải dữ liệu blog");
        console.error("Lỗi khi tải blog:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog(blogId);
  }, [blogId]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div
        className="relative h-64 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/sparkle-salon-title.jpg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-6xl font-serif text-white font-bold drop-shadow-lg">
            Blog
          </h1>
        </div>
      </div>

      {/* Nội dung Blog */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
        <div className="max-w-3xl w-full bg-white shadow-xl rounded-lg p-8 transition-opacity duration-500 ease-in-out">
          {isLoading ? (
            <div className="text-center py-16 text-blue-500 animate-pulse text-xl font-semibold">
              Đang tải...
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-500 text-xl font-semibold">
              {error}
            </div>
          ) : blog ? (
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
                {blog.title}
              </h1>
              <img
                src={blog.img}
                alt={blog.title}
                className="w-full h-80 object-cover rounded-lg shadow-md"
              />
              <p
                className="mt-6 text-lg text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              ></p>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500 text-lg">
              Blog không tồn tại
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
