
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
  id: string;
  bookingId: string;
  specificDateTime: string;
  serviceName: string;
  status: string;
  notes: string;
  serviceType: string;
  zoomUrl: string;
  googleMeet: string;
  skypeId: string;
  userEmail: string;
  therapistName: string;
  therapistId: string;
  feedback: string;
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

export interface PageableRequest {
  pageNumber?: number;
  pageSize?: number;
  sort?: string[];
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


const getTherapistCompletedSession = async (
  from?: string,
  to?: string,
  pageable: PageableRequest = {}
): Promise<{ sessions: CompletedSession[]; meta: MetaData }> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Không tìm thấy token để thực hiện yêu cầu");
      return { sessions: [], meta: { totalElements: 0, totalPages: 0, pageNumber: 0, pageSize: 0, first: false, last: false, numberOfElements: 0 } };
    }

    // Build query parameters
    const queryParams = new URLSearchParams();
    
    // Add date range parameters if provided
    if (from) queryParams.append('from', from);
    if (to) queryParams.append('to', to);
    
    // Add pageable parameters if provided
    if (pageable.pageNumber !== undefined) queryParams.append('page', pageable.pageNumber.toString());
    if (pageable.pageSize !== undefined) queryParams.append('size', pageable.pageSize.toString());
    if (pageable.sort && pageable.sort.length > 0) {
      pageable.sort.forEach(sortItem => {
        queryParams.append('sort', sortItem);
      });
    }

    const url = `/therapists/sessionCompleted${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    console.log("Calling API:", url);
    
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.result) {
      const { content, totalElements, totalPages, number, pageSize, first, last, numberOfElements } = response.result;
      
      return {
        sessions: content || [],
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
    
    console.error("Không tìm thấy dữ liệu trong phản hồi:", response);
    return { 
      sessions: [], 
      meta: { 
        totalElements: 0, 
        totalPages: 0, 
        pageNumber: 0, 
        pageSize: 0, 
        first: false, 
        last: false, 
        numberOfElements: 0 
      } 
    };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách buổi điều trị đã hoàn thành:", error);
    return { 
      sessions: [], 
      meta: { 
        totalElements: 0, 
        totalPages: 0, 
        pageNumber: 0, 
        pageSize: 0, 
        first: false, 
        last: false, 
        numberOfElements: 0 
      } 
    };
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
  getTherapistCompletedSession,
};