import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cardDetails, setCardDetails] = useState({ name: "", number: "", expiry: "", cvv: "" });
  const [isPaid, setIsPaid] = useState(false);

  const handlePayment = () => {
    if (paymentMethod === "card" && (!cardDetails.name || !cardDetails.number || !cardDetails.expiry || !cardDetails.cvv)) {
      alert("Vui lòng điền đầy đủ thông tin thẻ");
      return;
    }
    setIsPaid(true);
  };

  return (
    <div className="bg-gradient-to-b from-white to-pink-200 min-h-screen p-5">
      {/* Section 1: Title */}
      <h1 className="text-2xl font-bold text-center my-5">Bạn đã đặt lịch thành công, vui lòng chọn phương thức thanh toán</h1>

      {/* Section 2: Service Details */}
      <div className="bg-pink-100 p-5 rounded-lg shadow-lg max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold">Dịch vụ</h2>
        <div className="flex items-center space-x-5 mt-3">
          <img src={bookingDetails.img} alt={bookingDetails.name} className="w-24 h-24 object-cover rounded-lg" />
          <div>
            <p className="text-lg font-bold">{bookingDetails.name}</p>
            <p>Thời gian: {bookingDetails.duration} phút</p>
            <p className="text-pink-600 font-semibold">Giá: {bookingDetails.price?.toLocaleString()} VNĐ</p>
          </div>
        </div>
      </div>

      {/* Section 3: Total Price */}
      <div className="bg-pink-100 p-5 rounded-lg shadow-lg max-w-2xl mx-auto mt-5">
        <h2 className="text-lg font-bold">Tổng tiền phải trả</h2>
        <p className="text-xl font-bold text-pink-600">{bookingDetails.price?.toLocaleString()} VNĐ</p>
      </div>

      {/* Section 4: Payment Method */}
      <div className="bg-pink-100 p-5 rounded-lg shadow-lg max-w-2xl mx-auto mt-5">
        <h2 className="text-lg font-bold">Chọn phương thức thanh toán</h2>
        <label className="block mt-3">
          <input type="radio" name="payment" value="cash" checked={paymentMethod === "cash"} onChange={() => setPaymentMethod("cash")} /> Thanh toán tiền mặt
        </label>
        <label className="block mt-3">
          <input type="radio" name="payment" value="card" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} /> Thẻ
        </label>
      </div>

      {/* Section 4.1: Card Form */}
      {paymentMethod === "card" && (
        <div className="bg-pink-100 p-5 rounded-lg shadow-lg max-w-2xl mx-auto mt-5">
          <h2 className="text-lg font-bold">Nhập thông tin thẻ</h2>
          <input type="text" placeholder="Tên chủ thẻ" className="w-full p-2 mt-2 border rounded" onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })} />
          <input type="text" placeholder="Số thẻ" className="w-full p-2 mt-2 border rounded" onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })} />
          <div className="flex space-x-2 mt-2">
            <input type="text" placeholder="MM/YY" className="w-1/2 p-2 border rounded" onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })} />
            <input type="text" placeholder="CVV" className="w-1/2 p-2 border rounded" onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })} />
          </div>
        </div>
      )}

      {/* Section 5: Buttons */}
      <div className="flex justify-between max-w-2xl mx-auto mt-5">
        <button className="bg-gray-400 text-white px-5 py-2 rounded-lg" onClick={() => navigate("/contact")}>Trở về</button>
        <button className="bg-pink-500 text-white px-5 py-2 rounded-lg" onClick={handlePayment}>Xác nhận thanh toán</button>
      </div>

      {/* Payment Success Popup */}
      {isPaid && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-bold">Bạn đã thanh toán thành công!</h2>
            <button className="bg-pink-500 text-white px-5 py-2 rounded-lg mt-3" onClick={() => navigate("/")}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}
