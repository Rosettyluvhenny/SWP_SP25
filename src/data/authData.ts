import axios from "axios";

const login = async (username: string, password: string) => {
    const response = await axios.post(`http://localhost:8443/swp/auth/authenticate`, {
        username,
        password,
    });
    if (response.status === 200) {
        return response.data.result.token;
    } else {
        return null;
    }
};

const register = async (data: {username: string, password: string, fullName: string, email: string, phone: string, dob: string}) => {
    const response = await axios.post(`http://localhost:8443/swp/users`, {
        username: data.username,
        password: data.password,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        dob: data.dob,
    });
    if (response.status === 201) {
        return true;
    } else {
        return false;
    }
};

const getUser = async () => {
    const token = localStorage.getItem('token')
    const response = await axios.get(`http://localhost:8443/swp/users/getMyInfo`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.result;
};



export {login, getUser, register};
