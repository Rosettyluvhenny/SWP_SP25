import { head } from "lodash";
import axios from "../services/customizedAxios";

export interface Service {
    id: string;
    name: string;
};

export interface Room {
    id: string;
    name: string;
    capacity: string;
    inUse: string
    services: Service[];
};

const getRooms = async () => {
    try {
        const response = await axios.get("/rooms", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (response.result && response.result.content) {
            return response.result.content.map((room: Room) => ({
                id: room.id,
                name: room.name,
                capacity: room.capacity || "",
                inUse: room.inUse || "0",
                services: room.services ? room.services.map((service: Service) => ({
                    id: service.id,
                    name: service.name
                }),) : [],
            }));
        }

        return [];
    } catch (error) {
        console.error("Error fetching rooms:", error);
        return [];
    }
};

const getRoomById = async (id: string) => {
    try {
        const response = await axios.get(`/rooms/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
        return response.result;
    } catch (error) {
        console.error("Error fetching room by id:", error);
        return null;
    }
}

const createRoom = async (name: string, capacity: string, services: Service[]) => {
    try {
        const response = await axios.post("/rooms", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },

            name,
            capacity,
            services,
        });

        return response.result;
    } catch (error) {
        console.error("Error creating room:", error);
        return false;
    }
};

const updateRoom = async (
    id: string,
    name: string,
    capacity: string,
    services: Service[]
) => {
    try {
        const response = await axios.put(`/rooms/${id}`, {

            name,
            capacity,
            services,
        });

        return response.result;
    } catch (error) {
        console.error("Error updating room:", error);
        return false;
    }
};

const deleteRoom = async (id: string) => {
    try {
        const response = await axios.delete(`/rooms/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
        );
        return response.result;
    } catch (error) {
        console.error("Error deleting room:", error);
        return false;
    }
}

const assignService = async (roomId: string, serviceId: string) => {
    try {
        const response = await axios.post(`/rooms/${roomId}/services/${serviceId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
        );
        return response.result;
    } catch (error) {
        console.error("Error assigning service to room:", error);
        return false;
    }
}

const getRoomServices = async (serviceId: string) => {
    try {
        const response = await axios.get(`/rooms/service/${serviceId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
        );
        return response.result;
    } catch (error) {
        console.error("Error fetching services for room:", error);
        return [];
    }
}

const deleteAssignedService = async (roomId: string, serviceId: string) => {
    try {
        const response = await axios.delete(`/rooms/${roomId}/services/${serviceId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
        );
        return response.result;
    } catch (error) {
        console.error("Error deleting assigned service:", error);
        return false;
    }
}

export { getRooms, createRoom, updateRoom, deleteRoom, assignService, getRoomServices, deleteAssignedService, getRoomById };