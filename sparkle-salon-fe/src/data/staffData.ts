import axios from "../services/customizedAxios";

export interface Booking {
    id: string;
    serviceId: number;
    serviceName: string;
    img: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    notes: string;
    sessionRemain: number;
    price: number;
}

export interface Session {
    id: string,
    bookingId: number,
    bookingDate: string,
    sessionDateTime: string,
    status: string,
    note: string,
    imgBefore: string,
    imgAfter: string,
    roomId: string,
    roomName: string,
    userId: string,
    userName: string,
    therapistId: string,
    therapistName: string,
    staffId: string,
    staffName: string,
    img: string
    type: string,
}
const getBookings = async (url: string) => {
    const response = await axios.get(`/booking/staff-bookings${url}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    const { content, totalElements, totalPages, number, pageSize, first, last, numberOfElements } = response;
    return {
        bookings: content,
        meta: {
            totalElements,
            totalPages,
            pageNumber: number,
            pageSize,
            first,
            last,
            numberOfElements,
        }
    }
};

const checkInCash = async (id: number, status: string, type: string, img: File | null = null) => {
    const formData = new FormData();
    if (img) {
        formData.append('img', img);
    }

    // Send request to API
    const response = await axios.put(`/booking/${id}/paymentStatus?status=${status}&type=${type}`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "multipart/form-data" 
            }
        });
    return response;
}

export { getBookings, checkInCash }
