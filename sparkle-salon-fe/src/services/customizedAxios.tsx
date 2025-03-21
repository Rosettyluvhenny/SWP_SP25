import axios from "axios";
import { refresh } from "../data/authData";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const instance = axios.create({
    baseURL: 'http://localhost:8080/swp',
});

instance.interceptors.response.use(function(response){
    return response.data? response.data : {statusCode: response.status};
}, async (error) => {
    const { setIsLoginOpen } = useContext(UserContext);
    if (error.response && error.response.status === 401) {
        console.log("eror in status 500");
        try {
            // Attempt to refresh the token
            const refreshResponse = await refresh();
            if (refreshResponse.token) {
                localStorage.setItem("token", refreshResponse.token);
                // Retry the failed request with new token
                // error.config.headers["Authorization"] = `Bearer ${refreshResponse.token}`;
                console.log("error from inceptors")
                return instance(error.config);
            }
        } catch (refreshError) {
            console.error("Refresh token failed:", refreshError);
            localStorage.removeItem("token");
            setIsLoginOpen(true) // Redirect to login if refresh fails
        }
    }
    return Promise.reject(error);
});

export default instance;