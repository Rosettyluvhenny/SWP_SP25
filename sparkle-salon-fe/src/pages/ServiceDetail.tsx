import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import servicesData, { Service } from "../data/servicesData";
import { FaClock, FaStar, FaMoneyBill } from "react-icons/fa";

export default function ServiceDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [service, setService] = useState<Service | null>(null);
    const [feedbacks, setFeedbacks] = useState([
        { name: "Lan Pham", rating: 5, comment: "Dịch vụ tuyệt vời!", date: "12/02/2025" },
        { name: "Minh Nguyen", rating: 4, comment: "Rất hài lòng với chất lượng!", date: "10/02/2025" },
    ]);
    const [newFeedback, setNewFeedback] = useState({ name: "", rating: 5, comment: "" });

    useEffect(() => {
        const foundService = servicesData.find((s) => s.id === Number(id));
        setService(foundService || null);
    }, [id]);

    if (!service) {
        return (
            <p className="text-center mt-10 text-xl text-red-500 font-semibold">
                Dịch vụ không tồn tại...
            </p>
        );
    }

    const handleBooking = () => {
        navigate("/contact", { state: { selectedService: service.name } });
    };

    const handleFeedbackSubmit = () => {
        if (newFeedback.name && newFeedback.comment) {
            setFeedbacks([...feedbacks, { ...newFeedback, date: new Date().toLocaleDateString() }]);
            setNewFeedback({ name: "", rating: 5, comment: "" });
        }
    };

    return (
        <div className="bg-pink-50 mt-24">
            <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-8 bg-pink-100">
                <div className="lg:col-span-3 space-y-6">
                    {/* Top Section */}
                    <div className="bg-white shadow-md p-6 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6">
                        <img
                            src={service.img}
                            alt={service.name}
                            className="w-full h-70 object-cover rounded-lg border border-pink-900"
                        />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {service.name}
                            </h1>
                            <p className="text-pink-500 text-lg font-semibold mt-1">
                                <FaMoneyBill className="inline-block" />{" "}
                                {service.price.toLocaleString()} vnđ (Đã bao gồm VAT)
                            </p>
                            <p className="flex items-center text-gray-600 mt-2">
                                <FaClock className="mr-2 text-black" />{" "}
                                {service.duration}
                                <span className="mx-4">|</span>
                                <FaStar className="mr-1 text-yellow-500" />{" "}
                                {service.popularity}
                            </p>
                            <button
                                className="bg-pink-500 hover:bg-pink-600 text-white py-3 px-6 rounded-lg mt-28 text-lg font-semibold shadow-md transition"
                                onClick={handleBooking}
                            >
                                Đặt hẹn ngay
                            </button>
                        </div>
                    </div>

                    {/* Desciption Section */}
                    <div className="bg-white shadow-md p-6 rounded-lg">
                        <h2 className="text-xl font-semibold border-b pb-2">
                            Thông tin dịch vụ
                        </h2>
                        <p className="mt-3 text-gray-700 leading-relaxed">
                            {service.description}
                        </p>
                    </div>

                    {/* Feedback Section */}
                    <div className="bg-white shadow-md p-6 rounded-lg">
                        <h2 className="text-3xl font-semibold border-b pb-2 text-pink-500">Đánh giá</h2>
                        <div className="mt-3 space-y-4">
                            {feedbacks.map((fb, index) => (
                                <div key={index} className="border-b pb-2">
                                    <p className="font-semibold">{fb.name} - {fb.date}</p>
                                    <p className="text-yellow-500">{"⭐".repeat(fb.rating)}</p>
                                    <p className="text-gray-700">{fb.comment}</p>
                                </div>
                            ))}
                        </div>

                        {/* Feedback Form */}
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold">Gửi đánh giá của bạn</h3>
                            <input
                                type="text"
                                placeholder="Tên của bạn"
                                value={newFeedback.name}
                                onChange={(e) => setNewFeedback({ ...newFeedback, name: e.target.value })}
                                className="border p-2 w-full mt-2 rounded bg-gray-100"
                            />
                            <select
                                value={newFeedback.rating}
                                onChange={(e) => setNewFeedback({ ...newFeedback, rating: Number(e.target.value) })}
                                className="border p-2 w-full mt-2 rounded bg-gray-100"
                            >
                                {[5, 4, 3, 2, 1].map((star) => (
                                    <option key={star} value={star}>{"⭐".repeat(star)}</option>
                                ))}
                            </select>
                            <textarea
                                placeholder="Nhận xét của bạn"
                                value={newFeedback.comment}
                                onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value })}
                                className="border p-2 w-full mt-2 rounded h-24 bg-gray-100"
                            ></textarea>
                            <button
                                onClick={handleFeedbackSubmit}
                                className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded mt-3"
                            >
                                Gửi đánh giá
                            </button>
                        </div>
                    </div>
                </div>

                {/*Sidebar Section */}
                <aside className="space-y-6">
                    <div className="bg-white shadow-md p-4 rounded-lg">
                        <h3 className="text-lg font-bold border-b pb-2">
                            Dịch vụ khác
                        </h3>
                        {servicesData
                            .filter((related) => related.id !== service.id)
                            .slice(0, 10)
                            .map((related) => (
                                <Link
                                    to={`/service/${related.id}`}
                                    key={related.id}
                                    className="block mt-4 hover:bg-gray-100 p-2 rounded-md transition"
                                >
                                    <div className="flex gap-4">
                                        <img
                                            src={related.img}
                                            alt={related.name}
                                            className="w-16 h-16 rounded object-cover"
                                        />
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {related.name}
                                            </p>
                                            <p className="text-pink-500 font-medium">
                                                {related.price.toLocaleString()} đ
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                    </div>
                </aside>
            </div>
        </div>
    );
}
