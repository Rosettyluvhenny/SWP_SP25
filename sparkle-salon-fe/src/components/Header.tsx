import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { motion, AnimatePresence } from "framer-motion";

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
    const [user, setUser] = useState<{ name: string; avatar: string } | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUser(null);
    };

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
        setError(null);
    };

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

    const navItems = [
        { path: "/", label: "Home" },
        { path: "/about", label: "About Us" },
        { path: "/service", label: "Service" },
        { path: "/blog", label: "Blog" },
        { path: "/contact", label: "Contact" },
    ];

    return (
        <motion.header 
            className={`fixed top-0 left-0 w-full flex justify-between items-center p-4 transition-all duration-300 z-50 ${
                isScrolled 
                    ? "bg-white bg-opacity-90 backdrop-blur-md shadow-lg" 
                    : "bg-[url('/assets/sparkle-salon-title.jpg')] bg-cover bg-center bg-no-repeat"
            }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Link to="/" className="text-2xl font-serif text-[#f398d0] flex items-center">
                <motion.img
                    src="/assets/logo1.jpg"
                    alt="logo"
                    className="w-[70px] h-[70px] ml-10 rounded-full"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                />
            </Link>

            <nav className="flex-1 flex justify-center">
                <ul className="flex space-x-10 text-lg">
                    {navItems.map((item) => (
                        <motion.li key={item.path} whileHover={{ scale: 1.1 }}>
                            <Link
                                to={item.path}
                                className={`relative px-3 py-2 transition-colors duration-300 ${
                                    location.pathname === item.path
                                        ? "text-[#f398d0] font-semibold"
                                        : isScrolled ? "text-gray-800" : "text-white"
                                }`}
                            >
                                {item.label}
                                {location.pathname === item.path && (
                                    <motion.div
                                        className="absolute bottom-0 left-0 w-full h-0.5 bg-[#f398d0]"
                                        layoutId="underline"
                                    />
                                )}
                            </Link>
                        </motion.li>
                    ))}
                </ul>
            </nav>

            <div className="flex items-center space-x-6 mr-10">
                {isLoggedIn ? (
                    <motion.div 
                        className="flex items-center space-x-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <Link to="/profile" className="flex items-center space-x-2 group">
                            <motion.img
                                src={user?.avatar || "/assets/default-avatar.jpg"}
                                alt="Profile"
                                className="w-10 h-10 rounded-full border-2 border-[#f398d0]"
                                whileHover={{ scale: 1.1 }}
                            />
                            <span className={`${isScrolled ? "text-gray-800" : "text-white"} group-hover:text-[#f398d0] transition-colors`}>
                                {user?.name}
                            </span>
                        </Link>
                        <motion.button
                            onClick={handleLogout}
                            className="text-[#f398d0] hover:text-[#ee8874] transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            Đăng xuất
                        </motion.button>
                    </motion.div>
                ) : (
                    <div className="flex items-center space-x-4">
                        <motion.button
                            onClick={() => setIsLoginOpen(true)}
                            className={`px-4 py-2 rounded-full ${
                                isScrolled 
                                    ? "text-gray-800 hover:text-[#f398d0]" 
                                    : "text-white hover:text-[#f398d0]"
                            } transition-colors`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            Đăng nhập
                        </motion.button>
                        <div className="h-6 w-px bg-gray-300"></div>
                        <motion.button
                            onClick={() => setIsRegisterOpen(true)}
                            className={`px-4 py-2 rounded-full ${
                                isScrolled 
                                    ? "text-gray-800 hover:text-[#f398d0]" 
                                    : "text-white hover:text-[#f398d0]"
                            } transition-colors`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            Đăng ký
                        </motion.button>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {/* Login Modal */}
                {isLoginOpen && (
                    <motion.div 
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                        >
                            <div className="bg-gradient-to-r from-[#f398d0] to-[#ee8874] p-6">
                                <h2 className="text-2xl font-bold text-white text-center">
                                    Đăng nhập
                                </h2>
                            </div>
                            <div className="p-8">
                                <form onSubmit={handleLogin} className="space-y-6">
                                    {error && (
                                        <motion.p 
                                            className="text-red-500 text-center bg-red-50 p-3 rounded-lg"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            {error}
                                        </motion.p>
                                    )}
                                    <div>
                                        <label className="block text-gray-700 mb-2">
                                            Tên đăng nhập
                                        </label>
                                        <input
                                            type="text"
                                            name="username"
                                            placeholder="Nhập tên đăng nhập"
                                            value={loginData.username}
                                            onChange={handleLoginChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#f398d0] focus:ring-2 focus:ring-[#f398d0] focus:ring-opacity-50 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">
                                            Mật khẩu
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="••••••••"
                                            value={loginData.password}
                                            onChange={handleLoginChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#f398d0] focus:ring-2 focus:ring-[#f398d0] focus:ring-opacity-50 transition-colors"
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <Link
                                            to="/forgot-password"
                                            onClick={() => setIsLoginOpen(false)}
                                            className="text-[#f398d0] hover:text-[#ee8874] transition-colors"
                                        >
                                            Quên mật khẩu?
                                        </Link>
                                    </div>
                                    <motion.button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-[#f398d0] to-[#ee8874] text-white py-3 rounded-lg font-semibold"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Đăng nhập
                                    </motion.button>
                                </form>

                                <div className="mt-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-300"></div>
                                        </div>
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-2 bg-white text-gray-500">
                                                Hoặc đăng nhập với
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex justify-center">
                                        <GoogleLogin
                                            onSuccess={(credentialResponse) => {
                                                console.log(credentialResponse);
                                            }}
                                            onError={() => {
                                                console.log("Login Failed");
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 text-center">
                                    <p className="text-gray-600">
                                        Chưa có tài khoản?{" "}
                                        <button
                                            onClick={() => {
                                                setIsRegisterOpen(true);
                                                setIsLoginOpen(false);
                                            }}
                                            className="text-[#f398d0] hover:text-[#ee8874] font-semibold transition-colors"
                                        >
                                            Đăng ký ngay
                                        </button>
                                    </p>
                                </div>
                            </div>
                            <div className="p-4 border-t border-gray-200">
                                <motion.button
                                    onClick={() => setIsLoginOpen(false)}
                                    className="w-full text-gray-500 hover:text-gray-700 transition-colors"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Đóng
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Register Modal */}
                {isRegisterOpen && (
                    <motion.div 
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div 
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                        >
                            <div className="bg-gradient-to-r from-[#f398d0] to-[#ee8874] p-6">
                                <h2 className="text-2xl font-bold text-white text-center">
                                    Đăng ký tài khoản
                                </h2>
                            </div>
                            <div className="p-8">
                                <form onSubmit={handleRegister} className="space-y-6">
                                    {error && (
                                        <motion.p 
                                            className="text-red-500 text-center bg-red-50 p-3 rounded-lg"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            {error}
                                        </motion.p>
                                    )}
                                    <div>
                                        <label className="block text-gray-700 mb-2">
                                            Họ và tên
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={registerData.name}
                                            onChange={handleRegisterChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#f398d0] focus:ring-2 focus:ring-[#f398d0] focus:ring-opacity-50 transition-colors"
                                            placeholder="Nhập họ và tên"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={registerData.email}
                                            onChange={handleRegisterChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#f398d0] focus:ring-2 focus:ring-[#f398d0] focus:ring-opacity-50 transition-colors"
                                            placeholder="example@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">
                                            Mật khẩu
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={registerData.password}
                                            onChange={handleRegisterChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#f398d0] focus:ring-2 focus:ring-[#f398d0] focus:ring-opacity-50 transition-colors"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <motion.button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-[#f398d0] to-[#ee8874] text-white py-3 rounded-lg font-semibold"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Đăng ký
                                    </motion.button>
                                </form>

                                <div className="mt-6 text-center">
                                    <p className="text-gray-600">
                                        Đã có tài khoản?{" "}
                                        <button
                                            onClick={() => {
                                                setIsRegisterOpen(false);
                                                setIsLoginOpen(true);
                                            }}
                                            className="text-[#f398d0] hover:text-[#ee8874] font-semibold transition-colors"
                                        >
                                            Đăng nhập ngay
                                        </button>
                                    </p>
                                </div>
                            </div>
                            <div className="p-4 border-t border-gray-200">
                                <motion.button
                                    onClick={() => setIsRegisterOpen(false)}
                                    className="w-full text-gray-500 hover:text-gray-700 transition-colors"
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
        </motion.header>
    );
}
