import axios from "../services/customizedAxios";

export interface Report {
    id: number;
    date: string;
    revenue: number;
    totalBooking: number;
}

export const getAllReport = async (from: string, to: string): Promise<Report[]> => {
    try {
        const response = await axios.get("/report/all", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: {
                from,
                to
            }
        });
        console.log("Full response:", response);
        console.log("Response result:", response.result);
        return response.result;
    } catch (error) {
        console.error("Error fetching reports:", error);
        return [];
    }
}