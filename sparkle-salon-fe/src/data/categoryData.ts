import axios from "axios";
export interface Category{
    id: number;
    name: string;
    description: string;
}

export const CategoryData = async () :Promise<{ category: Category[]}> =>{
    const response = await axios.get(`http://localhost:8081/swp/category`);
    const category = response.data;
    return category;
}
