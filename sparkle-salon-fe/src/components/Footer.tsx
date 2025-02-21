import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-r from-[#2b3252] to-[#856565] text-white py-2">
            <div className="text-center mb-8 border-b-2 border-gray-500 pb-4">
                <p className="text-2xl font-serif">
                    Da mặt dù có ra sao cũng sẽ đẹp, hãy để chúng tôi giúp bạn. 
                    <Link to="/service" className="underline hover:text-[#f8a89c] hover:text-3xl">Xem ngay →</Link>
                </p>
            </div> 

            {/* Main Footer Content */}
            <div className="container mx-auto flex flex-col md:flex-row justify-around border-b-2 border-gray-500">
                {/* Logo Section */}
                <div className="mb-6 md:mb-0">
                    <h2 className="text-3xl font-serif flex items-center">
                        <span><img src="/assets/logo2.jpg" alt="logo" className="w-[250px]" /></span> 
                    </h2>
                </div>

                {/* Contact Info */}
                <div className="flex flex-wrap gap-14 items-center">
                    <div>
                        <h3 className="text-2xl text-[#f398d0] font-serif">Địa Chỉ</h3>
                        <p className="text-white">FPT University<br/>VN, TP.HCM</p>
                    </div>
                    <div>
                        <h3 className="text-2xl text-[#f398d0] font-serif">Chi Nhánh 1</h3>
                        <p className="text-white">hotline: +84 123456789<br/>info@gmail.com</p>
                    </div>
                    <div>
                        <h3 className="text-2xl text-[#f398d0] font-serif">Chi Nhánh 2</h3>
                        <p className="text-white">hotline: +84 123456789<br/>info@gmail.com</p>
                    </div>
                    <div>
                        <h3 className="text-2xl text-[#f398d0] font-serif">Hỗ Trợ Khách Hàng</h3>
                        <p className="text-white">hotline: +84 123456789<br/>info@gmail.com</p>
                    </div>
                </div>
            </div>

            <div className="text-white text-center mt-1">
                © {new Date().getFullYear()} Sparkle Salon. Luôn sẵn sàng phục vụ quý khách.
            </div>
        </footer>
    );
}
