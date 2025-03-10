import axios from "axios";
export interface Service {
    id: number;
    active: boolean;
    name: string;
    price: number;
    duration: string;
    session: number;
    img: string;
    description: string;
    categoryId: number;
    categoryName: string;
}


const servicesData = async (): Promise<Service[]> =>{
    const servicesResponse = await axios.get("http://localhost:8081/swp/services");
    if (servicesResponse.status === 200) {
        return servicesResponse.data.result.content;
    }
    return [];
};


const serviceDataById = async (id:string) => {
    const serviceResponse = await axios.get(`http://localhost:8081/swp/services/${id}`)
    if (serviceResponse.status === 200) {
        const serviceData = serviceResponse.data.result
        return serviceData
    }
    return null
}

const deleteServiceById = async (id:string) => {
    const deleteServiceResponse = await axios.delete(`http://localhost:8081/swp/services/${id}`)
    if (deleteServiceResponse.status === 200) {
        return true
    }
    return false
}

export { servicesData , serviceDataById, deleteServiceById};