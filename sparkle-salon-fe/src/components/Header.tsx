import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";
import { getUser, login, register } from "../data/authData";
import { jwtDecode } from "jwt-decode";

export default function Header() {
    const [loginData, setLoginData] = useState({ username: "", password: "" });
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [registerData, setRegisterData] = useState({
        username: "",
        fullName: "",
        email: "",
        password: "",
        phone: "",
        dob: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<{ name: string; avatar: string } | null>(
        null
    );
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

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

        const token = await login(loginData.username, loginData.password);
        if (token) {
            localStorage.setItem("token", token);   
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const decodeToken: any = jwtDecode(token);
            const userId = decodeToken.userId;    
            localStorage.setItem("userId", userId);    
            setIsLoginOpen(false);
            const user = await getUser();
            if (user.roles[0].name === "ADMIN") {
                setUser(user);
                setIsLoggedIn(true);
                alert("chào mừng admin " + user.fullName);
                navigate("/manager");
            } 
            else if (user.roles[1].name === "STAFF") {
                setUser(user);
                setIsLoggedIn(true);
                alert("chào mừng staff " + user.fullName);
                navigate("/manager");
            }
            else if (user.roles[2].name === "THERAPIST") {
                setUser(user);
                setIsLoggedIn(true);
                alert("chào mừng therapist " + user.fullName);
                navigate("/therapist");
            }
            else {
                alert("Login bằng user");
            }
        } else {
            setError("Đăng nhập không thành công!");
        }

        // try {
        //     const response = await axios.post(
        //         "http://localhost:8081/swp/auth/authenticate",
        //         loginData
        //     );
        //     setUser(response.data.user);
        //     setIsLoggedIn(true);
        //     setIsLoginOpen(false);
        // } catch (error: unknown) {
        //     if (axios.isAxiosError(error)) {
        //         setError(
        //             error.response?.data?.message || "Đăng nhập không thành công!"
        //         );
        //     } else {
        //         setError("Có lỗi xảy ra!");
        //     }
        // }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const registerResult = await register({
            username: registerData.username,
            password: registerData.password,
            fullName: registerData.fullName,
            email: registerData.email,
            phone: registerData.phone,
            dob: registerData.dob,
        });
        if (registerResult) {
            setIsRegisterOpen(false);
            alert("Đăng ký thành công");
        } else {
            setError("Đăng ký tài khoản không thành công!");
        }

        // try {
        //     const response = await axios.post(
        //         "http://localhost:5000/api/auth/register",
        //         registerData
        //     );
        //     setUser(response.data.user);
        //     setIsLoggedIn(true);
        //     setIsRegisterOpen(false);
        // } catch (error: unknown) {
        //     if (axios.isAxiosError(error)) {
        //         setError(error.response?.data?.message || "Đăng ký không thành công!");
        //     } else {
        //         setError("Có lỗi xảy ra!");
        //     }
        // }
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
                    ? "bg-opacity-90 backdrop-blur-md bg-gradient-to-r from-white to-pink-200 shadow-lg"
                    : "bg-[url('/assets/sparkle-salon-title.jpg')] bg-cover bg-center bg-no-repeat"
            }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Link
                to="/"
                className="text-2xl font-serif text-[#f398d0] flex items-center z-20"
            >
                <motion.img
                    src="/assets/logo1.jpg"
                    alt="logo"
                    className="w-[50px] h-[50px] md:w-[70px] md:h-[70px] ml-2 md:ml-10 rounded-full"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                />
            </Link>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden z-20 text-2xl p-2"
            >
                {isMobileMenuOpen ? (
                    <FaTimes
                        className={isScrolled ? "text-white" : "text-white"}
                    />
                ) : (
                    <FaBars
                        className={isScrolled ? "text-white" : "text-white"}
                    />
                )}
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex flex-1 justify-center">
                <ul className="flex space-x-10 text-lg">
                    {navItems.map((item) => (
                        <motion.li key={item.path} whileHover={{ scale: 1.1 }}>
                            <Link
                                to={item.path}
                                className={`relative px-3 py-2 transition-colors duration-300 ${
                                    location.pathname === item.path
                                        ? "text-[#f398d0] font-semibold"
                                        : isScrolled
                                        ? "text-black"
                                        : "text-white"
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

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "tween" }}
                        className="fixed inset-0 bg-white z-10 lg:hidden pt-20"
                    >
                        <nav className="container mx-auto px-4">
                            <ul className="space-y-4">
                                {navItems.map((item) => (
                                    <motion.li
                                        key={item.path}
                                        whileHover={{ x: 10 }}
                                        className="border-b border-gray-100 py-2"
                                    >
                                        <Link
                                            to={item.path}
                                            className={`block text-lg ${
                                                location.pathname === item.path
                                                    ? "text-[#f398d0] font-semibold"
                                                    : "text-gray-800"
                                            }`}
                                        >
                                            {item.label}
                                        </Link>
                                    </motion.li>
                                ))}
                                {!isLoggedIn && (
                                    <>
                                        <motion.li
                                            whileHover={{ x: 10 }}
                                            className="border-b border-gray-100 py-2"
                                        >
                                            <button
                                                onClick={() => {
                                                    setIsLoginOpen(true);
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className="block w-full text-left text-lg text-gray-800"
                                            >
                                                Đăng nhập
                                            </button>
                                        </motion.li>
                                        <motion.li
                                            whileHover={{ x: 10 }}
                                            className="border-b border-gray-100 py-2"
                                        >
                                            <button
                                                onClick={() => {
                                                    setIsRegisterOpen(true);
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className="block w-full text-left text-lg text-gray-800"
                                            >
                                                Đăng ký
                                            </button>
                                        </motion.li>
                                    </>
                                )}
                            </ul>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-6 mr-10">
                {isLoggedIn ? (
                    <motion.div
                        className="flex items-center space-x-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <Link
                            to="/profile"
                            className="flex items-center space-x-2 group"
                        >
                            <motion.img
                                src={
                                    user?.avatar || "/assets/default-avatar.jpg"
                                }
                                alt="Profile"
                                className="w-10 h-10 rounded-full border-2 border-[#f398d0]"
                                whileHover={{ scale: 1.1 }}
                            />
                            <span
                                className={`${
                                    isScrolled ? "text-white" : "text-white"
                                } group-hover:text-[#f398d0] transition-colors`}
                            >
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
                                    ? "text-black hover:text-[#f398d0]"
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
                                    ? "text-black hover:text-[#f398d0]"
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
                                <form
                                    onSubmit={handleLogin}
                                    className="space-y-6"
                                >
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
                                            onClick={() =>
                                                setIsLoginOpen(false)
                                            }
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
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-auto flex flex-col"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                        >
                            <div className="bg-gradient-to-r from-[#f398d0] to-[#ee8874] p-4 ">
                                <h2 className="text-2xl font-bold text-white text-center">
                                    Đăng ký tài khoản
                                </h2>
                            </div>
                            <div className="p-6 flex-1 overflow-auto">
                                <form
                                    onSubmit={handleRegister}
                                    className="grid grid-cols-2 gap-4"
                                >
                                    {error && (
                                        <motion.p
                                            className="text-red-500 text-center bg-red-50 p-3 rounded-lg col-span-2"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            {error}
                                        </motion.p>
                                    )}
                                    <div>
                                        <label className="block text-gray-700 mb-2">
                                            Tên người dùng
                                        </label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={registerData.username}
                                            onChange={handleRegisterChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#f398d0] focus:ring-2 focus:ring-[#f398d0] focus:ring-opacity-50 transition-colors"
                                            placeholder="Nhập tên đăng nhập"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">
                                            Họ và tên
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={registerData.fullName}
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
                                            placeholder="Nhập email"
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
                                    <div>
                                        <label className="block text-gray-700 mb-2">
                                            Số điện thoại
                                        </label>
                                        <input
                                            type="text"
                                            name="phone"
                                            value={registerData.phone}
                                            onChange={handleRegisterChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#f398d0] focus:ring-2 focus:ring-[#f398d0] focus:ring-opacity-50 transition-colors"
                                            placeholder="nhập số điện thoại"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">
                                            Ngày Tháng Năm Sinh
                                        </label>
                                        <input
                                            type="date"
                                            name="dob"
                                            value={registerData.dob}
                                            onChange={handleRegisterChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#f398d0] focus:ring-2 focus:ring-[#f398d0] focus:ring-opacity-50 transition-colors"
                                        />
                                    </div>

                                    <motion.button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-[#f398d0] to-[#ee8874] text-white py-3 rounded-lg font-semibold col-span-2"
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
