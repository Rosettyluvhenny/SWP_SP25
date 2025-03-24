import axios from "../services/customizedAxios";

export interface Feedback {
    feedbackId?: number;
    feedbackText: string;
    rating: number;
    serviceName: string;
    img: string;
    bookingDate: string;
    therapistName: string;
    serviceId?: number;
    therapistId?: string;
    userId?: string;
}


const getFeedback = async (): Promise<Feedback[]> => {
    try {
        const response = await axios.get("/feedback");
        if (response.status === 200 && response.data && response.data.result) {
            return response.data.result;
        }
        return [];
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        return [];
    }
};

const getUserFeedbacks = async (userId: string): Promise<Feedback[]> => {
    if (!userId) {
        return [];
    }
    
    try {
        const response = await axios.get(`/feedback/${userId}/all`);
        if (response.status === 200 && response.data && response.data.result) {
            return response.data.result;
        }
        return [];
    } catch (error) {
        console.error(`Error fetching feedbacks for user ID ${userId}:`, error);
        return [];
    }
};

const getFeedbackById = async (id: string | null): Promise<Feedback | null> => {
    if (!id) {
        return null;
    }
    
    try {
        const response = await axios.get(`/feedback/${id}`);
        if (response.status === 200 && response.data && response.data.result) {
            return response.data.result;
        }
        return null;
    } catch (error) {
        console.error(`Error fetching feedback with ID ${id}:`, error);
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

const updateFeedbackById = async (id: string | null, feedback: Feedback): Promise<boolean> => {
    if (!id) {
        return false;
    }
    
    try {
        const response = await axios.put(`/feedback/${id}`, feedback);
        return response.status === 200;
    } catch (error) {
        console.error(`Error updating feedback with ID ${id}:`, error);
        return false;
    }
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