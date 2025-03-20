import axios from "../services/customizedAxios";
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
    rating: number;
}
export interface MetaData {
    totalElements: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
    first: boolean;
    last: boolean;
    numberOfElements: number;
}

const servicesData = async (url : string): Promise<{ services: Service[]; meta: MetaData }> => {
    const servicesResponse = await axios.get(`/services${url}`);
    if (servicesResponse.result) {
        const { content, totalElements, totalPages, number, pageSize, first, last, numberOfElements } =
            servicesResponse.result;
        return {
            services: content,
            meta: {
                totalElements,
                totalPages,
                pageNumber: number,
                pageSize,
                first,
                last,
                numberOfElements,
            },
        };
    }
    return { services: [], meta: { totalElements: 0, totalPages: 0, pageNumber: 0, pageSize: 0, first: false, last: false, numberOfElements: 0 } };
};


const serviceDataById = async (id:string) => {
    const serviceResponse = await axios.get(`/services/${id}`)
    // console.log(serviceResponse);
    if (serviceResponse.result) {
        const serviceData = serviceResponse.result;
        return serviceData
    }
    return serviceResponse;
}

const deleteServiceById = async (id:string) => {
    const deleteServiceResponse = await axios.delete(`/services/${id}`)
    if (deleteServiceResponse.status === 200) {
        return true
    }
    return false
}

export { servicesData , serviceDataById, deleteServiceById};