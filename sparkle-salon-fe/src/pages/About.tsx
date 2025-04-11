import React, { useCallback, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { getAllTherapists, type Therapist } from "../data/therapistData";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar } from "react-icons/fa";

export default function About() {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true); // Kiểm soát transition

  const cardsPerSlide = 3; // Số card hiển thị trên mỗi slide
  const totalSlides = Math.ceil(therapists.length / cardsPerSlide); // Tổng số slide thực tế
  const carouselRef = useRef<HTMLDivElement>(null); // Ref để điều khiển carousel
  // Nhóm các card thành từng nhóm 3 card
  const groupedTherapists: Therapist[][] = [];
  for (let i = 0; i < therapists.length; i += cardsPerSlide) {
    groupedTherapists.push(therapists.slice(i, i + cardsPerSlide));
  }

  // Nhân bản các nhóm để tạo hiệu ứng vòng tròn
  const extendedGroupedTherapists = groupedTherapists.length > 0 ? [
    groupedTherapists[groupedTherapists.length - 1], // Nhóm cuối cùng (trước đầu)
    ...groupedTherapists, // Các nhóm thực tế
    groupedTherapists[0], // Nhóm đầu tiên (sau cuối)
  ] : [];

  // Chỉ số thực tế (bỏ qua các nhóm nhân bản)
  const realIndex = (index: number) => {
    if (index === 0) return totalSlides - 1; // Nhóm nhân bản trước đầu -> nhóm cuối
    if (index === extendedGroupedTherapists.length - 1) return 0; // Nhóm nhân bản sau cuối -> nhóm đầu
    return index - 1; // Các nhóm thực tế
  };

  const nextSlide = () => {
    setActiveIndex((prev) => {
      const newIndex = prev + 1;
      if (newIndex === extendedGroupedTherapists.length - 1) {
        // Khi đến nhóm nhân bản cuối cùng, chuẩn bị nhảy về nhóm đầu
        setTimeout(() => {
          setIsTransitioning(false);
          setActiveIndex(1); // Nhảy về nhóm đầu tiên (sau nhóm nhân bản trước đầu)
          setIsTransitioning(true);
        }, 500); // Thời gian khớp với duration của transition
      }
      return newIndex;
    });
  };

  const prevSlide = () => {
    setActiveIndex((prev) => {
      const newIndex = prev - 1;
      if (newIndex === 0) {
        // Khi đến nhóm nhân bản đầu tiên, chuẩn bị nhảy về nhóm cuối
        setTimeout(() => {
          setIsTransitioning(false);
          setActiveIndex(extendedGroupedTherapists.length - 2); // Nhảy về nhóm cuối (trước nhóm nhân bản sau cuối)
          setIsTransitioning(true);
        }, 500); // Thời gian khớp với duration của transition
      }
      return newIndex;
    });
  };

  const fetchTherapists = useCallback(async () => {
    setIsLoading(true);
    try {
      const therapistsData = await getAllTherapists();
      const activeTherapists = therapistsData.filter((therapist: Therapist) => therapist.active === true);
      setTherapists(activeTherapists);
      setError(null);
    } catch (error) {
      console.error("Error fetching therapists:", error);
      setError("Không thể tải danh sách chuyên viên. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTherapists();
  }, [fetchTherapists]);

  // Khởi tạo activeIndex ở vị trí nhóm đầu tiên (sau nhóm nhân bản trước đầu)
  useEffect(() => {
    if (extendedGroupedTherapists.length > 0) {
      setActiveIndex(1); // Bắt đầu từ nhóm đầu tiên (sau nhóm nhân bản trước đầu)
    }
  }, [therapists]);

  const handleViewTherapist = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedTherapist(null);
  };


  return (
    <div className="pt-16 flex flex-col">
      {/* Section 1 */}
      <div className="h-64 flex items-center justify-center bg-[url('/assets/sparkle-salon-title.jpg')] bg-cover bg-no-repeat">
        <div className="text-start text-white">
          <h1 className="text-7xl font-serif leading-tight">About Us</h1>
        </div>
      </div>

      {/* Section 2 */}
      <div className="flex flex-row items-center justify-center w-full bg-white text-left space-y-10">
        {/* Right Section */}
        <div className="w-1/2 px-16 flex justify-end">
          <div className="flex flex-col items-end">
            <h2 className="w-full max-w-[500px] text-lg uppercase font-bold mb-[10px] tracking-[1px] inline-block bg-gradient-to-r from-blue-500 to-red-500 text-transparent bg-clip-text">
              10 năm kinh nghiệm làm việc tại tiệm
            </h2>
            <h2 className="w-full max-w-[500px] text-6xl font-serif text-gray-900 leading-tight">
              Chuỗi salon hiện đại và sang trọng.
            </h2>
            <p className="w-full max-w-[500px] mt-4 text-xl text-gray-500">
              10 năm kinh nghiệm trong lĩnh vực chăm sóc và điều trị các vấn đề
              về: Mụn – Thâm – Sẹo. Đi từ spa lên Phòng khám chuyên khoa Da
              Liễu, Sparkle Salon đã không ngừng nâng cấp dịch vụ, không gian và
              thiết bị nhằm đem đến những trải nghiệm tốt nhất cho khách hàng.
            </p>
            <div className="feature-boxn bg-orange-50 rounded-md xl:w-full mb-[5px] px-[20px] py-[20px] flex items-center gap-x-5">
              <img
                src="/assets/skin-story.jpg"
                alt="Giải thưởng Salon làm đẹp tốt nhất 2023"
                className="w-8 h-8 object-cover rounded" // Kích thước cố định cho ảnh nhỏ
              />
              <p className="font-semibold text-lg">
                Giải thưởng Salon làm đẹp tốt nhất 2024
              </p>
            </div>
          </div>
        </div>
        {/* Left Section */}
        <div className="w-1/2 flex justify-start px-16 relative">
          <img
            src="/assets/skin-about1.jpg"
            alt=""
            className="w-[300px] h-[315px] object-cover rounded-xl" // Đồng bộ kích thước với carousel
          />
          <figcaption className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-[bounce_15s_infinite]">
            <img
              src="/assets/skin-story2.jpg"
              alt=""
              className="w-32 h-32 object-cover rounded" // Kích thước cố định
            />
          </figcaption>
        </div>
      </div>

      {/* Small Section */}
      <div className="bg-gradient-to-r from-pink-100 to-white py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-serif leading-tight text-[#ee8874]">
            CHUYÊN VIÊN
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Đội ngũ chuyên viên giàu kinh nghiệm và tận tâm của chúng tôi
          </p>

          {/* Main carousel container */}
          <div className="relative mt-12 max-w-6xl mx-auto">
            {/* Navigation buttons */}
            {therapists.length > 0 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
                  aria-label="Previous"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
                  aria-label="Next"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}

            {/* Carousel content */}
            <div className="overflow-hidden px-4 rounded-lg shadow-md">
              {isLoading ? (
                <div className="flex justify-center items-center h-[315px]">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ee8874]"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                  <p>{error}</p>
                </div>
              ) : therapists.length > 0 ? (
                <div
                  ref={carouselRef}
                  className="flex"
                  style={{
                    transform: `translateX(-${activeIndex * 100}%)`,
                    transition: isTransitioning ? "transform 0.5s ease-in-out" : "none",
                  }}
                >
                  {extendedGroupedTherapists.map((group, groupIndex) => (
                    <div
                      key={groupIndex}
                      className="min-w-full flex-shrink-0 flex gap-6 justify-center"
                    >
                      {group.map((therapist, index) => (
                        <motion.div
                          key={therapist.id}
                          initial={{ opacity: 0.8, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: (index % cardsPerSlide) * 0.1 }}
                          className="min-w-[300px] sm:min-w-[300px] flex-shrink-0 bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-2xl"
                        >
                          <div className="relative w-[300px] h-[315px] overflow-hidden">
                            <img
                              src={therapist.img || "/placeholder.jpg"}
                              alt={therapist.fullName}
                              className="w-[300px] h-[315px] object-cover transition-transform duration-500 hover:scale-105"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                              <p className="text-white text-sm font-medium">
                                {therapist.experienceYears} năm kinh nghiệm
                              </p>
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl font-semibold text-gray-800">{therapist.fullName}</h3>

                            {therapist.rating != 0 ? <h4 className="text-xl font-semibold text-gray-800" ><span>{therapist.rating}⭐ </span></h4> :
                              <h4 className="text-sm font-semibold text-gray-800" >Chưa có đánh giá</h4>}


                            <motion.button
                              onClick={() => handleViewTherapist(therapist)}
                              className="mt-4 w-full bg-[#ee8874] text-white py-2 rounded-lg hover:bg-[#e67a66] transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Xem chi tiết
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-8 rounded-lg">
                  <p className="text-gray-500">Không có chuyên viên nào</p>
                </div>
              )}
            </div>

            {/* Pagination dots */}
            {therapists.length > 0 && (
              <div className="flex justify-center mt-6 gap-2">
                {Array.from({ length: totalSlides }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index + 1)} // +1 vì có nhóm nhân bản trước đầu
                    className={`h-3 w-3 rounded-full transition-all duration-300 ${realIndex(activeIndex) === index ? "bg-[#ee8874] scale-125" : "bg-gray-300"
                      } hover:bg-[#f8a89c] hover:scale-110`}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={realIndex(activeIndex) === index ? "true" : "false"}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <button className="mt-6 bg-[#f8a89c] hover:bg-[#ee8874] hover:text-white hover:text-xl text-black px-6 py-3 rounded-3xl font-semibold text-lg">
          <Link to="/service">Xem thêm →</Link>
        </button>
      </div>

      {/* Modal xem chi tiết chuyên viên */}
      <AnimatePresence>
        {isViewModalOpen && selectedTherapist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeViewModal}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white p-6 max-w-2xl w-full max-h-[90vh] overflow-hidden rounded-lg shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Thông tin Chuyên viên</h2>
                <button
                  onClick={closeViewModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Đóng"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="overflow-y-auto max-h-[70vh] pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedTherapist.img && (
                    <div className="md:col-span-2">
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <img
                          src={selectedTherapist.img}
                          alt={selectedTherapist.fullName}
                          className="w-[300px] h-[315px] object-cover rounded mx-auto" // Đồng bộ kích thước với carousel
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Họ tên</p>
                    <p className="font-medium text-lg">{selectedTherapist.fullName}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Kinh nghiệm</p>
                    <p className="font-medium">{selectedTherapist.experienceYears} năm</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedTherapist.email}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="font-medium">{selectedTherapist.phone}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-2">Tiểu sử</p>
                  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <p className="text-gray-700">
                      {selectedTherapist.bio || "Không có tiểu sử"}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-2">Dịch vụ</p>
                  {selectedTherapist.services?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedTherapist.services.map((service) => (
                        <Link to={`/service/${service.id}`}>
                          <span
                            key={service.id}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                          >
                            {service.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Không có dịch vụ</p>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t flex justify-center gap-3">
                <motion.button
                  onClick={closeViewModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Đóng
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}