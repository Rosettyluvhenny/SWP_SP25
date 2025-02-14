import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaFacebook, FaGoogle } from "react-icons/fa";

export default function Header() {
    const location = useLocation();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    const isActive = (path: string) =>
        location.pathname === path ? "text-gray-400 font-bold" : "text-white";

    return (
        <header className="fixed top-0 left-0 w-full flex justify-between items-center p-4 bg-gradient-to-r from-[#2b3252] to-[#856565] text-white text-xl font-serif shadow-md">
            <div className="text-2xl font-serif">
                <Link to="/">Sparkle Salon</Link>
            </div>

            <nav>
                <ul className="flex space-x-10 text-lg">
                    <li>
                        <Link to="/" className={`${isActive("/")}`}>
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/about" className={`${isActive("/about")}`}>
                            About Us
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/service"
                            className={`${isActive("/service")}`}
                        >
                            Service
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/product"
                            className={`${isActive("/product")}`}
                        >
                            Product
                        </Link>
                    </li>
                    <li>
                        <Link to="/blog" className={`${isActive("/blog")}`}>
                            Blog
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/contact"
                            className={`${isActive("/contact")}`}
                        >
                            Contact
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Login và Register Buttons */}
            <div className="flex flex-row items-center">
                <button
                    onClick={() => setIsLoginOpen(true)}
                    className=" hover:text-gray-300 text-white px-2 py-2 text-lg"
                >
                    Login
                </button>
                <div className="border-r-2 h-[30px]"></div>
                <button
                    onClick={() => setIsRegisterOpen(true)}
                    className=" hover:text-gray-300 text-white px-2 py-2 text-lg"
                >
                    Register
                </button>
            </div>

            {/* Login Modal */}
            {isLoginOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-sm">
                    <div className="bg-gradient-to-l from-white to-pink-200 p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-serif text-center text-gray-800">
                            Login
                        </h2>
                        <form className="mt-4">
                            <div>
                                <label className="block text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none text-gray-800 bg-white"
                                />
                            </div>
                            <div className="mt-4">
                                <label className="block text-gray-700">
                                    Mật khẩu
                                </label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none text-gray-800 bg-white"
                                />
                            </div>

                            {/* Quên mật khẩu */}
                            <p className="text-right mt-2">
                                <Link
                                    to="/forgot-password"
                                    className="text-blue-900 text-lg hover:underline"
                                    onClick={() => setIsLoginOpen(false)} 
                                >
                                    Quên mật khẩu?
                                </Link>
                            </p>

                            <button
                                type="submit"
                                className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
                            >
                                Đăng nhập
                            </button>
                        </form>
        
                        {/* Login bằng gg hoặc fb */}
                        <div className="mt-4 text-center text-gray-600">
                            Hoặc đăng nhập với
                        </div>
                        <div className="flex justify-center space-x-4 mt-2">
                            <a
                                href="https://www.facebook.com/login"
                                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                            >
                                <FaFacebook className="mr-2" /> Facebook
                            </a>
                            <div className="border-r-2 border-gray-400"></div>
                            <a
                                href="https://accounts.google.com/signin"
                                className="flex items-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                            >
                                <FaGoogle className="mr-2" /> Google
                            </a>
                        </div>

                        {/* Switch to Register */}
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

                        <button
                            onClick={() => setIsLoginOpen(false)}
                            className="mt-4 w-full text-center text-red-500 hover:text-red-900"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}

            {/* Register Modal */}
            {isRegisterOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-sm">
                    <div className="bg-gradient-to-r from-white to-pink-200 p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold text-center text-gray-800">
                            Đăng Ký
                        </h2>
                        <form className="mt-4">
                            <div>
                                <label className="block text-gray-700">
                                    Họ và Tên
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none text-gray-800 bg-white"
                                />
                            </div>
                            <div className="mt-4">
                                <label className="block text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none text-gray-800 bg-white"
                                />
                            </div>
                            <div className="mt-4">
                                <label className="block text-gray-700">
                                    Mật khẩu
                                </label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none text-gray-800 bg-white"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
                            >
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

                        <button
                            onClick={() => setIsRegisterOpen(false)}
                            className="mt-4 w-full text-center text-red-500 hover:text-red-900"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}
