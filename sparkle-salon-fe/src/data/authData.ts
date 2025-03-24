import { toast } from "react-toastify";
import axios from "../services/customizedAxios";

const login = async (username: string, password: string) => {
    try {
        const response = await axios.post(`/auth/authenticate`, { username, password });
        return response; 
    } catch (error) {
        toast.error(error.response.data.message);
        return null; 
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

const getAllUser = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        console.error("No token found! Cannot fetch users.");
        return [];
    }

    try {
        const response = await axios.get(`/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.result;   
    } catch (error) {
        console.error("Error fetching users:", error);
        return []; 
    }
};

const getUser = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        console.error("No token found! Cannot fetch users.");
        return null;
    }

    try {
        const response = await axios.get(`/users/getMyInfo`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.result;   
    } catch (error) {
        console.error("Error fetching users:", error);
        return null; 
    }
};

const updateUser = async (
    userId: string | undefined, 
    fullName: string, 
    email: string, 
    phone: string, 
    dob: string
) => {
    if (!userId) {
        console.error("User ID is missing! Update request aborted.");
        return false;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        console.error("No token found! Update failed.");
        return false;
    }

    const apiUrl = `/users/${userId}`;; 

    const updatedData = { fullName, email, phone, dob: dob || "" };

    try {
        console.log("Sending Update Request to:", apiUrl);
        console.log("Payload:", updatedData);

        const response = await axios.put(apiUrl, updatedData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        console.log("Update Successful:", response.data);
        return response.status === 200;
    } catch (error) {
        console.error("Update Error:", error);
        return false;
    }
};

const createUser = async (data: { username: string, password: string, fullName: string, email: string, phone: string, dob: string }) => {
    const response = await axios.post(`/users`, {
        username: data.username,
        password: data.password,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        dob: data.dob,
    });
    if (response.status === 200) {
        return true;
    } else {
        return false;
    }
}

const disableUser = async (userId: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("No token found! Update failed.");
        return false;
    }

    const apiUrl = `/users/${userId}/disable`;

    try {
        console.log("Sending Disable Request to:", apiUrl);

        const response = await axios.put(apiUrl, null, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        console.log("Disable Successful:", response.data);
        return response.status === 200;
    } catch (error) {
        console.error("Disable Error:", error);
        return false;
    }
}

const deleteUser = async (userId: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("No token found! Update failed.");
        return false;
    }

    const apiUrl = `/users/${userId}`;

    try {
        console.log("Sending Delete Request to:", apiUrl);

        const response = await axios.delete(apiUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        console.log("Delete Successful:", response.data);
        return response.status === 200;
    } catch (error) {
        console.error("Delete Error:", error);
        return false;
    }
}

const introspect = async() =>{
    const token = localStorage.getItem('token')
    if(!token)
        return;
    const response = await axios.post("/auth/introspect", 
        { token }, // Send token in body
        {
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
    return response.result.valid;
}
const refresh = async() =>{
    const token = localStorage.getItem('token')
    if(!token)
        return;
    const response = await axios.post("/auth/refresh", 
        { token }, // Send token in body
        {
            headers: {
                "Content-Type": "application/json"
            }
        }
    );
    return response.result;
}


export { login, getUser, register, updateUser, createUser, disableUser, introspect, refresh, getAllUser, deleteUser };
