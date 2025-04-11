import React, { useState, useEffect } from "react";

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
    onSelectService: (blogId: number) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, onSelectService }) => {
    const [validatedImg, setValidatedImg] = useState<string>(blog.img );
    const [isLoading, setIsLoading] = useState(false);

    const displayName = blog.title || "Tiêu đề không xác định";
   

    useEffect(() => {
        const validate = async () => {
            if (blog.img && blog.img.trim()) {
                try {
                    const response = await fetch(blog.img, { method: 'HEAD', mode: 'cors' });
                    if (response.ok) setValidatedImg(blog.img);
                } catch (err) {
                    console.warn(`URL ảnh không hợp lệ: ${blog.img}`, err);
                }
            }
        };
        validate();
    }, [blog.img]);

    const handleClick = () => {
        setIsLoading(true);
        onSelectService(blog.blogId);
        setTimeout(() => setIsLoading(false), 500); // Reset sau 1s (tùy chỉnh thời gian)
    };

    // Kiểm tra điều kiện approve
    if (!blog.approve) {
       
        return null; 

    }

    return (
        <div
            onClick={handleClick}
            className={`bg-white hover:shadow-2xl transition-all duration-300 rounded-xl shadow-lg border border-pink-100 group h-full flex flex-col overflow-hidden cursor-pointer ${isLoading ? 'opacity-50' : ''}`}
        >
            {/* Ảnh Blog */}
            <div className="relative overflow-hidden">
                <img
                    src={validatedImg}
                    alt={displayName}
                    loading="lazy"
                    className="w-full object-cover h-64 transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                        const imgElement = e.target as HTMLImageElement;
                        console.warn(`Không thể tải ảnh: ${blog.img || 'undefined'}, chuyển sang CDN`);
                        imgElement.src = 'https://via.placeholder.com/300x200?text=Fallback+Image';
                        imgElement.onerror = null;
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            {/* Nội dung Blog */}
            <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-semibold text-gray-800 h-14 line-clamp-2 group-hover:text-pink-600 transition-colors duration-300">
                    {displayName}
                </h2>
                <div className="mt-3 space-y-3 flex-grow">
                   
                </div>
            </div>
        </div>
    );
};

export default BlogCard;