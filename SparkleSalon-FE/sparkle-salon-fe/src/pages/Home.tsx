import { useState } from "react";

export default function Home() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[url('/assets/home-banner.jpg')] bg-cover bg-center bg-no-repeat">
            {/* Header */}
            <header className="absolute top-4 right-4">
                <button
                    onClick={() => setIsLoginOpen(true)}
                    className=" bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                >
                    Login
                </button>
                <button
                    onClick={() => setIsRegisterOpen(true)}
                    className=" bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                >
                    Register
                </button>
            </header>
            <div className="z-10 text-start text-white">
                {/* Hero Section */}
                <h1 className="text-6xl font-bold leading-tight">
                    Sparkle Salon
                </h1>
                <p className="mt-2 text-lg text-gray-300">
                    Salon hàng đầu về trị liệu da
                </p>

                {/* Call to Action Button */}
                <button className="mt-6 bg-[#f8a89c] hover:bg-[#f6a18f] text-white px-6 py-3 rounded-lg font-semibold text-lg">
                    Đặt lịch ngay →
                </button>
            </div>

            {/* Login Modal */}
            {isLoginOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold text-center text-gray-800">
                            Login
                        </h2>

                        <form className="mt-4">
                            <div>
                                <label className="block text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                                />
                            </div>
                            <div className="mt-4">
                                <label className="block text-gray-700">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
                            >
                                Login
                            </button>
                        </form>

                        {/* Switch to Register */}
                        <p className="mt-4 text-center text-gray-500">
                            Don't have an account?{" "}
                            <button
                                onClick={() => {
                                    setIsLoginOpen(false);
                                    setIsRegisterOpen(true);
                                }}
                                className="text-blue-500 hover:underline"
                            >
                                Register
                            </button>
                        </p>

                        {/* Close Button */}
                        <button
                            onClick={() => setIsLoginOpen(false)}
                            className="mt-4 w-full text-center text-red-500 hover:text-red-900"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Register Modal */}
            {isRegisterOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold text-center text-gray-800">
                            Register
                        </h2>

                        <form className="mt-4">
                            <div>
                                <label className="block text-gray-700">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                                />
                            </div>
                            <div className="mt-4">
                                <label className="block text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                                />
                            </div>
                            <div className="mt-4">
                                <label className="block text-gray-700">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
                            >
                                Register
                            </button>
                        </form>

                        {/* Switch to Login */}
                        <p className="mt-4 text-center text-gray-500">
                            Already have an account?{" "}
                            <button
                                onClick={() => {
                                    setIsRegisterOpen(false);
                                    setIsLoginOpen(true);
                                }}
                                className="text-blue-500 hover:underline"
                            >
                                Login
                            </button>
                        </p>

                        {/* Close Button */}
                        <button
                            onClick={() => setIsRegisterOpen(false)}
                            className="mt-4 w-full text-center text-red-500 hover:text-red-900"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
