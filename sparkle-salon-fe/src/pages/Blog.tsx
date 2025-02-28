import { Link } from "react-router-dom";

const blogData = [
  {
    id: 1,
    title: "“Anti-Mụn Party”: Bí Kíp Giúp Da Sạch Mụn Sau Những Bữa Tiệc Noel Đêm Muộn",
    img: "/assets/skin-blog/blog1.jpg",
    link: "https://gaspa.vn/category/kien-thuc-lam-dep/",
  },
  {
    id: 2,
    title: "1 số lý do nên chăm sóc da mỗi ngày",
    img: "/assets/skin-blog/blog2.jpg",
    link: "https://gaspa.vn/ly-do-nen-cham-soc-da-moi-ngay/",
  },
  {
    id: 3,
    title: "Có nên trang điểm khi sử dụng kem trị mụn hay không?",
    img: "/assets/skin-blog/blog3.jpg",
    link: "https://gaspa.vn/co-nen-trang-diem-khi-su-dung-kem-tri-mun-hay-khong/",
  },
  {
    id: 4,
    title: "6 cách dưỡng da ngày mưa nên ghi nhớ",
    img: "/assets/skin-blog/blog4.jpg",
    link: "https://gaspa.vn/6-cach-duong-da-ngay-mua-nen-ghi-nho/",
  },
  {
    id: 5,
    title: "Peel da là gì?",
    img: "/assets/skin-blog/blog6.jpg",
    link: "https://gaspa.vn/peel-da-la-gi-tim-hieu-cung-ga-spa/",
  },
  {
    id: 6,
    title: "Thâm sau mụn có tự hết được hay không?",
    img: "/assets/skin-blog/blog7.jpg",
    link: "https://gaspa.vn/tham-sau-mun-co-tu-het-duoc-hay-khong/",
  },
  {
    id: 7,
    title: "Quy Trình 5 bước Peel da chuẩn Y Khoa",
    img: "/assets/skin-blog/blog8.jpg",
    link: "https://gaspa.vn/quy-trinh-peel-da-chuan-y-khoa/",
  },
];

export default function Blog() {
  return (
    <div className="pt-16 flex flex-col">
      {/* Banner */}
      <div className="h-64 flex items-center justify-center bg-[url('/assets/sparkle-salon-title.jpg')] bg-cover bg-no-repeat">
        <h1 className="text-7xl font-serif text-white">Blog</h1>
      </div>

      {/* Blog Section */}
      <div className="py-16 bg-gradient-to-r from-pink-100 to-white text-center flex flex-col items-center">
        <div className="container max-w-screen-lg mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogData.map((blog) => (
              <div key={blog.id} className="flex flex-col items-center">
                <a href={blog.link} target="_blank" rel="noopener noreferrer">
                  <img
                    src={blog.img}
                    alt={blog.title}
                    className="rounded-lg shadow-md w-full h-auto hover:shadow-2xl transition-all duration-300 "
                  />
                  <h3 className="text-xl px-6 font-semibold text-gray-900 mt-5 text-center">{blog.title}</h3>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Button Xem thêm */}
        <button className="mt-6 bg-[#f8a89c] hover:bg-[#ee8874] text-black hover:text-white px-6 py-3 rounded-3xl font-semibold text-lg transition-all">
          <Link to="/service">Xem thêm →</Link>
        </button>
      </div>
    </div>
  );
}
