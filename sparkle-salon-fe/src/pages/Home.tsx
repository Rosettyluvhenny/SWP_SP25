import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useRecommendService from "../components/RecommendService";

export default function Home() {
    const { recommendService, loading } = useRecommendService();
    console.log("recommend Service", recommendService);
    return (
        <div className="pt-16 flex flex-col">
            {/* Hero Section */}
            <div className="min-h-screen flex flex-row items-center bg-[url('/assets/home-banner.jpg')] bg-cover bg-center bg-no-repeat bg-attachment-local bg-fixed">
                <div className="absolute inset-0 bg-opacity-40"></div>
                <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    className="text-start text-white max-w-xl mx-4 md:ml-20 lg:ml-60 relative z-10"
                >
                    <h1 className="text-7xl md:text-7xl lg:text-9xl font-serif leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-pink-200">
                        Sparkle Salon
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-gray-200 font-light">
                        Salon hàng đầu về trị liệu da
                    </p>
                    <p className="mt-2 text-base md:text-lg text-gray-300">
                        Mau đặt lịch để trải nghiệm dịch vụ tốt nhất
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-8 bg-gradient-to-r from-[#f8a89c] to-[#ee8874] hover:from-[#ee8874] hover:to-[#f8a89c] text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold text-base md:text-lg shadow-lg transition-all duration-300 w-full md:w-auto"
                    >
                        <Link to="/service" aria-label="Book an appointment" className="flex items-center justify-center">
                            Đặt lịch ngay
                            <span className="ml-2 transform transition-transform group-hover:translate-x-1">→</span>
                        </Link>
                    </motion.button>
                </motion.div>
            </div>

            {/* Features Section */}
            <div className="flex justify-center items-center py-12 md:py-16 bg-white border-b border-gray-300 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
                    {[
                        {
                            number: "01",
                            title: "Chuyên viên hàng đầu",
                            description: "Được đào tạo kỹ càng và chuyên nghiệp",
                            link: "/about"
                        },
                        {
                            number: "02",
                            title: "Dịch vụ chất lượng",
                            description: "Nói không với hàng chất lượng kém",
                            link: "/service"
                        },
                        {
                            number: "03",
                            title: "Trắc nghiệm về da",
                            description: "Để hiểu rõ hơn về làn da của bạn",
                            link: "/quiz"
                        }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className="text-center px-6 md:px-8 group hover:bg-pink-50 rounded-xl p-6 transition-all duration-300"
                        >
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                <span className="text-[#ee8874]">{item.number}</span>
                                <span className="mx-2 text-[#ee8874]">—</span>
                                {item.title}
                            </h3>
                            <p className="text-gray-600 mt-2 group-hover:text-gray-800">
                                {item.description}
                            </p>
                            <Link
                                to={item.link}
                                className="inline-block mt-4 text-[#ee8874] hover:text-[#f8a89c] transition-colors group-hover:underline"
                            >
                                xem thêm →
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* About Section */}
            <div className="flex flex-col lg:flex-row items-center justify-center w-full bg-gradient-to-r from-white to-pink-100 text-center py-16 md:py-24 px-4">
                <motion.div
                    initial={{ opacity: 0, x: -100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full lg:w-1/2 flex justify-center lg:justify-end lg:pr-20 mb-8 lg:mb-0"
                >
                    <img
                        src="/assets/home-services.jpg"
                        alt="Featured Service"
                        loading="lazy"
                        className="rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-300 transform hover:scale-105 w-full max-w-md lg:max-w-lg"
                    />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full lg:w-1/2 text-center lg:text-left px-4 lg:px-0"
                >
                    <h2 className="text-sm uppercase tracking-widest text-[#ee8874] font-semibold mb-4">
                        About the Salon
                    </h2>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                        1st treatments
                        <br />
                        <span className="text-[#ee8874]">Skin care beauty</span>
                    </h2>
                    <p className="w-full max-w-[400px] mx-auto lg:mx-0 text-lg text-gray-600 leading-relaxed">
                        Với hơn 10 năm kinh nghiệm về lĩnh vực điều trị các loại da chúng tôi thấu hiểu khách hàng hơn bao giờ hết.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-8 bg-gradient-to-r from-gray-900 to-gray-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full md:w-auto"
                    >
                        <Link to="/about" className="flex items-center justify-center">
                            Tìm hiểu thêm
                            <span className="ml-2">→</span>
                        </Link>
                    </motion.button>
                </motion.div>
            </div>

            {/* Services Section */}
            <div className="py-16 md:py-24 bg-gradient-to-r from-pink-100 to-white px-4">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl md:text-5xl font leading-tight text-center mb-12 md:mb-16"
                >
                    <span className="text-[#ee8874]">Dịch Vụ Đề Xuất</span>
                </motion.h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {loading ?
                        (
                            // Loading state - show skeleton loaders or spinner
                            Array(6).fill(0).map((_, index) => (
                                <div key={index} className="animate-pulse">
                                    <div className="bg-gray-300 h-48 sm:h-56 lg:h-64 rounded-xl"></div>
                                    <div className="h-6 bg-gray-300 rounded mt-4 w-3/4 mx-auto"></div>
                                </div>
                            ))
                        ) : recommendService.length > 0 && (
                            // Show recommended services from the API
                            recommendService.map((service, index) => (
                                <motion.div
                                    key={service.id || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group"
                                >
                                    <Link to={`/service/${service.id}`}>
                                        <div className="overflow-hidden rounded-xl shadow-lg">
                                            <img
                                                src={service.img || `/assets/service-placeholder.jpg`}
                                                alt={service.title || service.name}
                                                loading="lazy"
                                                className="w-full h-48 sm:h-56 lg:h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mt-4 group-hover:text-[#ee8874] transition-colors duration-300 text-center">
                                            {service.title || service.name}
                                        </h3>
                                    </Link>
                                </motion.div>
                            ))
                        )
                    }
                </div>
                <div className="text-center mt-12">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-[#f8a89c] to-[#ee8874] hover:from-[#ee8874] hover:to-[#f8a89c] text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition-all duration-300 w-full md:w-auto"
                    >
                        <Link to="/service" className="flex items-center justify-center">
                            Xem thêm
                            <span className="ml-2">→</span>
                        </Link>
                    </motion.button>
                </div>
            </div>
        </div>
    );
}
