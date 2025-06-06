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
    const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("data", new Blob([JSON.stringify(bookingSessionRequest)], { type: "application/json" }));
        formData.append("imgBefore", imgBefore);
        formData.append("imgAfter", imgAfter);
        try{
            const response = await axios.put(`/bookingSession/${sessionId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success(response.message);
            return response;
        }catch(err){
            toast.error(err.message);
        }
};

export const getTherapistSessions = async (startDate?: string, endDate?: string) => {
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token") || sessionStorage.getItem("accessToken");
    
    if (!token) {
        console.error("No authentication token found");
        toast.error("Please log in again");
        return null;
    }

    try {
        const response = await axios.get(`/bookingSession/therapist`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                startDate,
                endDate
            }
        });
        return response.result;
    } catch (error: any) {
        if (error.response && error.response.status === 401) {
            toast.error("Unauthorized. Please log in again.");
        } else {
            toast.error("Error fetching therapist sessions");
        }
        console.error("Session fetch error:", error);
        return null;
    }
}

export const cancelSession = async (
    sessionId: number,
    message: string
) => {
    const status = "IS_CANCELED";
    const token = localStorage.getItem("token");
    const response = await axios.put(`/bookingSession/${sessionId}/status`,
        {
            message: `${message}`,
            status: `${status}`
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    console.log("Success:", response.data);
    console.log("response",response)
    return null;
}
export const updateSessionRoom = async (
    sessionId: number,
    roomId:number
) => {
    const token = localStorage.getItem("token");
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
    const token = localStorage.getItem("token");
        const response = await axios.put(`/bookingSession/${sessionId}/status`,
            { status : `${status}` },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if(response.status === 400){
            toast.error(response.message);
        }
        return response;
};

export const getAll = async (url: string) =>{
    const token = localStorage.getItem("token");
    const response = await axios.get(`/bookingSession${url}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.result;
}