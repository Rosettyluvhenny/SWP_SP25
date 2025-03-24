import axios from "../services/customizedAxios";

const getNotification = async() => {
    const response = await axios.get(`/notification/not-read`,{headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    }
    });
    // console.log("noti", response);
    if(response.result){
        return response.result;
    }else {
        return null;
    }
}
const markRead = async(id:number) =>{
    const response = await axios.put(`/notification/${id}/mark-read`,{},{headers: {
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