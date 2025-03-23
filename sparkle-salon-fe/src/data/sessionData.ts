import { toast } from "react-toastify";
import axios from "../services/customizedAxios";

export type SessionBody = {
    bookingId: number,
    sessionDateTime: string,
    note: string,
    therapistId: string
}

export const sessionSchedule = async (sessionBody: SessionBody) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.post(`/bookingSession`, sessionBody,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        } );
        return response.result;
    } catch (error) {
        toast.error(error.response.data.message);
        return null;
    }

}