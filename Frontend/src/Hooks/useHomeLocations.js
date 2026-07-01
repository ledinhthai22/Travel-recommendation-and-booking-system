import { useState, useEffect, useCallback } from 'react';
import { getHomeLocationCardsApi } from '~/Services/LocationService';
import { getRecommendedLocationsApi } from '~/Services/HomeService';
import useAuth from '~/Hooks/useAuth';

export default function useHomeLocations(limit = 12) {
    const [location, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuth();

    const fetchLocations = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);                    // Reset error mỗi lần fetch

            let data;
            if (isAuthenticated) {
                data = await getRecommendedLocationsApi(limit);
            } else {
                data = await getHomeLocationCardsApi(limit);
            }

            setDestinations(data || []);       // Đảm bảo luôn là mảng
        } catch (err) {
            console.error("Lỗi tải địa điểm:", err);
            setError(err.message || 'Có lỗi xảy ra khi tải địa điểm.');
            setDestinations([]);               // Reset data khi lỗi
        } finally {
            setLoading(false);
        }
    }, [limit, isAuthenticated]);

    // Fetch khi component mount và khi dependencies thay đổi
    useEffect(() => {
        fetchLocations();
    }, [fetchLocations]);

    return { 
        location, 
        loading, 
        error, 
        refetch: fetchLocations 
    };
}