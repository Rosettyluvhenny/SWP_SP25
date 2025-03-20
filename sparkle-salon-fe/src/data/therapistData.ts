import axios from "../services/customizedAxios";

const getTherapists = async () => {
    const response = await axios.get("/therapists");
    if (response.result) {
        return response.result.content;
    }
    return [];
};

const createTherapist = async (data: {username: string, fullName: string, email: string, experienceYears: number, bio: string, dob: string, phone: string, img:string}) => {
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

const updateTherapist = async (id:string, experienceYears: number, bio: string, phone: string, img: string) => {
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

export { getTherapists, createTherapist, updateTherapist, deleteTherapist, disableTherapist };