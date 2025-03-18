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

const getUserBookings = async (): Promise<Booking[] | null> => {
    const response = await axios.get(`/booking/my-bookings`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
    if (response.content) {
        console.log(response.content);
        return response.content;
    } else {
        return null;
    }
};



export { getUserBookings };


