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

  const getTherapistById = async (id: string): Promise<Therapist | null> => {
    try {
        console.log("Fetching therapist with ID:", id);

        const response = await axios.get<{ result: Therapist }>(`http://localhost:8081/swp/therapists/${id}`);

        console.log("API Response:", response.data);
        return response.data.result;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Axios Error:", error.response?.data || error.message);
        } else if (error instanceof Error) {
            console.error("General Error:", error.message);
        } else {
            console.error("Unknown Error:", error);
        }
        return null;
    }
};


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
