import { useState, useEffect, useContext } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getUser, login, register } from "../data/authData";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import "react-toastify/dist/ReactToastify.css";
import { toast } from 'react-toastify';
import {
    FaBars,
    FaBell,
    FaTimes,
    FaUserEdit,
} from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../context/UserContext";

export default function Header() {
    const [loginData, setLoginData] = useState({ username: "", password: "" });
    // const [isLoginOpen, setIsLoginOpen] = useState(false);
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

    const { user, logout, loginContext, loading, isLoginOpen, setIsLoginOpen } = useContext(UserContext);
    const [error, setError] = useState<string|null>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const [validationError, setValidationError] = useState<{username: string|null, fullName: string|null,email:string|null,
        password: string|null, phone: string|null, dob:string|null}>({
            username: null,
            fullName: null,
            email: null,
            password: null,
            phone: null,
            dob: null
        });;
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

    const [isOpen, setIsOpen] = useState(false);
    const handleLogout = () => {
        logout();
        navigate('/');
    }
    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData((prevData) => {
            const updatedData = { ...prevData, [e.target.name]: e.target.value };
            return updatedData;
        });
        setError(null);
    };

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegisterData((prevData) => {
            const updatedData = { ...prevData, [e.target.name]: e.target.value };
            return updatedData;
        });
        setError(null);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!loginData.username || !loginData.password) {
            toast.error("User/Password  is required!!!")
            return;
        }
        let res = await login(loginData.username, loginData.password);
        // console.log(">> check res ", res)
        if (res && res.result) {
            localStorage.setItem("token", res.result.token)
            loginContext(loginData.username)
            toast.success("Login successfully ");
            setLoginData({ username: "", password: "" });
            setIsLoginOpen(false);
        } else {

                toast.error("Đăng nhập thất bại");
        }
    }

    const validateRegisterData = (data) => {
        const errors = {} ;
        
        // Username: 8-25 characters, letters and numbers only, no spaces
        if (!/^[a-zA-Z0-9]{8,25}$/.test(data.username)) {
            errors.username = "Tên người dùng phải từ 8-25 ký tự, chỉ gồm chữ và số.";
        }
        
        // Full name: Vietnamese regex, no numbers
        if (!/^[\p{L} ]+$/u.test(data.fullName)) {
            errors.fullName = "Họ và tên chỉ được chứa chữ cái và khoảng trắng.";
        }
        
        // Email validation
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) {
            errors.email = "Email không hợp lệ.";
        }
        // Password: At least 8 characters, no spaces
        if (!/^\S{8,}$/.test(data.password)) {
            errors.password = "Mật khẩu phải có ít nhất 8 ký tự và không chứa khoảng trắng.";
        }
        
        // Phone: Exactly 10 digits
        if (!/^\d{10}$/.test(data.phone)) {
            errors.phone = "Số điện thoại phải có 10 chữ số.";
        }
        // DOB: Must be at least 18 years old
        const birthDate = new Date(data.dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age < 18) {
            errors.dob = "Bạn phải đủ 18 tuổi.";
        }
        
        return errors;
    };
    
    const transformFullName = (fullName) => {
        return fullName
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };
    
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError({
            username: null,
            fullName: null,
            email: null,
            password: null,
            phone: null,
            dob: null
        });
        setRegisterData((prev) => ({
            ...prev,
            fullName: transformFullName(prev.fullName),
        }));
        const validationErrors = validateRegisterData(registerData);
        if (Object.keys(validationErrors).length > 0) {
            setValidationError(validationErrors);
            return;
        }
        // Proceed with registration logic

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
            setRegisterData({ username: "", password: "", fullName: "", email: "", phone: "", dob: "" });
            setIsRegisterOpen(false);
            toast.success("Đăng ký thành công");
            setIsLoginOpen(true);
        } else {
            toast.error("Đăng ký tài khoản không thành công!");
        }
    };

    const navItems = [
        { path: "/", label: "Home" },
        { path: "/about", label: "About Us" },
        { path: "/service", label: "Service" },
        { path: "/blog", label: "Blog" },
        { path: "/SkinTest", label: "Skin test" },
    ];

    if (user && user.auth === true) {
        navItems.push(
            { path: "/your-booking", label: "Booking" },
            // { path: "/feedback", label: "Feedback" },
            {  path: "/schedule", label:"Schedule"}
        );
    }


    return (
        <motion.header
            className={`fixed top-0 left-0 w-full flex justify-between items-center p-4 transition-all duration-300 z-50 ${isScrolled
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
                        className={isScrolled ? "text-white" : "text-black"}
                    />
                ) : (
                    <FaBars
                        className={isScrolled ? "text-white" : "text-white"}
                    />
                )}
            </button>

            {/* Desktop Navigation - FIXED */}
            <nav className="hidden lg:flex flex-1 justify-center">
                <ul className="flex space-x-10 text-lg relative">
                    {/* Single underline element that will animate between positions */}
                    <motion.div
                        className="absolute bottom-0 h-0.5 bg-[#f398d0]"
                        layoutId="nav-underline"
                        animate={{
                            width: document.getElementById(`nav-item-${location.pathname}`)?.offsetWidth || 0,
                            left: document.getElementById(`nav-item-${location.pathname}`)?.offsetLeft || 0,
                        }}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                    {navItems.map((item) => (
                        <motion.li
                            key={`desktop-${item.path}`}
                            id={`nav-item-${item.path}`}
                            whileHover={{ scale: 1.1 }}
                        >
                            <Link
                                to={item.path}
                                className={`relative px-3 py-2 transition-colors duration-300 ${location.pathname === item.path
                                    ? "text-[#f398d0] font-semibold"
                                    : isScrolled
                                        ? "text-black"
                                        : "text-white"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        </motion.li>
                    ))}
                </ul>
            </nav>

            {/* Mobile Navigate */}
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
                                        key={`mobile-${item.path}`}
                                        id={`mobile-item-${item.path}`}
                                        whileHover={{ x: 10 }}
                                        className="border-b border-gray-100 py-2"
                                    >
                                        <Link
                                            to={item.path}
                                            className={`block text-lg ${location.pathname === item.path
                                                ? "text-[#f398d0] font-semibold"
                                                : "text-gray-800"
                                                }`}
                                        >
                                            {item.label}
                                        </Link>
                                    </motion.li>
                                ))}
                                {(user && user.auth === true) ?
                                    (
                                        <>
                                            <motion.li
                                                key="mobile-notification"
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
                                                    Thông báo
                                                </button>
                                            </motion.li>
                                            <motion.li
                                                key="mobile-account"
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
                                                    Tài Khoản
                                                </button>
                                            </motion.li>
                                        </>
                                    )
                                    : (
                                        <>
                                            <motion.li
                                                key="mobile-login-btn"
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
                                                key="mobile-register-btn"
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
                                    )
                                }
                            </ul>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop Auth Buttons */}
           <div className="hidden lg:flex items-center space-x-6 mr-10">
      {user && user.auth === true ? (
        <motion.div
          className="flex items-center space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* User Dropdown */}
          <motion.div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              className={`text-3xl text-white p-2 transition-colors ${
                isScrolled ? "" : "text-white"
              } group-hover:text-[#f398d0]`}
              onClick={() => setIsOpen(!isOpen)}
            >
              <FaUserEdit />
            </motion.button>

            {isOpen && (
              <motion.div
                className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg p-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {/* Account Link */}
                <motion.button
                  className="block w-full text-left px-4 py-2 text-[#f398d0] hover:text-[#ee8874] transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                <NavLink to="/Profile">
                    Tài Khoản
                </NavLink>
                </motion.button>

                {/* Logout Button */}
                <motion.button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-[#f398d0] hover:text-[#ee8874] transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  Đăng xuất
                </motion.button>
              </motion.div>
            )}
          </motion.div>

          {/* Notifications Button */}
          <motion.button
            className={`text-3xl text-white p-2 transition-colors ${
                isScrolled ? "" : "text-white"
              } group-hover:text-[#f398d0]`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Link to="/Notification">
              <FaBell />
            </Link>
          </motion.button>
        </motion.div>
      ) : (
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={() => setIsLoginOpen(true)}
            className={`px-4 py-2 rounded-full ${
              isScrolled ? "text-black hover:text-[#f398d0]" : "text-white hover:text-[#f398d0]"
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
              isScrolled ? "text-black hover:text-[#f398d0]" : "text-white hover:text-[#f398d0]"
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
                {isLoginOpen && <LoginModal
                    // isOpen={isLoginOpen}
                    setIsLoginOpen={setIsLoginOpen}
                    setIsRegisterOpen={setIsRegisterOpen}
                    handleLogin={handleLogin}
                    handleLoginChange={handleLoginChange}
                    loginData={loginData}
                    error={error}
                />}
                {isRegisterOpen && <RegisterModal
                    // isOpen={isRegisterOpen}
                    setIsRegisterOpen={setIsRegisterOpen}
                    setIsLoginOpen={setIsLoginOpen}
                    handleRegister={handleRegister}
                    handleRegisterChange={handleRegisterChange}
                    registerData={registerData}
                    error={error}
                    validationError={validationError}
                />}
            </AnimatePresence>
        </motion.header >
    );
}