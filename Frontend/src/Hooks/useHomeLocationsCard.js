import { useState, useEffect, useCallback } from 'react';
import { getHomeLocationCardsApi } from '~/Services/LocationService'; 

export default function useHomeLocationsCard(limit = 12) {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLocations = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);                    // Reset lỗi cũ

            const data = await getHomeLocationCardsApi(limit);
            
            setDestinations(data || []);       // Đảm bảo luôn là mảng
        } catch (err) {
            console.error("Lỗi tải địa điểm (HomeLocationsCard):", err);
            setError(err.message || 'Có lỗi xảy ra khi tải địa điểm.');
            setDestinations([]);               // Reset data khi lỗi
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        fetchLocations();
    }, [fetchLocations]);   // Quan trọng: dùng fetchLocations thay vì [limit]

    return { 
        destinations, 
        loading, 
        error,
        refetch: fetchLocations   // Thêm refetch để sau này dùng được
    };
}