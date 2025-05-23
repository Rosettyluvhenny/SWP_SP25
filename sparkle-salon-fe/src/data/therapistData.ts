
import axios from "../services/customizedAxios";

export interface Therapist {
  id: string;
  username: string;
  fullName: string;
  userId: string;
  email: string;
  experienceYears: number;
  bio: string;
  dob: string;
  img: string;
  phone: string;
  rating: number;
  password: string;
  active: boolean;
  services: Service[];
}

export interface Service {
  id: number;
  name: string;
}

export interface CompletedSession {
  id: number;
  bookingId: number;
  bookingDate: string;
  sessionDateTime: string;
  serviceName: string;
  serviceId: number;
  status: string;
  note: string;
  imgBefore: string;
  imgAfter: string;
  roomId: number;
  roomName: string;
  userId: string;
  userName: string;
  therapistId: string;
  therapistName: string;
  staffId: string;
  staffName: string;
  img: string;
  description: string;
  feedbackText: string;
  rating: number;
}

export interface CompletedSessionsResponse {
  totalElements: number;
  totalPages: number;
  size: number;
  content: CompletedSession[];
}

const getAllTherapists = async (): Promise<Therapist[]> => {
  try {
    const response = await axios.get("/therapists?isActive=false");
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
  img: File | null;
  serviceIds: number[];
}): Promise<boolean> => {
  const isConfirmed = window.confirm(
    "Bạn có chắc chắn muốn tạo chuyên viên mới không?"
  );
  if (!isConfirmed) return Promise.reject("Hủy tạo chuyên viên mới");
  
  const token = localStorage.getItem("token");
  console.log("Token sử dụng:", token);
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
    serviceId: Array.isArray(data.serviceIds) ? data.serviceIds : [],
  };

  console.log("Dữ liệu JSON trước khi gửi (create):", requestData);
  console.log("Dữ liệu JSON trước khi gửi (img):", data.img);

  formData.append("request", new Blob([JSON.stringify(requestData)], { type: "application/json" }));
  formData.append("img", data.img);

  const response = await axios.post("/therapists", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  console.log("Phản hồi từ server (update):", requestData);

  console.log("Phản hồi từ server (create):", {
    status: response.status,
    data: response.data,
  });
  console.log("respone:", response)
  return response.result;
};

const updateTherapist = async (
  id: string,
  experienceYears: number,
  bio: string,
  dob: string,
  fullName: string,
  email: string,
  phone: string,
  img: File | undefined,
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

    if (img) {
      formData.append("img", img);
    }

    const response = await axios.put(`/therapists/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Response từ server:", response.data);
    return response.result;
  } catch (error) {
    console.error("Lỗi khi cập nhật chuyên viên:", error.response?.data || error.message);
    return false;
  }
};

const updateTherapistSv = async (
  id: string,
  serviceIds: number[]
): Promise<boolean> => {
  const isConfirmed = window.confirm(
    "Bạn có chắc chắn muốn lưu dịch vụ không?"
  );
  if (!isConfirmed) return Promise.reject("Hủy lưu dịch vụ");
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

    const response = await axios.put(`/therapists/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("day la response :", response)
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

const disableTherapist = async (userId: string): Promise<boolean> => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(`/users/${userId}/active?check=false`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.statusCode == 204;
  } catch (error) {
    console.error("Lỗi khi vô hiệu hóa chuyên viên:", error);
    return false;
  }
};

const enableTherapist = async (userId: string): Promise<boolean> => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(`/users/${userId}/active?check=true`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.statusCode == 204;
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
    const response = await axios.get("/therapists/getTherapistInfo", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });

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

const getTherapistCompletedSessions = async (
  from?: string,
  to?: string
): Promise<CompletedSession[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found for completed sessions request");
      return [];
    }

    // Build query parameters
    let queryParams = '';
    if (from) queryParams += `from=${from}`;
    if (to) {
      queryParams += queryParams ? `&to=${to}` : `to=${to}`;
    }
    
    const url = `/therapists/sessionCompleted${queryParams ? `?${queryParams}` : ''}`;
    
    console.log("Fetching completed sessions with URL:", url);
    
    const response = await axios.get<{ result: CompletedSessionsResponse }>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    console.log("Completed sessions response:", response);
    return response.result?.content || [];
  } catch (error) {
    console.error("Error fetching therapist completed sessions:", error);
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
  getTherapistCompletedSessions,
};