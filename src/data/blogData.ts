import axios from "axios";

export interface Blog {
    blogId: number;
    categoryId: number;
    categoryName: string;
    title: string;
    content: string;
    therapistName: string;
    approve: boolean;
    img: string;
  }
  const blogData = async (): Promise<Blog[]> =>{
    const blogResponse = await axios.get("http://localhost:8443/swp/blogpost");
    if (blogResponse.status === 200) {
        return blogResponse.data.result.content;
    }
    return [];
};

const serviceBlogById = async (blogId:string) => {
  const serviceResponse = await axios.get(`http://localhost:8443/swp/blogpost/${blogId}`)
  if (serviceResponse.status === 200) {
      const serviceData = serviceResponse.data.result
      return serviceData
  }
  return null
}
const deleteBlogById = async (blogId:string) => {
  const deleteBlogResponse = await axios.delete(`http://localhost:8443/swp/blogpost/${blogId}`)
  if (deleteBlogResponse.status === 200) {
      return true
  }
  return false
}
const getDefaultByquizresult = async (categoryId: number) =>{
  const getdefaultResponse = await axios.get(`http://localhost:8443/swp/blogpost/getDefault/${categoryId}`);
  if (getdefaultResponse.status === 200) {
      return getdefaultResponse.data.result;
  }
  return [];
};



export { blogData, deleteBlogById, serviceBlogById,getDefaultByquizresult }