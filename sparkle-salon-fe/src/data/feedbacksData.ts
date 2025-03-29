import axios from "../services/customizedAxios";

export interface Feedback {
    id: number;
    feedbackText: string;
    rating: number;
    serviceName: string;
    img: string;
    bookingDate: string;
    therapistName: string;
    rated: boolean;
}

const getFeedback = async (): Promise<Feedback[]> => {
    try {
        const response = await axios.get("/feedback");
        if (response.result) {
            return response.result;
        }
        return [];
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        return [];
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
    try {
        const response = await axios.post("/feedback", feedback);
        return response.status === 200;
    } catch (error) {
        console.error("Error creating feedback:", error);
        return false;
    }
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
    getFeedback,
    getFeedbackById,
    getUserFeedbacks,
    deleteFeedbackById,
    createFeedback,
    updateFeedbackById
};