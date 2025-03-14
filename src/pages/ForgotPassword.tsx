import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleResetPassword = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email) {
            setMessage("Vui lòng nhập email của bạn!.");
            return;
        }
        
        //todo: đợi backend xử lý api gửi email reset password
        setMessage("Email có tồn tại, vui lòng đợi hệ thống gửi mã reset mật khẩu.");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-pink-200">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800">Quên Mật Khẩu</h2>
                <p className="text-gray-600 text-center mt-2">Vui Lòng nhập Email để lấy lại.</p>
                
                <form onSubmit={handleResetPassword} className="mt-4">
                    <label className="block text-gray-700"></label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none text-gray-800 bg-white"
                        placeholder="Nhập email của bạn"
                    />
                    <button
                        type="submit"
                        className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
                    >
                        Gửi mã reset
                    </button>
                </form>

                {message && <p className="mt-4 text-center text-gray-500">{message}</p>}

                <p className="mt-4 text-center">
                    <Link to="/" className="text-blue-500 hover:underline">Trở về</Link>
                </p>
            </div>
        </div>
    );
}
