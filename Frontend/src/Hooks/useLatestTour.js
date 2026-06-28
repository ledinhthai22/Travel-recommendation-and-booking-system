import { useEffect, useState } from "react";
import { getLatestToursApi } from "~/Services/HomeService";

export const useLatestTours = (limit = 8) => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getLatestToursApi(limit);
                setTours(data);
            } catch (err) {
                setError(err.message || "Lỗi khi tải tour mới nhất.");
            } finally {
                setLoading(false);
            }
        };
        fetchTours();
    }, [limit]);

    return { tours, loading, error };
};