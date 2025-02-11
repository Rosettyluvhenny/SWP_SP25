import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-r from-[#2b3252] to-[#856565] text-white py-4">
            <div className="text-center mb-8 border-b-2 border-gray-500 pb-4">
                <p className="text-2xl font-serif">
                    Da mặt dù có ra sao cũng sẽ đẹp, hãy để chúng tôi giúp bạn. 
                    <Link to="/contact" className="underline hover:text-[#f8a89c] hover:text-3xl">Đặt lịch ngay nhé →</Link>
                </p>
            </div> 

            {/* Main Footer Content */}
            <div className="container mx-auto flex flex-col md:flex-row justify-around px-8 border-b-2 border-gray-500 pb-6">
                {/* Logo Section */}
                <div className="mb-6 md:mb-0">
                    <h2 className="text-2xl font-semibold flex items-center">
                        <span className="text-[#f8a89c] text-4xl">&#10047;</span> Sparkle Salon
                    </h2>
                </div>

                {/* Contact Info */}
                <div className="flex flex-wrap gap-14 items-center">
                    <div>
                        <h3 className="text-lg text-[#f8a89c] font-serif">Địa chỉ</h3>
                        <p className="text-gray-300">FPT University<br/>VN, TP.HCM</p>
                    </div>

                    <div>
                        <h3 className="text-lg text-[#f8a89c] font-serif">Hỗ trợ khách hàng</h3>
                        <p className="text-gray-300">hotline: +84 123456789<br/>info@gmail.com</p>
                    </div>
                </div>
            </div>

            <div className="text-white text-center py-2">
                © {new Date().getFullYear()} Sparkle Salon. Luôn sẵn sàng phục vụ quý khách.
            </div>
        </footer>
    );
}
