import axios from "../services/customizedAxios";

export interface Therapist {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  experienceYears: number;
  bio: string;
  img: string;
  disabled: boolean;
}

const getAllTherapists = async () => {
  const response = await axios.get("/therapists"
  );
  if (response.result) {
    return response.result.content;
  }
  return [];
};

const getTherapists = async (serviceId: string) => {
  const response = await axios.get("/therapists/by-service/" + serviceId,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  if (response.result) {
    return response.result.content;
  }
  return [];
};

const createTherapist = async (data: { username: string, fullName: string, email: string, experienceYears: number, bio: string, dob: string, phone: string, img: string }) => {
  try {
    const response = await axios.post("/therapists", {
      username: data.username,
      fullName: data.fullName,
      email: data.email,
      experienceYears: data.experienceYears,
      bio: data.bio,
      dob: data.dob,
      phone: data.phone,
      img: data.img
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    });

    return response.result ? true : false;
  } catch (error) {
    console.error("Error creating therapist:", error);
    return false;
  }
}

const updateTherapist = async (id: string, experienceYears: number, bio: string, phone: string, img: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token available for update request");
      return false;
    }
    
    const response = await axios.put(`/therapists/${id}`, {
      experienceYears: experienceYears,
      bio: bio,
      phone: phone,
      img: img
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    return response.result ? true : false;
  } catch (error) {
    console.error("Error updating therapist:", error);
    return false;
  }
}

const deleteTherapist = async (id: string) => {
  try {
    const response = await axios.delete(`/therapists/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    });
    return response.result ? true : false;
  } catch (error) {
    console.error("Error deleting therapist:", error);
    return false;
  }
}

const disableTherapist = async (id: string) => {
  try {
    const response = await axios.put(`/therapists/${id}/disable`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    });
    return response.result ? true : false;
  } catch (error) {
    console.error("Error disabling therapist:", error);
    return false;
  }
}

const enableTherapist = async (id: string) => {
  try {
    const response = await axios.put(`/therapists/${id}/enable`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    });
    return response.result ? true : false;
  } catch (error) {
    console.error("Error enabling therapist:", error);
    return false;
  }
}

const getTherapistById = async (id: string): Promise<Therapist | null> => {
  try {
    console.log("Fetching therapist with ID:", id);
    const response = await axios.get<{ result: Therapist }>(`/therapists/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    });
    if (response?.result) {
      console.log("API Response:", response);
      return response.result;
    } else {
      console.error("Therapist not found in the response");
      return null;
    }
  } catch (error: unknown) {
    console.error("Error fetching therapist by ID:", error);
    return null;
  }
};

const getTherapistSlots = async (therapistId: string, serviceId: string, date: string) => {
  const response = await axios.get(`/bookingSession/therapist/${therapistId}/service/${serviceId}/available-slots?date=${date}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  if (response.result) {
    return response.result;
  }
  return [];
}

const getFreeSlots = async (serviceId: string, date: string) => {
  const response = await axios.get(`/bookingSession/service/${serviceId}/available-slots?date=${date}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  if (response.result) {
    return response.result;
  }
  return [];
}

export {
  createTherapist,
  updateTherapist,
  deleteTherapist,
  disableTherapist,
  enableTherapist,
  getTherapists,
  getTherapistById,
  getTherapistSlots,
  getFreeSlots,
  getAllTherapists
};