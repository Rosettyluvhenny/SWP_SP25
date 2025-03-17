import instance from "../services/customizedAxios";
import axios from "../services/customizedAxios";

const login = async (username: string, password: string) => {
    try {
        const response = await axios.post(`/auth/authenticate`, { username, password });
        return response; // Return only the actual data from API
    } catch (error) {
        console.error("Login failed:", error);
        return null; // Handle errors properly
    }
};

const register = async (data: {username: string, password: string, fullName: string, email: string, phone: string, dob: string}) => {
    const response = await axios.post(`/users`, {
        username: data.username,
        password: data.password,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        dob: data.dob,
    });
    if (response.result) {
        return true;
    } else {
        return false;
    }
};

const getUser = async () => {
    const token = localStorage.getItem('token')
    const response = await axios.get(`/users/getMyInfo`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.result;
};



export {login, getUser, register};
