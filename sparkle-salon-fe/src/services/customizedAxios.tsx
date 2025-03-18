import axios from "axios";

const instance = axios.create({
    baseURL: 'https://localhost:8443/swp',
});

instance.interceptors.response.use(function(response){
    return response.data? response.data : {statusCode: response.status};
}, function (error){
    let res  = {};
    if(error.response){
        res.data = error.response.data;
        res.status = error.response.status;
        res.header = error.response.headers;
    } else if( error.request){
        console.log(error.request);
    }else{
        console.log('Error', error.message);
    }
    // return Promise.reject(error);
    return res;
});

export default instance;