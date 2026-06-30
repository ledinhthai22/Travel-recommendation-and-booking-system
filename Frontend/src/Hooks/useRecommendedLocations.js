import { useEffect, useState } from "react";
import { getRecommendedLocationsApi } from "~/Services/HomeService";

export const useRecommendedLocations = (limit = 4) => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                setLoading(true);
                const data = await getRecommendedLocationsApi(limit);
                setLocations(data);
            } catch (err) {
                setError(err.response?.data?.message || "Lỗi khi tải địa điểm gợi ý.");
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, [limit]); 

    return { locations, loading, error };
};