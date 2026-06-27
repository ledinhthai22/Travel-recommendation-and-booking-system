import { useState, useEffect } from 'react';
import { getTopDestinationsApi } from '~/Services/HomeService';

export default function useHomeLocationsCard(limit = 12) {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                setLoading(true);
                const data = await getTopDestinationsApi(limit);
                setDestinations(data);
            } catch (err) {
                setError(err.message || 'Có lỗi xảy ra khi tải địa điểm.');
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, [limit]);

    return { destinations, loading, error };
}