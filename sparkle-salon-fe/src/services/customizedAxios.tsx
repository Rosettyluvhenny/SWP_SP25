import axios from "axios";
import { refresh } from "../data/authData";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";


const instance = axios.create({
    baseURL: 'http://localhost:8080/swp',
});

instance.interceptors.response.use(function(response){
    // console.log(response);
    return response.data? response.data : {statusCode: response.status};
}, async (error) => {
    // const { logout } = useContext(UserContext);
    if (error.response&& error.status == 401) {
        try {
            const refreshResponse = await refresh();
            if (refreshResponse.token) {
                localStorage.setItem("token", refreshResponse.token);
                // Retry the failed request with new token
                error.config.headers["Authorization"] = `Bearer ${refreshResponse.token}`;
                return instance(error.config);
            }
        } catch (refreshError) {
            console.error("Refresh token failed:", refreshError);
            localStorage.removeItem("token");
            toast.error("Session expired. Please login again.");
            window.location.href = '/home';
            toast.error(error.response.message);
        }
    }else {
        toast.error(error.response.data.message);
        console.log("error axios", error.reponse);
    }
    return Promise.reject(error);
});

export default instance;
