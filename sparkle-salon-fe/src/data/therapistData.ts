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
    const response = await axios.get("/therapists/by-service/"+serviceId,
      {headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
   });
    if (response.result) {
        return response.result.content;
    }
    return [];
};

const createTherapist = async (data: { username: string, fullName: string, email: string, experienceYears: number, bio: string, dob: string, phone: string, img: string }) => {
  const response = await axios.post("/therapists", {
    username: data.username,
    fullName: data.fullName,
    email: data.email,
    experienceYears: data.experienceYears,
    bio: data.bio,
    dob: data.dob,
    phone: data.phone,
    img: data.img
  });

  if (response.result) {
    return true;
  }
  return false;
}

const updateTherapist = async (id: string, experienceYears: number, bio: string, phone: string, img: string) => {
  const response = await axios.put(`/therapists/${id}`, {
    experienceYears: experienceYears,
    bio: bio,
    phone: phone,
    img: img
  });

  if (response.result) {
    return true;
  }
  return false;
}

const deleteTherapist = async (id: string) => {
  const response = await axios.delete(`/therapists/${id}`);
  if (response.result) {
    return true;
  }
  return false;
}

const disableTherapist = async (id: string) => {
  const response = await axios.put(`/therapists/${id}/disable`);
  if (response.result) {
    return true;
  }
  return false;
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
    const response = await axios.get(`/bookingSession/therapist/${therapistId}/service/${serviceId}/available-slots?date=${date}`,
        {headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.result) {
        return response.result;
    }
    return [];
  }

  const getFreeSlots = async (serviceId: string , date: string) => {
    const response = await axios.get(`/bookingSession/service/${serviceId}/available-slots?date=${date}`,
      {headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
    if (response.result) {
        return response.result;
    }
    return [];
  }

export {createTherapist, updateTherapist,deleteTherapist,disableTherapist, getTherapists, getTherapistById, getTherapistSlots, getFreeSlots};
