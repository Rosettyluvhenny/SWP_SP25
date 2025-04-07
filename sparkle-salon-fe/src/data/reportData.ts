import axios from "../services/customizedAxios";

export interface Receipt {
    id: number;
    date: string;
    amount: number;
    serviceName: string;
    customerName: string;
    paymentMethod: string;
    paymentType: string;
    url: string;
    staffName: string;
}

export interface Report {
    id: number;
    date: string;
    revenue: number;
    totalBooking: number;
    receipts: Receipt[];
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
        
        if (response.result) {
            return response.result;
        }
        
        return response.result || [];
    } catch (error) {
        console.error("Error fetching reports:", error);
        return [];
    }
}

export const getReceipt = async (date?: string): Promise<Receipt[]> => {
    try {
        const response = await axios.get("/receipt", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: {
                date
            }
        });
        
        if (response.result) {
            return response.result;
        }
        
        return [];
    } catch (error) {
        console.error("Error fetching receipts:", error);
        return [];
    }
}

export const getAllReceipt = async (from: string, to: string): Promise<Receipt[]> => {
    try {
        const response = await axios.get("/receipt/all", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: {
                from,
                to
            }
        });
        
        if (response.result) {
            return response.result;
        }
        
        return response.result || [];
    } catch (error) {
        console.error("Error fetching reports:", error);
        return [];
    }
}