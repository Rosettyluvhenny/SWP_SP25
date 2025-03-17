import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface LoginModalProps {
    // isOpen: boolean;
    setIsLoginOpen: (open: boolean) => void;
    setIsRegisterOpen: (open: boolean) => void;
    handleLogin: (e: React.FormEvent) => void;
    handleLoginChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    loginData: { username: string; password: string };
    error: string | null;
}

const LoginModal: React.FC<LoginModalProps> = ({
    // isOpen,
    setIsLoginOpen,
    setIsRegisterOpen,
    handleLogin,
    handleLoginChange,
    loginData,
    error,
}) => {
    // if (!isOpen) return null;

    return (
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
                            className="w-full bg-gradient-to-r from-[#f398d0] to-[#ee8874] text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                            disabled={!loginData.username || !loginData.password}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Đăng nhập
                        </motion.button>
                    </form>
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
    );
};

export default LoginModal;
