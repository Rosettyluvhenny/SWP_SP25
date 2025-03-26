import { FaCreditCard, FaCalendarAlt, FaMoneyBillWave, FaClipboardList } from "react-icons/fa";

// Define a comprehensive interface for the booking object
interface Booking {
  id: string | number;
  serviceName: string;
  img?: string;
  price: number;
  paymentStatus: 'PAID' | 'PENDING' | 'CANCELLED' | string;
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED' | 'ON_GOING' | string;
  paymentMethod?: string;
  sessionRemain?: number;
  notes?: string;
}

interface BookingInfoProps {
  booking: Booking;
}

export function BookingInfo({ booking }: BookingInfoProps) {
  // Utility function to get status color based on payment or booking status
  const getStatusColor = (status: string): string => {
    const normalizedStatus = status.toUpperCase();
    switch (normalizedStatus) {
      case 'PAID':
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Placeholder image in case no image is provided

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header with service name */}
      <div className="p-6 border-b border-gray-200 mt-16">
        <h2 className="text-2xl font-bold text-gray-800">
          {booking.serviceName || 'Unnamed Service'}
        </h2>
        <p className="text-sm text-gray-500">ID: {booking.id}</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Service image */}
          <div className="mb-6 md:mb-0">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
              <img 
                src={booking.img|| ""} 
                alt={booking.serviceName || 'Service Image'} 
                className="w-full h-64 object-cover rounded-lg" 
              />
            </div>
          </div>

          {/* Booking details */}
          <div className="flex flex-col justify-between">
            {/* Price */}
            <div className="mb-4 p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-700 font-medium">Giá dịch vụ</p>
              <p className="text-2xl font-bold text-purple-900">
                {booking.price ? `${booking.price.toLocaleString()} VND` : 'N/A'}
              </p>
            </div>

            {/* Status badges */}
            <div className="mb-4 flex flex-wrap gap-3">
              <span 
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.paymentStatus || '')}`}
              >
                <FaCreditCard className="mr-1" /> {booking.paymentStatus || 'Unknown'}
              </span>
              <span 
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status || '')}`}
              >
                <FaCalendarAlt className="mr-1" /> {booking.status || 'Unknown'}
              </span>
            </div>

            {/* Payment and sessions info */}
            <div className="mb-4 space-y-2">
              <div className="flex items-center text-gray-700">
                <FaMoneyBillWave className="mr-2 text-purple-600" />
                <span className="font-medium">Phương thức thanh toán:</span>
                <span className="ml-2">{booking.paymentMethod || 'Chưa xác định'}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <FaCalendarAlt className="mr-2 text-purple-600" />
                <span className="font-medium">Số buổi còn lại:</span>
                <span className="ml-2">{booking.sessionRemain ?? 'N/A'}</span>
              </div>
            </div>

            {/* Notes */}
            {booking.notes && (
              <div className="mb-4">
                <div className="flex items-start">
                  <FaClipboardList className="mr-2 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-medium text-gray-700">Ghi chú:</h3>
                    <p className="text-gray-600 mt-1">{booking.notes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}