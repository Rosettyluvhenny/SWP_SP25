import axios from "../services/customizedAxios";

export interface Feedback {
    bookingSessionId: number,
    rating: number,
    feedbackText : String
}

const getFeedbackByServiceId = async (serviceId: number) => {

        const response = await axios.get(`/feedback/serviceId/${serviceId}`);

        if (response.result) {
            return response.result;
        }
        
};

const getUserFeedbacks = async (): Promise<Feedback[]> => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No token found");
        return [];
    }

    const response = await axios.get(`/feedback/user-feedback`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    // if (response.result) {
    console.log(response)
    return response.result;
    // }


};

const getFeedbackById = async (feedbackId: string | null): Promise<Feedback | null> => {
    if (!feedbackId) {
        return null;
    }

    try {
        const response = await axios.get(`/feedback/${feedbackId}`);
        if (response.status === 200 && response.result) {
            return response.result;
        }
        return null;
    } catch (error) {
        console.error(`Error fetching feedback with ID ${feedbackId}:`, error);
        return null;
    }
};

const createFeedback = async (feedback: Feedback): Promise<boolean> => {
    const token = localStorage.getItem("token");
        const response = await axios.post("/feedback", feedback,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            } 
        );
        
        return response.result;
};

const updateFeedbackById = async (feedbackId: string | number | null, feedback: Feedback): Promise<boolean> => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No token found");
        return false;
    }

        const response = await axios.put(`/feedback/${feedbackId}`, feedback, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.result;
};

const deleteFeedbackById = async (id: string | null): Promise<boolean> => {
    if (!id) {
        return false;
    }

    try {
        const response = await axios.delete(`/feedback/${id}`);
        return response.status === 200;
    } catch (error) {
        console.error(`Error deleting feedback with ID ${id}:`, error);
        return false;
    }
};

export {
    getFeedbackById,
    getUserFeedbacks,
    deleteFeedbackById,
    createFeedback,
    updateFeedbackById,
    getFeedbackByServiceId
};