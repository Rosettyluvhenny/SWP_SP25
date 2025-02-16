import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="pt-16 pt flex flex-col">
      {/* Section 1*/}
      <div className="h-64 flex items-center justify-center bg-[url('/assets/skin-title.jpg')] bg-cover bg-no-repeat">
        <div className="text-start text-white">
          <h1 className="text-7xl font-serif leading-tight">About Us</h1>
        </div>
      </div>

      {/* Section 2 */}
      <div className="flex flex-row  items-center justify-center w-full bg-white text-left space-y-10">
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
                className="w-[30px] h-[30px] "
              />
              <p className="font-semibold text-lg">
                Giải thưởng Salon làm đẹp tốt nhất 2024
              </p>
            </div>
          </div>
        </div>
        {/* Left Section */}
        <div className="relative w-1/2 flex justify-start px-16">
          <img src="/assets/skin-about1.png" alt="" className="rounded-xl" />
          <figcaption className="absolute bottom-[60%] left-10 animate-[bounce_15s_infinite]">
            <img
              src="/assets/skin-story2.jpg"
              alt=""
              className="w-full"
            />
          </figcaption>
        </div>
      </div>
      {/* Small Section */}
      <div className="bg-gradient-to-r pt-16 from-pink-100 to-white text-center flex flex-col items-center">
        <h2 className="text-5xl font-serif leading-tight text-[#ee8874]">
          TOP CHUYÊN VIÊN CỦA THÁNG
        </h2>

        {/* Container cuộn ngang */}
        <div className="w-3/4 pt-16 flex justify-center mx-auto mt-12 overflow-x-auto scrollbar-hide">
          <div className="flex gap-8 snap-x snap-mandatory overflow-x-scroll">
            {/* Danh sách chuyên viên */}
            {[
              { name: "Nguyễn Thị Khánh mymy", img: "/assets/skin-cv/cv1.jpg" },
              { name: "Nguyễn Khánh Vân", img: "/assets/skin-cv/cv2.jpg" },
              { name: "Hoàng Kim Chihi", img: "/assets/skin-cv/cv3.jpg" },
              { name: "Nguyễn Vân Khanh", img: "/assets/skin-cv/cv4.jpg" },
              { name: "Nguyễn Hoàng Hoa", img: "/assets/skin-cv/cv5.jpg" },
              { name: "Phạm Hoàn", img: "/assets/skin-cv/cv6.jpg" },
              { name: "Nguyễn Thảo Linh", img: "/assets/skin-cv/cv7.jpg" },
              { name: "Trần Khánh An", img: "/assets/skin-cv/cv8.jpg" },
              { name: "Hoàng Lan Chi ", img: "/assets/skin-cv/cv9.jpg" },
              { name: "Phạm Minh Châu", img: "/assets/skin-cv/cv10.jpg" },
              { name: "Hoàng Lan Chi", img: "/assets/skin-cv/cv11.jpg" },
              { name: "Đỗ Hạ Vy", img: "/assets/skin-cv/cv12.jpg" },
              { name: "Vũ Thùy Dung", img: "/assets/skin-cv/cv13.jpg" },
              { name: "Bùi Thanh Trúc", img: "/assets/skin-cv/cv14.jpg" },
              
            ].map((person, index) => (
              <div
                key={index}
                className="flex flex-col items-center min-w-[200px] snap-center"
              >
                <img
                  src={person.img}
                  alt={person.name}
                  className="rounded-lg shadow-md w-[200px] h-[250px] object-cover hover:shadow-2xl"
                />
                <h3 className="text-md font-semibold text-gray-900 mt-4">
                  {person.name}
                </h3>
              </div>
            ))}
          </div>
        </div>

        <button className="mt-6  bg-[#f8a89c] hover:bg-[#ee8874] hover:text-white hover:text-xl text-black px-6 py-3 rounded-3xl font-semibold text-lg">
          <Link to="/service">Xem thêm →</Link>
        </button>
      </div>
    </div>
  );
}
