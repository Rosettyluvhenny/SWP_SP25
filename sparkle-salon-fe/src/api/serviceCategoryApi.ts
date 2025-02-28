import axios from "axios";

const API_BASE_URL = "http://localhost:8081/swp"; // Adjust based on your backend

// Fetch all categories
export const fetchCategories = async () => {
  const response = await axios.get(`${API_BASE_URL}/category`);
  return response.data;
};

// Fetch single category by ID
export const fetchCategoryById = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/category/${id}`);
  return response.data;
};

// Create new category
export const createCategory = async (data: { name: string }) => {
  const response = await axios.post(`${API_BASE_URL}/category`, data);
  return response.data;
};

// Update category
export const updateCategory = async (id: string, data: { name: string }) => {
  const response = await axios.put(`${API_BASE_URL}/category/${id}`, data);
  return response.data;
};

// Delete category
export const deleteCategory = async (id: string) => {
  await axios.delete(`${API_BASE_URL}/category/${id}`);
};
