import axios from "../services/customizedAxios";
export interface Category{
    id: number;
    name: string;
    description: string;
    type: number;
}

export const CategoryData = async () :Promise<{ category: Category[]}> =>{
    const response = await axios.get(`/category`);
    const category = response.result;
    return category;
}
export default {CategoryData}
