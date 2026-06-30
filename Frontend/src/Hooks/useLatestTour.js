import { useEffect, useState } from "react";
import { getRecommendedToursApi, getLatestToursApi } from "~/Services/HomeService";
import useAuth from "~/Hooks/useAuth"; 
export const useLasterTours = (limit = 12) => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchTours = async () => {
            try {
                setLoading(true);
                setError(null);
                
                let data;
                if (isAuthenticated) {
                    data = await getRecommendedToursApi(limit);
                } else {
                    data = await getLatestToursApi(limit);
                }
                
                setTours(data);
            } catch (err) {
                setError(err.message || "Lỗi khi tải dữ liệu tour.");
            } finally {
                setLoading(false);
            }
        };
        fetchTours();
    }, [limit, isAuthenticated]);

    return { tours, loading, error };
};