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

export const roomsByService = async (serviceId: number)=>{
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(`/rooms/byService/${serviceId}`,{
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

export interface BookingSessionUpdateRequest{
    note: string,
    roomId: number
}
export const updateBookingSession = async (
    sessionId: number,
    bookingSessionRequest: BookingSessionUpdateRequest,
    imgBefore: File,
    imgAfter: File
) => {
    const token = localStorage.getItem("accessToken");
        const formData = new FormData();
        formData.append("data", new Blob([JSON.stringify(bookingSessionRequest)], { type: "application/json" }));
        formData.append("imgBefore", imgBefore);
        formData.append("imgAfter", imgAfter);

        const response = await axios.put(`/bookingSession/${sessionId}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        // console.log("Success:", response.data);
        console.log(response)
        return null;
};
export const updateSessionRoom = async (
    sessionId: number,
    roomId:number
) => {
    const token = localStorage.getItem("accessToken");
    const formData = new FormData();
    
    // Create a data object explicitly
    const dataObject = JSON.stringify({
        roomId: roomId
    });

    // Convert string to Blob
    const dataBlob = new Blob([dataObject], { type: "application/json" });

    // Append the data part
    formData.append("data", dataBlob,);

    console.log("FormData contents:");
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }
        const response = await axios.put(`/bookingSession/${sessionId}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log("Success:", response.data);
        console.log("response",response)
        return null;
};

export const updateSessionStatus = async (
    sessionId: number,
    status: string
) => {
    const token = localStorage.getItem("accessToken");
        const response = await axios.put(`/bookingSession/${sessionId}/status`,
            null,
            {
                params: { status },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        console.log("Success:", response.data);
        console.log("response",response)
        return response;
};