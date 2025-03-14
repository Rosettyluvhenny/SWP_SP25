import React from "react";
import { IoMdTime } from "react-icons/io";

interface BlogCardProps {
    blog: {
        blogId: number;
        categoryId: number;
        categoryName: string;
        title: string;
        content: string;
        therapistName: string;
        approve: boolean;
        img: string;
    };
    onSelectService: (blogId: number) => void; // Thêm prop onSelectService
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, onSelectService }) => {
    const displayName = blog.title || "Tiêu đề không xác định";
    const contentPreview = blog.content.length > 100 ? blog.content.substring(0, 100) + "..." : blog.content;

    // Hàm xử lý khi nhấp vào thẻ
    const handleClick = () => {
        onSelectService(blog.blogId); // Gọi hàm onSelectService với blogId
    };

    return (
        <div
            onClick={handleClick} // Thêm sự kiện onClick cho toàn bộ thẻ
            className="bg-white hover:shadow-2xl transition-all duration-300 rounded-xl shadow-lg border border-pink-100 group h-full flex flex-col overflow-hidden cursor-pointer"
        >
            {/* Ảnh Blog */}
            <div className="relative overflow-hidden">
                <img
                    src={blog.img || "/placeholder.jpg"}
                    alt={displayName}
                    loading="lazy"
                    className="w-full object-cover h-64 transition-transform duration-500 group-hover:scale-110"
                />
                {/* Hiệu ứng Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Nội dung Blog */}
            <div className="p-6 flex flex-col flex-grow">
                {/* Tiêu đề */}
                <h2 className="text-xl font-semibold text-gray-800 h-14 line-clamp-2 group-hover:text-pink-600 transition-colors duration-300">
                    {displayName}
                </h2>

                {/* Nội dung tóm tắt */}
                <div className="mt-3 space-y-3 flex-grow">
                    <p className="text-gray-600 flex items-center">
                        <IoMdTime className="mr-2 text-pink-500" />
                        {contentPreview}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;