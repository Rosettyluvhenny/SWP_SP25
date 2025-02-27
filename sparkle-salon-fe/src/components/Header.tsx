import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

export default function Header() {
    const [loginData, setLoginData] = useState({ username: "", password: "" });
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [registerData, setRegisterData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<{ name: string; avatar: string } | null>(
        null
    );

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUser(null);
    };

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    };

    // Login API
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post(
                "http://localhost:8081/swp/auth/authenticate",
                loginData
            );
            setUser(response.data.user);
            setIsLoggedIn(true);
            setIsLoginOpen(false);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data?.message || "Đăng nhập không thành công!"
                );
            } else {
                setError("Có lỗi xảy ra!");
            }
        }
    };

    // Register API
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/register",
                registerData
            );
            setUser(response.data.user);
            setIsLoggedIn(true);
            setIsRegisterOpen(false);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.message || "Đăng ký không thành công!");
            } else {
                setError("Có lỗi xảy ra!");
            }
        }
    };

    const isActive = (path: string) =>
        location.pathname === path ? "text-gray-400 font-bold" : "text-white";

    return (
        <header className="fixed top-0 left-0 w-full flex justify-between items-center p-4 bg-[url('/assets/sparkle-salon-title.jpg')] bg-cover bg-center bg-no-repeat text-white text-xl font-serif shadow-md z-50">
            <div className="text-2xl font-serif text-[#f398d0] flex flex-row items-center">
                <Link to="/">
                    <img
                        src="/assets/logo1.jpg"
                        alt="logo"
                        className="w-[70px] h-[70px] ml-10"
                    />
                </Link>
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
                {isLoggedIn ? (
                    <Link to="/profile" className="flex items-center space-x-2">
                        <img
                            src={user?.avatar}
                            alt="Profile"
                            className="w-10 h-10 rounded-full border-2 border-white"
                        />
                        <span className="text-white hover:text-gray-300">
                            {user?.name}
                        </span>
                    </Link>
                ) : (
                    <button
                        onClick={() => setIsLoginOpen(true)}
                        className="hover:text-gray-300 text-white px-2 py-2 text-lg"
                    >
                        Login
                    </button>
                )}

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
                        <h2 className="text-2xl font-bold text-center text-gray-800">
                            Login
                        </h2>
                        <form className="mt-4" onSubmit={handleLogin}>
                            {error && (
                                <p className="text-red-500 text-center">
                                    {error}
                                </p>
                            )}
                            <div>
                                <label className="block text-black">
                                    UserName
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="Họ và Tên"
                                    value={loginData.username}
                                    onChange={handleLoginChange}
                                    className="w-full px-4 py-2 bg-white border border-gray-300 text-black rounded-md"
                                />
                            </div>
                            <div className="mt-4">
                                <label className="block text-black">
                                    Mật khẩu
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="........"
                                    value={loginData.password}
                                    onChange={handleLoginChange}
                                    className="w-full px-4 py-2 bg-white border border-gray-300 text-black rounded-md"
                                />
                            </div>
                            {/* Forgot Password */}
                            <p className="text-right mt-2">
                                <Link
                                    to="/forgot-password"
                                    className="text-blue-800 hover:underline"
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

                        {/* Login bằng gg */}
                        <div className="mt-4 text-center text-gray-600">
                            Hoặc đăng nhập với
                        </div>
                        <div className="flex justify-center space-x-4 mt-2">
                            <GoogleLogin
                                onSuccess={(credentialResponse) => {
                                    console.log(credentialResponse);
                                }}
                                onError={() => {
                                    console.log("Login Failed");
                                }}
                            />
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
                        <form className="mt-4" onSubmit={handleRegister}>
                            {error && (
                                <p className="text-red-500 text-center">
                                    {error}
                                </p>
                            )}
                            <div>
                                <label className="block text-gray-700">
                                    Họ và Tên
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={registerData.name}
                                    onChange={handleRegisterChange}
                                    className="w-full px-4 py-2 bg-white border border-gray-300 text-black rounded-md"
                                />
                            </div>
                            <div className="mt-4">
                                <label className="block text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={registerData.email}
                                    onChange={handleRegisterChange}
                                    className="w-full px-4 py-2 bg-white border border-gray-300 text-black rounded-md"
                                />
                            </div>
                            <div className="mt-4">
                                <label className="block text-gray-700">
                                    Mật khẩu
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={registerData.password}
                                    onChange={handleRegisterChange}
                                    className="w-full px-4 py-2 bg-white border border-gray-300 text-black rounded-md"
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

            {isLoggedIn && (
                <button onClick={handleLogout}>Logout</button>
            )}

        </header>
    );
}
