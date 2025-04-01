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
     

    </motion.tr>
  );
};

export default BookingTableRow;