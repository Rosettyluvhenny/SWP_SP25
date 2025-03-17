import axios from 'axios';

const createPayment = async (paymentName: string) => {
    const response = await axios.post(`http://localhost:8081/swp/payment`, {
        paymentName
    });
    if (response.status === 201) {
        return true;
    } else {
        return false;
    }
};

const getPayment = async () => {
    const response = await axios.get(`http://localhost:8081/swp/payment`);
    if (response.status === 200) {
        return response.data.result;
    }
    return [];
};

const updatePayment = async (paymentId: string, paymentName: string) => {
    const response = await axios.put(`http://localhost:8081/swp/payment/${paymentId}`, {
        paymentName
    });
    if (response.status === 200) {
        return true;
    }
    return false;
};

const getPaymentById = async (paymentId: string) => {
    const response = await axios.get(`http://localhost:8081/swp/payment/${paymentId}`);
    if (response.status === 200) {
        return response.data.result;
    }
    return null;
};

const deletePayment = async (paymentId: string) => {
    const response = await axios.delete(`http://localhost:8081/swp/payment/${paymentId}`);
    if (response.status === 200) {
        return true;
    }
    return false;
};

export { createPayment, getPayment, deletePayment, getPaymentById, updatePayment };