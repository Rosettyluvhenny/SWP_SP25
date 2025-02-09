import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
    const location = useLocation();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    const isActive = (path: string) => location.pathname === path ? "text-gray-400 font-bold" : "text-white";

    return (
        <header className="fixed top-0 left-0 w-full flex justify-between items-center p-4 bg-gray-800 text-white text-xl font-semibold shadow-md">
            <div className="text-2xl font-bold"><Link to="/">Sparkle Salon</Link></div>

            <nav>
                    <ul className="flex space-x-10 text-lg">
                        <li><Link to="/" className={`${isActive("/")}`}>Home</Link></li>
                        <li><Link to="/about" className={`${isActive("/about")}`}>About Us</Link></li>
                        <li><Link to="/service" className={`${isActive("/service")}`}>Service</Link></li>
                        <li><Link to="/product" className={`${isActive("/product")}`}>Product</Link></li>
                        <li><Link to="/blog" className={`${isActive("/blog")}`}>Blog</Link></li>
                        <li><Link to="/contact" className={`${isActive("/contact")}`}>Contact</Link></li>
                    </ul>
                </nav>

            {/* Login và Register Buttons */}
            <div>
                <button
                    onClick={() => setIsLoginOpen(true)}
                    className="bg-gray-800 hover:text-gray-300 text-white px-4 py-2 text-lg"
                >
                    Login
                </button>
                <button
                    onClick={() => setIsRegisterOpen(true)}
                    className="bg-gray-800 hover:text-gray-300 text-white px-4 py-2 text-lg"
                >
                    Register
                </button>
            </div>

            {/* Login Modal */}
            {isLoginOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold text-center text-gray-800">Đăng Nhập</h2>
                        <form className="mt-4">
                            <div>
                                <label className="block text-gray-700">Email</label>
                                <input type="email" className="w-full px-4 py-2 border rounded-lg focus:outline-none text-gray-800 bg-white" />
                            </div>
                            <div className="mt-4">
                                <label className="block text-gray-700">Mật khẩu</label>
                                <input type="password" className="w-full px-4 py-2 border rounded-lg focus:outline-none text-gray-800 bg-white" />
                            </div>
                            <button type="submit" className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg">
                                Đăng nhập
                            </button>
                        </form>

                        {/* chuyển qua Register */}
                        <p className="mt-4 text-center text-gray-500">
                            Bạn chưa có tài khoản?{" "}
                            <button
                                onClick={() => {
                                    setIsRegisterOpen(true);
                                    setIsLoginOpen(false);
                                }}
                                className="text-blue-500 hover:underline"
                            >
                                Đăng ký ngay
                            </button>
                        </p>

                        <button onClick={() => setIsLoginOpen(false)} className="mt-4 w-full text-center text-red-500 hover:text-red-900">
                            Đóng
                        </button>
                    </div>
                </div>
            )}

            {/* Register Modal */}
            {isRegisterOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold text-center text-gray-800">Đăng Ký</h2>
                        <form className="mt-4">
                            <div>
                                <label className="block text-gray-700">Họ và Tên</label>
                                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none text-gray-800 bg-white" />
                            </div>
                            <div className="mt-4">
                                <label className="block text-gray-700">Email</label>
                                <input type="email" className="w-full px-4 py-2 border rounded-lg focus:outline-none text-gray-800 bg-white" />
                            </div>
                            <div className="mt-4">
                                <label className="block text-gray-700">Mật khẩu</label>
                                <input type="password" className="w-full px-4 py-2 border rounded-lg focus:outline-none text-gray-800 bg-white" />
                            </div>
                            <button type="submit" className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg">
                                Đăng ký
                            </button>
                        </form>

                        {/* chuyển qua Login */}
                        <p className="mt-4 text-center text-gray-500">
                            Bạn đã có tài khoản?{" "}
                            <button
                                onClick={() => {
                                    setIsRegisterOpen(false);
                                    setIsLoginOpen(true);
                                }}
                                className="text-blue-500 hover:underline"
                            >
                                Đăng nhập ngay
                            </button>
                        </p>

                        <button onClick={() => setIsRegisterOpen(false)} className="mt-4 w-full text-center text-red-500 hover:text-red-900">
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}
