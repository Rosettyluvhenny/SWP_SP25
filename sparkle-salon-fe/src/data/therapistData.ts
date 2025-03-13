import axios from "axios";

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
}

  const getTherapists = async (serviceId: string) => {
    const response = await axios.get("http://localhost:8081/swp/therapists/by-service/"+serviceId);
    if (response.status === 200) {
        return response.data.result.content;
    }
    return [];
  }

  const getTherapistById = async (id: number) => {
    const response = await axios.get(`http://localhost:8081/swp/therapists/${id}`);
    if (response.status === 200) {
        return response.data.result;
    }
    return null;
  }

  const getTherapistSlots = async (therapistId: string | null, serviceId: string | null, date: string) => {
    if (!serviceId) {
        return []
    }
    const response = await axios.get(`http://localhost:8081/swp/bookingSession${therapistId ? `/therapist/${therapistId}` : ""}/service/${serviceId}/available-slots?date=${date}`);
    if (response.status === 200) {
        return response.data.result;
    }
    return [];
  }

export { getTherapists, getTherapistById, getTherapistSlots};
