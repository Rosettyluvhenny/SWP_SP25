import axios from "../services/customizedAxios";

export interface Feedback {
    id?: number;
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
        const response = await axios.get("/feedback");
        if (response.status === 200) {
            return response.result
        }
        return [];
};

const getUserFeedbacks = async (userId: string): Promise<Feedback[]> => {
    if (!userId) {
        return [];
    }
    
    try {
        const response = await axios.get(`/feedback/${userId}/all`);
        if (response.status === 200) {
            return response.result;
        }
        return [];
    } catch (error) {
        console.error(`Error fetching feedbacks for user ID ${userId}:`, error);
        throw error;
    }
};

const getFeedbackById = async (id: string | null): Promise<Feedback | null> => {
    if (!id) {
        return null;
    }
    
    try {
        const feedbackResponse = await axios.get(`/feedback/${id}`);
        if (feedbackResponse.status === 200) {
            const feedbackData = feedbackResponse.result;
            return feedbackData;
        }
        return null;
    } catch (error) {
        console.error(`Error fetching feedback with ID ${id}:`, error);
        throw error;
    }
};

const createFeedback = async (feedback: Feedback): Promise<boolean> => {
    try {
        const createFeedbackResponse = await axios.post("/feedback", feedback);
        return createFeedbackResponse.status === 200;
    } catch (error) {
        console.error("Error creating feedback:", error);
        throw error;
    }
};

const updateFeedbackById = async (id: string | null, feedback: Feedback): Promise<boolean> => {
    if (!id) {
        return false;
    }
    
    try {
        const updateFeedbackResponse = await axios.put(`/feedback/${id}`, feedback);
        return updateFeedbackResponse.status === 200;
    } catch (error) {
        console.error(`Error updating feedback with ID ${id}:`, error);
        throw error;
    }
};

const deleteFeedbackById = async (id: string | null): Promise<boolean> => {
    if (!id) {
        return false;
    }
    
    try {
        const deleteFeedbackResponse = await axios.delete(`/feedback/${id}`);
        return deleteFeedbackResponse.status === 200;
    } catch (error) {
        console.error(`Error deleting feedback with ID ${id}:`, error);
        throw error;
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