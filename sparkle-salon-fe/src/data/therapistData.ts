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
}

  const getTherapists = async (serviceId: string) => {
    const response = await axios.get("/therapists/by-service/"+serviceId);
    if (response.result) {
        return response.result.content;
    }
    return [];
  }

  const getTherapistById = async (id: string): Promise<Therapist | null> => {
    try {
        console.log("Fetching therapist with ID:", id);

        const response = await axios.get<{ result: Therapist }>(`/therapists/${id}`);

        console.log("API Response:", response.data);
        return response.result;
    } catch (error: unknown) {
        // if (axios.isAxiosError(error)) {
        //     console.error("Axios Error:", error.response?.data || error.message);
        // } else if (error instanceof Error) {
        //     console.error("General Error:", error.message);
        // } else {
        //     console.error("Unknown Error:", error);
        // }
        return null;
    }
};


  const getTherapistSlots = async (therapistId: string, serviceId: string, date: string) => {
    const response = await axios.get(`/bookingSession/therapist/${therapistId}/service/${serviceId}/available-slots?date=${date}`);
    if (response.result) {
        return response.result;
    }
    return [];
  }

  const getFreeSlots = async (serviceId: string , date: string) => {
    const response = await axios.get(`/bookingSession/service/${serviceId}/available-slots?date=${date}`);
    if (response.result) {
        return response.result;
    }
    return [];
  }

export { getTherapists, getTherapistById, getTherapistSlots, getFreeSlots};
