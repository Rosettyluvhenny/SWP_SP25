import axios from "../services/customizedAxios";

export interface Feedback {
    id?: number; 
    feedbackText: string;
    rating: number;
    serviceName: string;
    img: string;
    bookingDate: string;
    therapistName: string;
}

export interface FeedbackResponse {
    id: number;
    feedbackText: string;
    rating: number;
    serviceId: number;
    therapistId: string;
    bookingDate: string;
}

const getFeedback = async (): Promise<FeedbackResponse[]> => {
    const response = await axios.get("/feedback");
    if (response.status === 200) {
        return response.data.result.map((feedback: FeedbackResponse) => ({
            id: feedback.id,
            feedbackText: feedback.feedbackText,
            rating: feedback.rating,
            serviceId: feedback.serviceId,
            therapistId: feedback.therapistId,
            bookingDate: feedback.bookingDate,
        }));
    }
    return [];
};

const getFeedbackById = async (id:string | null) => {
    if (!id) {
        return null
    }
    const feedbackResponse = await axios.get(`/feedback/${id}`)
    if (feedbackResponse.status === 200) {
        const feedbackData = feedbackResponse.data.result
        return feedbackData
    }
    return null
}

const createFeedback = async (feedback: Feedback) => {
    const createFeedbackResponse = await axios.post("/feedback", feedback)
    if (createFeedbackResponse.status === 200) {
        return true
    }
    return false
}

const updateFeedbackById = async (id:string | null, feedback: Feedback) => {
    if (!id) {
        return false
    }
    const updateFeedbackResponse = await axios.put(`/feedback/${id}`, feedback)
    if (updateFeedbackResponse.status === 200) {
        return true
    }   
    return false
}

const deleteFeedbackById = async (id:string | null) => {
    if (!id) {
        return false
    }
    const deleteFeedbackResponse = await axios.delete(`/feedback/${id}`)
    if (deleteFeedbackResponse.status === 200) {
        return true
    }
    return false
}

export { getFeedback, getFeedbackById, deleteFeedbackById, createFeedback, updateFeedbackById };