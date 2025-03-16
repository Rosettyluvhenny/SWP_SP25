import axios from "axios";

export interface Booking {
    id: string;
    serviceName: string;
    img: string;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    notes: string;
    sessionRemain: number;
    price: number;
}

const getUserBookings = async (): Promise<Booking[] | null> => {
    const response = await axios.get(`http://localhost:8081/swp/booking/my-bookings`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    if (response.status === 200) {
        return response.data.content;
    } else {
        return null;
    }
};

export { getUserBookings };


