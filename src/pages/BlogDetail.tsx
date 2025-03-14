import { useParams } from "react-router-dom";
import { Blog, serviceBlogById } from "../data/blogData";
import { useState, useEffect } from "react";

export default function BlogDetail() {
  const { blogId } = useParams<{ blogId: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchBlog = async (id: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const blog = await serviceBlogById(id);
        if (!blog) {
          setError("Blog không tồn tại");
          setBlog(null);
        } else {
          setBlog(blog);
        }
      } catch (err) {
        setError("Không thể tải dữ liệu blog");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (blogId) {
      fetchBlog(blogId); // Truyền blogId vào fetchBlog
    } else {
      setError("ID blog không hợp lệ");
      setIsLoading(false);
    }
  }, [blogId]);

  if (isLoading) {
    return <div className="text-center py-16">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-500">{error}</div>;
  }

  if (!blog) {
    return <div className="text-center py-16">Blog không tồn tại</div>;
  }
  console.log(blog.categoryName);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">{blog.title}</h1>
      <img src={blog.img} alt={blog.title} className="w-full h-96 object-cover my-4" />
      <p>{blog.content}</p>
    </div>
  );
}