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
        console.error("Failed to book service:", error);
        return null;
    }

}