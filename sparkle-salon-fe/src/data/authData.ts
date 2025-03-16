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
        console.error("❌ No token found in localStorage!");
        return null;
    }

    try {
        console.log("🔹 Fetching user info with token:", token); 

        const response = await axios.get("http://localhost:8081/swp/users/getMyInfo", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log("✅ User data received:", response.data); 
        return response.data.result; 
    } catch (error) {
        console.error("❌ Error fetching user:", error);
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
        console.error("❌ User ID is missing! Update request aborted.");
        return false;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        console.error("❌ No token found! Update failed.");
        return false;
    }

    const apiUrl = `http://localhost:8081/swp/users/${userId}`;; 

    const updatedData = { fullName, email, phone, dob: dob || "" };

    try {
        console.log("🔹 Sending Update Request to:", apiUrl);
        console.log("🔹 Payload:", updatedData);

        const response = await axios.put(apiUrl, updatedData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        console.log("✅ Update Successful:", response.data);
        return response.status === 200;
    } catch (error) {
        console.error("❌ Update Error:", error);
        return false;
    }
};

export { login, getUser, register, updateUser };
