import axios from "axios";

const login = async (username: string, password: string) => {
    const response = await axios.post(`http://localhost:8081/swp/auth/authenticate`, {
        username,
        password,
    });
    if (response.status === 200) {
        const token = response.data.result.token;
        localStorage.setItem("token", token);
        return token;
    } else {
        return null;
    }
};

const register = async (data: { username: string, password: string, fullName: string, email: string, phone: string, dob: string }) => {
    const response = await axios.post(`http://localhost:8081/swp/users`, {
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
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("No token found");
        return null;
    }
    try {
        const response = await axios.get(`http://localhost:8081/swp/users/getMyInfo`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.result;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
};

const updateUser = async (userId: string, fullName: string, email: string, phone: string, dob: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("No token found! Update failed.");
        return false;
    }

    try {
        console.log("User ID:", userId); // Debugging
        console.log("Authorization Header:", `Bearer ${token}`); // Debugging

        const response = await axios.put(
            `http://localhost:8081/swp/users/${userId}`,
            { fullName, email, phone, dob },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Update Response:", response.data); // Debugging
        return response.status === 200;
    } catch (error) {
        console.error("Error updating user:", error);
        return false;
    }
};

export { login, getUser, register, updateUser };
