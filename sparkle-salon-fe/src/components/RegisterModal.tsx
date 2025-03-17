import { motion } from "framer-motion";

interface RegisterModalProps {
    // isOpen: boolean;
    setIsRegisterOpen: (open: boolean) => void;
    setIsLoginOpen: (open: boolean) => void;
    handleRegister: (e: React.FormEvent) => void;
    handleRegisterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    registerData: {
        username: string;
        fullName: string;
        email: string;
        password: string;
        phone: string;
        dob: string;
    };
    error: string | null;
    validationError: {
        username: string | null, fullName: string | null, email: string | null,
        password: string | null, phone: string | null, dob: string | null
    };
}

const RegisterModal: React.FC<RegisterModalProps> = ({
    // isOpen,
    setIsRegisterOpen,
    setIsLoginOpen,
    handleRegister,
    handleRegisterChange,
    registerData,
    error,
    validationError
}) => {
    // document.body.style.overflow = "hidden";
    return (
        <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 w-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-100 flex flex-col"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
            >
                <div className="bg-gradient-to-r from-[#f398d0] to-[#ee8874] p-4">
                    <h2 className="text-2xl font-bold text-white text-center">
                        Đăng ký tài khoản
                    </h2>
                </div>
                <div className="p-6 flex-1 overflow-auto">
                    <form onSubmit={handleRegister} className="grid grid-cols-2 gap-3">
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
                            <label className="block text-gray-700 mb-2">Tên người dùng</label>
                                <p className="text-red-500 text-sm mb-1">{validationError.username?validationError.username:<br/>}</p>
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
                            <label className="block text-gray-700 mb-2">Họ và tên</label>
                                <p className="text-red-500 text-sm mb-1">{validationError.fullName? validationError.fullName : <br/>}</p>
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
                            <label className="block text-gray-700 mb-2">Email</label>
                                <p className="text-red-500 text-sm mb-1">{validationError.email?validationError.email:<br/>}</p>
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
                            <label className="block text-gray-700 mb-2">Mật khẩu</label>
                                <p className="text-red-500 text-sm mb-1">{validationError.password?validationError.password:<br/>}</p>
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
                            <label className="block text-gray-700 mb-2">Số điện thoại</label>
                                <p className="text-red-500 text-sm mb-1">{validationError.phone?validationError.phone:<br/>}</p>
                            <input
                                type="text"
                                name="phone"
                                value={registerData.phone}
                                onChange={handleRegisterChange}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#f398d0] focus:ring-2 focus:ring-[#f398d0] focus:ring-opacity-50 transition-colors"
                                placeholder="Nhập số điện thoại"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Ngày Tháng Năm Sinh</label>
                                <p className="text-red-500 text-sm mb-1">{validationError.dob?validationError.dob:<br/>}</p>
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
                    {/* <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            
                        </p>
                    </div> */}
                </div>
                <div className="p-4 border-t border-gray-200">
                    <motion.button
                        onClick={() => {setIsRegisterOpen(false)
                            // document.body.style.overflow = "auto";
                        }}
                        className="w-full text-gray-500 hover:text-gray-700 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Đóng
                    </motion.button>
                    <motion.button>
                    Đã có tài khoản?{' '}
                            <button
                                onClick={() => {
                                    setIsRegisterOpen(false);
                                    setIsLoginOpen(true);
                                    // document.body.style.overflow = "auto";
                                }}
                                className="text-[#f398d0] hover:text-[#ee8874] font-semibold transition-colors"
                            >
                                Đăng nhập ngay
                            </button>
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default RegisterModal;