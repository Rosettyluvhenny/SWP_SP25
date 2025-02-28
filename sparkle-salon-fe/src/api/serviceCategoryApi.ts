import axios from "axios";

const BASE_URL = "http://localhost:8081/swp"; 

export const getAllCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/category`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getCategoryById = async (id: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/category/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category with id ${id}:`, error);
    throw error;
  }
};

export const createCategory = async (categoryData: { name: string; description: string }) => {
  try {
    const response = await axios.post(`${BASE_URL}/category`, categoryData);
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const updateCategory = async (id: number, updatedData: { name: string; description: string }) => {
  try {
    const response = await axios.put(`${BASE_URL}/category/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`Error updating category with id ${id}:`, error);
    throw error;
  }
};

export const deleteCategory = async (id: number) => {
  try {
    await axios.delete(`${BASE_URL}/category/${id}`);
  } catch (error) {
    console.error(`Error deleting category with id ${id}:`, error);
    throw error;
  }
};
