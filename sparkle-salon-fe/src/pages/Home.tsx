import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="pt-16 flex flex-col">
            {/* Section 1*/}
            <div className="min-h-screen flex flex-row items-center bg-[url('/assets/home-banner.jpg')] bg-cover bg-center bg-no-repeat">
                <div className="text-start text-white max-w-xl ml-60">
                    <h1 className="text-9xl font-semibold leading-tight">
                        Sparkle Salon
                    </h1>
                    <p className="mt-2 text-lg text-gray-400">
                        Salon hàng đầu về trị liệu da
                    </p>
                    <p className="mt-2 text-lg text-gray-400">
                        Mau đặt lịch để trải nghiệm dịch vụ tốt nhất
                    </p>
                    <button className="mt-6 bg-[#f8a89c] hover:bg-[#ee8874] text-black px-6 py-3 rounded-lg font-semibold text-lg">
                        <Link to="/contact">Đặt lịch ngay →</Link>
                    </button>
                </div>
            </div>
            {/* Small Section */}
            <div className="flex justify-center items-center py-12 bg-white border-b border-gray-300">
                <div className="flex justify-between w-3/4">
                    {/* Item 1 */}
                    <div className="text-center px-6 border-r border-gray-300 last:border-r-0">
                        <h3 className="text-xl font-semibold text-gray-900">
                            <span className="text-gray-600">01</span>{" "}
                            <span className="text-[#ee8874]">—</span> Chuyên
                            viên hàng đầu
                        </h3>
                        <p className="text-gray-500 mt-1">
                            Được đào tạo kỹ càng
                        </p>
                        <Link
                            to="/about"
                            className="hover:underline hover:text-gray-600"
                        >
                            xem thêm →
                        </Link>
                    </div>

                    {/* Item 2 */}
                    <div className="text-center px-6 border-r border-gray-300 last:border-r-0">
                        <h3 className="text-xl font-semibold text-gray-900">
                            <span className="text-gray-600">02</span>{" "}
                            <span className="text-[#ee8874]">—</span> Sản phẩm
                            chất lượng
                        </h3>
                        <p className="text-gray-500 mt-1">
                            Nói không với hàng giả
                        </p>
                        <Link
                            to="/product"
                            className="hover:underline hover:text-gray-600"
                        >
                            xem thêm →
                        </Link>
                    </div>

                    {/* Item 3 */}
                    <div className="text-center px-6">
                        <h3 className="text-xl font-semibold text-gray-900">
                            <span className="text-gray-600">03</span>{" "}
                            <span className="text-[#ee8874]">—</span> Trắc
                            nghiệm về da
                        </h3>
                        <p className="text-gray-500 mt-1">
                            Để chăm sóc da hiệu quả nhất
                        </p>
                    </div>
                </div>
            </div>

            {/* Section 2 */}
            <div className="flex flex-row items-center justify-center w-full bg-gradient-to-r bg-white py-12">
                {/* Left Section */}
                <div className="w-auto flex justify-end pr-40">
                    <img
                        src="/assets/home-services.jpg"
                        alt="Featured Service"
                        className="rounded-xl shadow-lg"
                    />
                </div>
                {/* Right Section */}
                <div className="w-1/2 text-left">
                    <h2 className="text-sm uppercase tracking-widest text-[#ee8874] font-semibold">
                        About the Salon
                    </h2>
                    <h2 className="text-5xl font-bold text-gray-900 leading-tight">
                        1st treatments
                        <br />
                        Skin care beauty
                    </h2>
                    <p className="mt-4 text-lg text-gray-500">
                        Với hơn 10 năm kinh nghiệm về lĩnh vực điều trị các loại
                        da
                    </p>
                    <p className="mt-4 text-lg text-gray-500">
                        chúng tôi thấu hiểu khách hàng hơn bao giờ hết.
                    </p>
                    <div className="mt-6 flex items-center space-x-4">
                        <button className="bg-gray-900 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-md">
                            <Link to="/about">Tìm hiểu thêm →</Link>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
