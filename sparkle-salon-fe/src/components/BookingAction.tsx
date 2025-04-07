import { motion } from "framer-motion";
import { FaMoneyBillAlt, FaTrash, FaRedo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { checkInCash } from "../data/staffData";
import { toast } from "react-toastify";
import { cancelBooking, getUrlPayment, Booking } from "../data/userData";
import React, { useState } from "react";
import CheckingModal from "./CheckingModal";

// Define a more specific type for the booking object

interface BookingActionProps {
  isStaff: boolean;
  booking: Booking;
  setReload(check: boolean): void;
  reload: boolean;
  reBook: boolean
  setIsOpen(check: boolean): void;
}

export default function BookingAction({ isStaff, booking, setReload, reload, reBook, setIsOpen }: BookingActionProps) {
  const navigate = useNavigate();
  const [checkingOpen, setCheckingOpen] = useState(false);
  console.log("rebook", reBook);
  const handleRebook = React.useCallback((serviceId: number) => {
    navigate(`/booking?service=${serviceId}`);
  }, [navigate]);

  const handleSessionBooking = React.useCallback((bookingId: number) => {
    navigate(`/bookingSession?booking=${bookingId}`);
  }, [navigate]);

  const handleCancelBooking = React.useCallback(async (id: string | number) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn huỷ lịch hẹn này?"
    );
    if (confirmDelete) {
      try {
        const response = await cancelBooking(String(id));
        toast.success(response);
        setReload(!reload)
      } catch (error) {
        toast.error("Không thể hủy lịch hẹn. Vui lòng thử lại.");
      }
    }
  }, []);

  const handleChecking = React.useCallback(async (booking: Booking) => {
    try {
      const rq = await checkInCash(Number(booking.id), "PAID", "CASH", null); 
      console.log("request", rq);
      toast.success(rq.message || "Check-in successful"); 
      setReload(!reload);
    } catch (error) {
      console.error(error); 
      toast.error("Không thể check-in. Vui lòng thử lại.");
    }
  }, [reload]);

  const handleCard = React.useCallback(async (booking: Booking) => {
    try {
      if (booking.url) {
        toast.success("Đang chuyển hướng đến trang thanh toán...");
        window.open(booking.url, "_self");
        return;
      }

      const response = await getUrlPayment(booking.id);
      if (response && response.url) {
        toast.success("Đang chuyển hướng đến trang thanh toán...");
        window.open(response.url, "_self");
      } else {
        toast.error("Không thể tạo liên kết thanh toán.");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.");
    }
  }, []);

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <>
      {isStaff ? (
        <>
          {booking.paymentStatus === "PENDING" &&
            booking.paymentMethod === "Thanh toán trực tiếp" && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setCheckingOpen(true);
                  handleChecking(booking);
                }}
                className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 flex items-center gap-1"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <FaMoneyBillAlt size={14} /> Thanh toán
              </motion.button>
            )}
        </>
      ) : (
        <>
          {(booking.status === "ON_GOING" || booking.status === "PENDING") && booking.sessionRemain && reBook && booking.sessionRemain > 0 && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setIsOpen(true);
              }}
              className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 flex items-center gap-1"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Đặt lịch
            </motion.button>
          )}

          {booking.status === "PENDING" && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleCancelBooking(booking.id);
              }}
              className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 flex items-center gap-1"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <FaTrash size={14} /> Hủy
            </motion.button>
          )}

          {(booking.status === "COMPLETED" || booking.status === "IS_CANCELED") && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                booking.serviceId && handleRebook(booking.serviceId);
              }}
              className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 flex items-center gap-1"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <FaRedo size={14} /> Đặt lại
            </motion.button>
          )}

          {booking.status === "PENDING" &&
            booking.paymentMethod === "Thanh toán qua thẻ ngân hàng" && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  handleCard(booking);
                }}
                className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 flex items-center gap-1"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <FaMoneyBillAlt size={14} /> Thanh toán
              </motion.button>
            )}
        </>
      )}
      {checkingOpen && (
        <CheckingModal
          bookingId={Number(booking.id)}
          isOpen={checkingOpen}
          setIsOpen={setCheckingOpen}
          setReload ={setReload}
          reload = {reload}
        />
      )}
    </>
  );
}