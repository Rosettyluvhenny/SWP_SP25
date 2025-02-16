import { Link } from "react-router-dom";

export default function Blog() {
  return (
    <div className="pt-16 pt flex flex-col">
      {/* Section 1*/}
      <div className="h-64 flex items-center justify-center bg-[url('/assets/skin-title.jpg')] bg-cover bg-no-repeat">
        <div className="text-start text-white">
          <h1 className="text-7xl font-serif leading-tight">Blog</h1>
        </div>
      </div>

      <div className="py-16 bg-gradient-to-r from-pink-100 to-white text-center flex flex-col items-center">
        <div className="grid grid-cols-2 gap-12 w-3/4 mx-auto mt-12">
          {/* Service 1 */}
          <div className="flex flex-col items-center">
            <a
              href="https://gaspa.vn/category/kien-thuc-lam-dep/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/assets/skin-blog/blog1.jpg"
                alt="Skin Treatment 1"
                className="rounded-lg shadow-md w-[1020px] h-[566px]  hover:shadow-2xl transition-all duration-300 hover:scale-105"
              />
              <h3 className="text-[170%] px-16 font-semibold text-gray-900 mt-5">
                “Anti-Mụn Party”: Bí Kíp Giúp Da Sạch Mụn Sau Những Bữa Tiệc Noel Đêm Muộn
              </h3>
            </a>
          </div>

          {/* Service 2 */}
          <div className="flex flex-col items-center">
            <a
              href="https://gaspa.vn/ly-do-nen-cham-soc-da-moi-ngay/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/assets/skin-blog/blog2.jpg"
                alt="Skin Treatment 1"
                className="rounded-lg shadow-md w-[1020px] h-[566px]  hover:shadow-2xl transition-all duration-300 hover:scale-105"
              />
              <h3 className="text-[170%] px-16 font-semibold text-gray-900 mt-5">
              1 số lý do nên chăm sóc da mỗi ngày
              </h3>
            </a>
          </div>

          {/* Service 3 */}
          <div className="flex flex-col items-center">
            <a
              href="https://gaspa.vn/co-nen-trang-diem-khi-su-dung-kem-tri-mun-hay-khong/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/assets/skin-blog/blog3.jpg"
                alt="Skin Treatment 1"
                className="rounded-lg shadow-md w-[1020px] h-[566px]  hover:shadow-2xl transition-all duration-300 hover:scale-105"
              />
              <h3 className="text-[170%] px-16 font-semibold text-gray-900 mt-5">
              Có nên trang điểm khi sử dụng kem trị mụn hay không?
              </h3>
            </a>
          </div>

          {/* Service 4 */}
          <div className="flex flex-col items-center">
            <a
              href="https://gaspa.vn/6-cach-duong-da-ngay-mua-nen-ghi-nho/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/assets/skin-blog/blog4.jpg"
                alt="Skin Treatment 1"
                className="rounded-lg shadow-md w-[1020px] h-[566px]  hover:shadow-2xl transition-all duration-300 hover:scale-105"
              />
              <h3 className="text-[170%] px-16 font-semibold text-gray-900 mt-5">
              6 cách dưỡng da ngày mưa nên ghi nhớ
              </h3>
            </a>
          </div>

          {/* Service 5 */}
          <div className="flex flex-col items-center">
            <a
              href="https://gaspa.vn/6-cach-duong-da-ngay-mua-nen-ghi-nho/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/assets/skin-blog/blog5.jpg"
                alt="Skin Treatment 1"
                className="rounded-lg shadow-md w-[1020px] h-[566px]  hover:shadow-2xl transition-all duration-300 hover:scale-105"
              />
              <h3 className="text-[170%] px-16 font-semibold text-gray-900 mt-5">
              6 cách dưỡng da ngày mưa nên ghi nhớ
              </h3>
            </a>
          </div>

          {/* Service 6 */}
          <div className="flex flex-col items-center">
            <a
              href="https://gaspa.vn/peel-da-la-gi-tim-hieu-cung-ga-spa/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/assets/skin-blog/blog6.jpg"
                alt="Skin Treatment 1"
                className="rounded-lg shadow-md w-[1020px] h-[566px]  hover:shadow-2xl transition-all duration-300 hover:scale-105"
              />
              <h3 className="text-[170%] px-16 font-semibold text-gray-900 mt-5">
              Peel da là gì?
              </h3>
            </a>
          </div>

          {/* Service 7 */}
          <div className="flex flex-col items-center">
            <a
              href="https://gaspa.vn/tham-sau-mun-co-tu-het-duoc-hay-khong/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/assets/skin-blog/blog7.jpg"
                alt="Skin Treatment 1"
                className="rounded-lg shadow-md w-[1020px] h-[566px]  hover:shadow-2xl transition-all duration-300 hover:scale-105"
              />
              <h3 className="text-[170%] px-16 font-semibold text-gray-900 mt-5">
              Thâm sau mụn có tự hết được hay không?
              </h3>
            </a>
          </div>

          {/* Service 8 */}
          <div className="flex flex-col items-center">
            <a
              href="https://gaspa.vn/quy-trinh-peel-da-chuan-y-khoa/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/assets/skin-blog/blog8.jpg"
                alt="Skin Treatment 1"
                className="rounded-lg shadow-md w-[1020px] h-[566px]  hover:shadow-2xl transition-all duration-300 hover:scale-105"
              />
              <h3 className="text-[170%] px-16 font-semibold text-gray-900 mt-5">
              Quy Trình 5 bước Peel da chuẩn Y Khoa
              </h3>
            </a>
          </div>s

        
        </div>
        <button className="mt-6 bg-[#f8a89c] hover:bg-[#ee8874] hover:text-white hover:text-xl text-black px-6 py-3 rounded-3xl font-semibold text-lg">
            <Link to="/service">Xem thêm →</Link>
          </button>
      </div>
    </div>
  );
}
