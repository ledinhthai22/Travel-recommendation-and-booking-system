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
            let data;

            if (isAuthenticated) {
                data = await getRecommendedLocationsApi(limit);
            } else {
                data = await getHomeLocationCardsApi(limit);
            }

            setDestinations(data);
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra khi tải địa điểm.');
        } finally {
            setLoading(false);
        }
    }, [limit, isAuthenticated]);

    useEffect(() => {
        fetchLocations();
    }, [fetchLocations]);

    return { location, loading, error, refetch: fetchLocations };
}