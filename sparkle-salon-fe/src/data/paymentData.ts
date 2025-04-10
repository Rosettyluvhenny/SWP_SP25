import axios from '../services/customizedAxios';

const createPayment = async (paymentName: string) => {
    try {
        const response = await axios.post(`/payment`, {
            paymentName
        });
        return response.code === 0;
    } catch (error) {
        console.error("Error creating payment:", error);
        return false;
    }
};

const getPayment = async () => {
    try {
        const response = await axios.get(`/payment`);
        return response.result || [];
    } catch (error) {
        console.error("Error getting payments:", error);
        return [];
    }
};

const updatePayment = async (paymentId: string, paymentName: string) => {
    try {
        const response = await axios.put(`/payment/update/${paymentId}`, {
            paymentName
        });
        return response.code === 0;
    } catch (error) {
        console.error("Error updating payment:", error);
        return false;
    }
};

const getPaymentById = async (paymentId: string) => {
    try {
        const response = await axios.get(`/payment/${paymentId}`);
        return response.result || null;
    } catch (error) {
        console.error("Error getting payment by ID:", error);
        return null;
    }
};

const activePayment = async (paymentId: string) => {
    try {
        const response = await axios.put(`/payment/active/${paymentId}`);
        return response.code === 0;
    } catch (error) {
        console.error("Error activating payment:", error);
        return false;
    }
};

const deactivePayment = async (paymentId: string) => {
    try {
        const response = await axios.put(`/payment/deactive/${paymentId}`);
        return response.code === 0;
    } catch (error) {
        console.error("Error deactivating payment:", error);
        return false;
    }
};

export { createPayment, getPayment, getPaymentById, updatePayment, activePayment, deactivePayment };