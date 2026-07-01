import { useEffect, useState, useCallback } from "react";
import { getRecommendedLocationsApi } from "~/Services/HomeService";

export const useRecommendedLocations = (limit = 4) => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLocations = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);                    // Reset lỗi cũ

            const data = await getRecommendedLocationsApi(limit);
            
            setLocations(data || []);          // Đảm bảo là mảng
        } catch (err) {
            console.error("Lỗi tải địa điểm gợi ý:", err);
            setError(err.response?.data?.message || "Lỗi khi tải địa điểm gợi ý.");
            setLocations([]);                  // Reset data khi lỗi
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        fetchLocations();
    }, [fetchLocations]);   // Quan trọng

    return { 
        locations, 
        loading, 
        error,
        refetch: fetchLocations   // Thêm refetch tiện sau này
    };
};