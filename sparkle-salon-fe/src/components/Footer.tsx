import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-r from-[#2b3252] to-[#856565] text-white py-4">
            <div className="text-center mb-8 border-b border-gray-100 pb-4">
                <p className="text-2xl font-serif">
                    Da mặt dù có ra sao cũng sẽ đẹp, hãy để chúng tôi giúp bạn. 
                    <Link to="/contact" className="underline hover:text-[#f8a89c]">Đặt lịch ngay nhé →</Link>
                </p>
            </div>          
            {/* Main Footer Content */}
            <div className="container mx-auto flex flex-col md:flex-row justify-between px-8">
                {/* Logo Section */}
                <div className="mb-6 md:mb-0">
                    <h2 className="text-2xl font-semibold flex items-center">
                        <span className="text-[#f8a89c] text-4xl">&#10047;</span> Sparkle Salon
                    </h2>
                </div>

                {/* Contact Info */}
                <div className="flex flex-wrap gap-12 items-center">
                    <div>
                        <h3 className="text-sm text-[#f8a89c] font-semibold">Địa chỉ</h3>
                        <p className="text-gray-300">FPT University<br/>VN, TP.HCM</p>
                    </div>

                    <div>
                        <h3 className="text-sm text-[#f8a89c] font-semibold">NEED SUPPORT?</h3>
                        <p className="text-gray-300">+84 123456789<br/>info@gmail.com</p>
                    </div>

                    <div>
                        <h3 className="text-sm text-[#f8a89c] font-semibold">CONNECT WITH US</h3>
                        <div className="flex gap-4 mt-2">
                            <Link to="#" className="text-gray-400 hover:text-white text-xl">
                                <FaFacebookF />
                            </Link>
                            <Link to="#" className="text-gray-400 hover:text-white text-xl">
                                <FaInstagram />
                            </Link>
                            <Link to="#" className="text-gray-400 hover:text-white text-xl">
                                <FaTwitter />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-white text-center py-4">
                © {new Date().getFullYear()} Sparkle Salon. Luôn sẵn sàng phục vụ quý khách.
            </div>
        </footer>
    );
}
