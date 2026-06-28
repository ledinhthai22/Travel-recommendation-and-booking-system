import { useEffect, useState } from "react";
import { getBestToursApi } from "~/Services/HomeService";

export const useBestTours = (limit = 12) => { 
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getBestToursApi(limit);
                setTours(data);
            } catch (err) {
                setError(err.message || "Có lỗi xảy ra khi tải Best Tours.");
                console.error("Lỗi khi load Best Tours:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTours();
    }, [limit]);

    return { tours, loading, error };
};