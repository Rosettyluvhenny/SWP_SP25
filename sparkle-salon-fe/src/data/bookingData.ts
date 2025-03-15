import axios from "axios";

export type BookingBody = {
    userId: string;
    serviceId: number;
    paymentId: number;
    bookingTime: string;
    notes: string;
    therapistId?: string | null;
    url?: string | null;
}
export const bookingService = async (bookingBody: BookingBody) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.post(`http://localhost:8081/swp/booking`, bookingBody,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        } );
        return response.data;
    } catch (error) {
        console.error("Failed to book service:", error);
        return null;
    }

}





