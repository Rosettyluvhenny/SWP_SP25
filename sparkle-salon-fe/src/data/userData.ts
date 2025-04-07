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
    totalSession: number;
    url: string;
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
    feedBackTime: string;
}
const getUserBookings = async (url: string) => {
    const response = await axios.get(`/booking/my-bookings${url}`, {
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

const getBookingById = async (id: string): Promise<Booking | null> => {
    const response = await axios.get(`/booking/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    if (response) {
        return response;
    } else {
        return null;
    }
}

const cancelBooking = async (id: string) => {
    const response = await axios.put(`/booking/cancel/${id}`, {}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    });
    console.log(response);
    if (response) {
        return response.message;
    } else {
        return null;
    }
}

const getAllSession = async (url: string) => {
    const response = await axios.get(`/booking/my-bookings${url}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    if (response.content) {
        // console.log(response.content);
        return response.content;
    } else {
        return null;
    }
}

const getMySession = async (url: string) => {
    const response = await axios.get(`/bookingSession/mySession${url}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    const { content, totalPages } = response.result;
    return {
        sessions: content,
        meta: {
            totalPages: totalPages
        }
    }
}
const cancelMySession = async (id: number) => {
    const response = await axios.put(`/bookingSession/${id}/cancel`, {}, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    if (response) {
        // console.log(response.content);
        return response;
    } else {
        return null;
    }
}

const getSessionById = async (id: number) => {
    const response = await axios.get(`/bookingSession/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    if (response.result) {
        return response.result;
    } else {
        return null;
    }
}

const getSessionByBookingId = async (id: number) => {
    const response = await axios.get(`/bookingSession/booking/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    });
    if (response.result) {
        return response.result;
    } else {
        return null;
    }
}
const getUrlPayment = async (id: number) => {
    const response = await axios.get(`/booking/payment/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    });
    if (response.result) {
        return response.result;
    } else {
        return null;
    }
}
export { getUrlPayment, getSessionByBookingId, Session, getSessionById, cancelMySession, getUserBookings, getBookingById, cancelBooking, getAllSession, getMySession };


