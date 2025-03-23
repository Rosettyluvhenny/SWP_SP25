import axios from "../services/customizedAxios";

const getNotification = async() => {
    const response = await axios.get(`/notification`,{headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    }
    });
    if(response.result){
        return response.result;
    }else {
        return null;
    }
}
const markRead = async() =>{
    const response = await axios.get(`/notification`,{headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    }
    });
    if(response.result){
        return response.result;
    }else {
        return null;
    }
}
export {getNotification, markRead}