import axios from '../services/customizedAxios';

const createPayment = async (paymentName: string) => {
    const response = await axios.post(`/payment`, {
        paymentName
    });
    if (response.result) {
        return true;
    } else {
        return false;
    }
};

const getPayment = async () => {
    const response = await axios.get(`/payment`);
    if (response.result) {
        return response.result;
    }
    return [];
};

const updatePayment = async (paymentId: string, paymentName: string) => {
    const response = await axios.put(`/payment/${paymentId}`, {
        paymentName
    });
    if (response.result) {
        return true;
    }
    return false;
};

const getPaymentById = async (paymentId: string) => {
    const response = await axios.get(`/payment/${paymentId}`);
    if (response.result) {
        return response.result;
    }
    return null;
};

const deletePayment = async (paymentId: string) => {
    const response = await axios.delete(`/payment/${paymentId}`);
    if (response.result) {
        return true;
    }
    return false;
};

export { createPayment, getPayment, deletePayment, getPaymentById, updatePayment };