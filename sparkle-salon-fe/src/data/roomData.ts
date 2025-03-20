import axios from "../services/customizedAxios";

const getRooms = async () => {
    const response = await axios.get("/rooms");
    if (response.result) {
        return response.result.content;
    }
    return [];
};

const createRoom = async (name: string, capacity: string, serviceIds: []) => {
    const response = await axios.post("/rooms", {
        name,
        capacity,
        serviceIds,
    });

    if (response.result) {
        return true;
    }
    return false;
}

const updateRoom = async (id: string, name: string, capacity: string, serviceIds: []) => {
    const response = await axios.put(`/rooms/${id}`, {
        name,
        capacity,
        serviceIds,
    });

    if (response.result) {
        return true;
    }
    return false;
}

const deleteRoom = async (id: string) => {
    const response = await axios.delete(`/rooms/${id}`);
    if (response.result) {
        return true;
    }
    return false;
}

export { getRooms , createRoom, updateRoom, deleteRoom };