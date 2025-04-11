import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext"
import { getServiceByQuizResult, servicesData } from "../data/servicesData";
import { getUser } from "../data/authData";

export default function useRecommendService() {
    const [recommendService, setRecommendService] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchService = async () => {
            try {
                setLoading(true);
                if (!user || !user.auth) {
                    const request = await servicesData("?size=6");
                    if (request.services) {
                        setRecommendService(request.services);
                    }
                } else {
                    const rq = await getUser();
                    if (rq.skinTypeId != null) {
                        const request = await getServiceByQuizResult(rq.skinTypeId);
                        if (request.result && request.result.services) {
                            setRecommendService(request.result.services);
                        }
                    } else {
                        // Fallback if user has no skin type
                        const request = await servicesData("?size=6");
                        if (request.services) {
                            setRecommendService(request.services);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching recommended services:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchService();
    }, [user]); // Re-run only when user changes

    return { recommendService, loading };
}

