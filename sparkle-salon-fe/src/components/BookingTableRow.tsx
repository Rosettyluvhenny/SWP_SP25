import React from 'react';
import { motion } from 'framer-motion';
import { FaTrash, FaRedo, FaMoneyBillAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface BookingTableRowProps {
  isStaff: boolean;
  booking: any;
  getStatusColor: (status: string) => string;
  handleSessionBooking: (bookingId: number) => void;
  handleCancelBooking: (id: string) => void;
  handleRebook: (serviceId: number) => void;
  handleCard: (booking: any) => void;
  handleCheckin: (booking: any) => void
}

const BookingTableRow: React.FC<BookingTableRowProps> = ({
  isStaff,
  booking,
  getStatusColor,
  handleSessionBooking,
  handleCancelBooking,
  handleRebook,
  handleCard,
  handleCheckin
}) => {
  const navigate = useNavigate();

  return (
    <motion.tr
      className="border-t hover:bg-pink-50 transition-colors"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      onClick={(e) => {
        e.stopPropagation();
        const link =isStaff? `/staff/bookingDetail/${booking.id}` :`/bookingDetail/${booking.id}`;
        navigate(link);
      }}
    >
      <td className="p-3 font-medium">{booking.id}</td>
      <td className="p-3 font-medium">{booking.serviceName}</td>
      <td className="p-3 font-medium">
        <img
          src={booking.img}
          alt={booking.serviceName}
          className="w-auto h-16"
        />
      </td>
      <td className="p-3">{booking.price}</td>
      <td className="p-3">{booking.sessionRemain}</td>
      <td className="p-3">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status) || ""
            }`}
        >
          {booking.status}
        </span>
      </td>
      <td className="p-3">{booking.paymentMethod}</td>
      <td className="p-3">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status) || ""
            }`}
        >
          {booking.paymentStatus}
        </span>
      </td>
     
      {/* <td className="p-3 flex space-x-2">
      {isStaff?
      <>
       {booking.paymentStatus === "PENDING"&&
          booking.paymentMethod === "Trả bằng tiền mặt" && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleCheckin(booking);
              }}
              className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 flex items-center gap-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaMoneyBillAlt size={14} /> Checkin
            </motion.button>
          )}
      </>
      :
      <>
        {booking.status === "ON_GOING" && booking.sessionRemain > 0 && (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleSessionBooking(booking.id);
            }}
            className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 flex items-center gap-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaTrash size={14} /> Hủy
          </motion.button>
        )}
        {(booking.status === "COMPLETED" || booking.status === "IS_CANCELED") && (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleRebook(booking.serviceId);
            }}
            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 flex items-center gap-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaMoneyBillAlt size={14} /> Thanh toán
            </motion.button>
          )}
      </>
      }
      </td> */}
     

    </motion.tr>
  );
};

export default BookingTableRow;