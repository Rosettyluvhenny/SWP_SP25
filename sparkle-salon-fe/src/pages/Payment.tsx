import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface BookingDetails {
    img: string;
    name: string;
    duration: number;
    price: number;
}

interface CardDetails {
    name: string;
    number: string;
    expiry: string;
    cvv: string;
}

export default function Payment() {
    const location = useLocation();
    const navigate = useNavigate();
    const bookingDetails: BookingDetails = location.state as BookingDetails;

    const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
    const [cardDetails, setCardDetails] = useState<CardDetails>({
        name: "",
        number: "",
        expiry: "",
        cvv: "",
    });
    const [errors, setErrors] = useState<Partial<CardDetails>>({});
    const [isPaid, setIsPaid] = useState(false);

    useEffect(() => {
        const savedCard = localStorage.getItem("savedCard");
        if (savedCard) {
            try {
                const parsedCard: CardDetails = JSON.parse(savedCard);
                setCardDetails(parsedCard);
            } catch (error) {
                console.error("Error parsing saved card:", error);
            }
        }
    }, []);

    {/* Validate Card  */}
    const validateCard = (): boolean => {
        const newErrors: Partial<CardDetails> = {}; 

        if (!cardDetails.name) newErrors.name = "Nhập tên chủ thẻ";
        if (!/^\d{16}$/.test(cardDetails.number))
            newErrors.number = "Số thẻ không hợp lệ (16 số)";
        if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry))
            newErrors.expiry = "MM/YY không hợp lệ";
        if (!/^\d{3}$/.test(cardDetails.cvv))
            newErrors.cvv = "CVV không hợp lệ (3 số)";

        setErrors(newErrors); 
        return Object.keys(newErrors).length === 0;
    };

    const handlePayment = () => {
        if (paymentMethod === "card" && !validateCard()) return;
        if (paymentMethod === "card")
            localStorage.setItem("savedCard", JSON.stringify(cardDetails));
        setIsPaid(true);
        setTimeout(() => navigate("/"), 3000);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-pink-100 to-pink-200 p-6">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-center mb-6"
            >
                Xác nhận thanh toán
            </motion.h1>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-pink-100 p-6 rounded-lg shadow-xl w-full max-w-3xl"
            >
                {/* Service Details */}
                <div className="bg-pink-200 p-4 rounded-lg">
                    <h2 className="text-xl font-semibold">Dịch vụ của bạn</h2>
                    <div className="flex items-center space-x-4 mt-3">
                        <img
                            src={bookingDetails?.img}
                            alt={bookingDetails?.name}
                            className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div>
                            <p className="text-lg font-bold">
                                {bookingDetails?.name}
                            </p>
                            <p>⏳ Thời gian: {bookingDetails?.duration} phút</p>
                            <p className="text-pink-600 font-semibold">
                                💰 Giá:{" "}
                                {bookingDetails?.price?.toLocaleString()} VNĐ
                            </p>
                        </div>
                    </div>
                </div>

                {/* Total Price */}
                <div className="bg-pink-100 p-4 rounded-lg mt-4">
                    <h2 className="text-lg font-bold">Tổng tiền:</h2>
                    <p className="text-2xl font-bold text-pink-600">
                        {bookingDetails?.price?.toLocaleString()} VNĐ
                    </p>
                </div>

                {/* Payment Method Selection */}
                <div className="bg-pink-100 p-4 rounded-lg mt-4">
                    <h2 className="text-lg font-bold mb-2">
                        Chọn phương thức thanh toán
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        {["cash", "card"].map((method) => (
                            <button
                                key={method}
                                className={`p-4 rounded-lg border-2 flex items-center justify-center text-lg font-bold ${
                                    paymentMethod === method
                                        ? "border-pink-500 bg-pink-200"
                                        : "border-gray-300"
                                }`}
                                onClick={() =>
                                    setPaymentMethod(method as "cash" | "card")
                                }
                            >
                                {method === "cash"
                                    ? "💰 Tiền mặt"
                                    : "💳 Thẻ ngân hàng"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Card Details */}
                <AnimatePresence>
                    {paymentMethod === "card" && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-pink-100 p-4 rounded-lg mt-4"
                        >
                            <h2 className="text-lg font-bold">Thông tin thẻ</h2>
                            {["name", "number", "expiry", "cvv"].map(
                                (field) => (
                                    <input
                                        key={field}
                                        type="text"
                                        placeholder={
                                            field === "name"
                                                ? "Tên chủ thẻ"
                                                : field === "number"
                                                ? "Số thẻ (16 số)"
                                                : field === "expiry"
                                                ? "MM/YY"
                                                : "CVV"
                                        }
                                        className={`w-full p-3 mt-3 border rounded-lg ${
                                            errors[field as keyof CardDetails]
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                        onChange={(e) =>
                                            setCardDetails({
                                                ...cardDetails,
                                                [field]: e.target.value,
                                            })
                                        }
                                        value={
                                            cardDetails[
                                                field as keyof CardDetails
                                            ]
                                        }
                                    />
                                )
                            )}
                            {Object.values(errors).map((err, i) => (
                                <p
                                    key={i}
                                    className="text-red-500 text-sm mt-1"
                                >
                                    ⚠ {err}
                                </p>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Buttons */}
                <div className="flex justify-between mt-6">
                    <button
                        className="bg-gray-400 text-white px-6 py-3 rounded-lg text-lg"
                        onClick={() => navigate("/contact")}
                    >
                        🔙 Trở về
                    </button>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg text-lg shadow-md transition duration-300"
                        onClick={handlePayment}
                    >
                        ✅ Xác nhận thanh toán
                    </motion.button>
                </div>
            </motion.div>

            {/* Payment Success Popup */}
            <AnimatePresence>
                {isPaid && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="bg-white p-6 rounded-lg shadow-lg text-center"
                        >
                            <h2 className="text-lg font-bold">
                                🎉 Thanh toán thành công!
                            </h2>
                            <button
                                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg mt-3 text-lg"
                                onClick={() => navigate("/")}
                            >
                                OK
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
