import { FaPhone } from 'react-icons/fa';
import axios from "../services/customizedAxios";

export interface Therapist {
  id: string;
  username: string;
  fullName: string;
  userId :string;
  email: string;
  experienceYears: number;
  bio: string;
  dob: string;
  img: string;
  phone: string;
  rating: number;
  password:string;
  disabled: boolean;
  services: Service[];
}

export interface Service {
  id: number;
  name: string;s
}

const getAllTherapists = async (): Promise<Therapist[]> => {
  try {
    const response = await axios.get("/therapists");
    return response.result?.content || [];
  } catch (error) {
    console.error("Lỗi khi lấy danh sách chuyên viên:", error);
    return [];
  }
};



const getTherapists = async (serviceId: string): Promise<Therapist[]> => {
  try {
    const response = await axios.get(`/therapists/by-service/${serviceId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.result?.content || [];
  } catch (error) {
    console.error("Lỗi khi lấy chuyên viên theo dịch vụ:", error);
    return [];
  }
};



 const createTherapist = async (data: {
  username: string;
  password: string;
  fullName: string;
  email: string;
  experienceYears: number;
  bio: string;
  dob: string;
  phone: string;
  img: File; // Đổi thành File thay vì string
  serviceIds: number[]; // Đổi từ services thành serviceIds
}): Promise<boolean> => {
  // try {
    const token = localStorage.getItem("token");
    console.log("Token sử dụng:", token); // Log token để kiểm tra
    if (!token) {
      console.error("Không tìm thấy token để thực hiện yêu cầu tạo mới");
      return false;
    }

    const formData = new FormData();

    const requestData = {
      username: data.username,
      password: data.password,
      fullName: data.fullName,
      email: data.email,
      experienceYears: data.experienceYears,
      bio: data.bio,
      dob: data.dob,
      phone: data.phone,
      serviceId: Array.isArray(data.serviceIds) ? data.serviceIds : [], // Đảm bảo là mảng
    };

    console.log("Dữ liệu JSON trước khi gửi (create):", requestData);
    console.log("Dữ liệu JSON trước khi gửi (img):", data.img);

    formData.append("request", new Blob([JSON.stringify(requestData)], { type: "application/json" }));
    formData.append("img", data.img); // Gửi File trực tiếp

    const response = await axios.post("/therapists", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Phản hồi từ server (update):", requestData); // Log chi tiết

    console.log("Phản hồi từ server (create):", {
      status: response.status,
      data: response.data,
    });
    console.log("respone:", response)
    return response.result; // 201 thường dùng cho POST
  // } catch (error) {
  //   console.error("Lỗi khi tạo chuyên viên:", {
  //     message: error.message,
  //     response: error.response ? {
  //       status: error.response.status,
  //       data: error.response.data,
  //     } : "Không có phản hồi từ server",
  //   }
  // );
  //   return false;
  // }
};


 const updateTherapist = async (
  id: string,
  experienceYears: number,
  bio: string,
  dob: string,
  fullName: string,
  email: string,
  phone: string,
  img: File,
  serviceIds: number[]
): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Không tìm thấy token để thực hiện yêu cầu cập nhật");
      return false;
    }

    const formData = new FormData();

    const requestData = {
      experienceYears,
      bio,
      fullName,
      email,
      phone,
      dob,
      serviceIds: Array.isArray(serviceIds) ? serviceIds : [],
    };


    console.log("Dữ liệu JSON trước khi gửi (update):", requestData);
    formData.append("request", new Blob([JSON.stringify(requestData)], { type: "application/json" }));
    formData.append("img", img);

    const response = await axios.put(`/therapists/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
console.log("day la response :",response)
    return response.result;
  } catch (error) {
    console.error("Lỗi khi cập nhật chuyên viên:", error.response?.data || error.message);
    return false;
  }
};
const updateTherapistSv = async (
  id: string,
  img: File,
  serviceIds: number[]
): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Không tìm thấy token để thực hiện yêu cầu cập nhật");
      return false;
    }
    const formData = new FormData();
    const requestData = {
      serviceIds: Array.isArray(serviceIds) ? serviceIds : [],
    };
    console.log("Dữ liệu JSON trước khi gửi (update):", requestData);
    formData.append("request", new Blob([JSON.stringify(requestData)], { type: "application/json" }));
    formData.append("img", img);

    const response = await axios.put(`/therapists/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
console.log("day la response :",response)
    return response.result;
  } catch (error) {
    console.error("Lỗi khi cập nhật chuyên viên:", error.response?.data || error.message);
    return false;
  }
};

const deleteTherapist = async (id: string): Promise<boolean> => {
  try {
    const response = await axios.delete(`/therapists/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return !!response.result;
  } catch (error) {
    console.error("Lỗi khi xóa chuyên viên:", error);
    return false;
  }
};

const disableTherapist = async (id: string): Promise<boolean> => {
  try {
    const response = await axios.put(`/therapists/${id}/disable`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return !!response.result;
  } catch (error) {
    console.error("Lỗi khi vô hiệu hóa chuyên viên:", error);
    return false;
  }
};

const enableTherapist = async (id: string): Promise<boolean> => {
  try {
    const response = await axios.put(`/therapists/${id}/enable`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return !!response.result;
  } catch (error) {
    console.error("Lỗi khi kích hoạt chuyên viên:", error);
    return false;
  }
};

const getTherapistById = async (id: string): Promise<Therapist | null> => {
  try {
    console.log("Đang lấy thông tin chuyên viên với ID:", id);
    const response = await axios.get<{ result: Therapist }>(`/therapists/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.result) {
      console.log("Phản hồi API:", response);
      return response.result;
    }
    console.error("Không tìm thấy chuyên viên trong phản hồi");
    return null;
  } catch (error) {
    console.error("Lỗi khi lấy chuyên viên theo ID:", error);
    return null;
  }
};

const getTherapistInfo = async (): Promise<Therapist | null> => {
  try {
    const response = await axios.get("/therapists/getTherapistInfo",{
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
      },
    })
      
    ;

    if (response.result) {
      console.log("Phản hồi API:", response.data);
      return response.result; 
    }

    console.error("Không tìm thấy chuyên viên trong phản hồi");
    return null;
  } catch (error) {
    console.error("Lỗi khi lấy info chuyên viên:", error);
    return null;
  }
};


const getTherapistSlots = async (
  therapistId: string,
  serviceId: string,
  date: string
): Promise<any[]> => {
  try {
    const response = await axios.get(
      `/bookingSession/therapist/${therapistId}/service/${serviceId}/available-slots?date=${date}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.result || [];
  } catch (error) {
    console.error("Lỗi khi lấy slot của chuyên viên:", error);
    return [];
  }
};

const getFreeSlots = async (serviceId: string, date: string): Promise<any[]> => {
  try {
    const response = await axios.get(
      `/bookingSession/service/${serviceId}/available-slots?date=${date}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.result || [];
  } catch (error) {
    console.error("Lỗi khi lấy slot trống:", error);
    return [];
  }
};








export {
  getTherapistInfo,
  createTherapist,
  updateTherapist,
  deleteTherapist,
  disableTherapist,
  enableTherapist,
  getTherapists,
  getTherapistById,
  getTherapistSlots,
  getFreeSlots,
  getAllTherapists,
  updateTherapistSv,
};