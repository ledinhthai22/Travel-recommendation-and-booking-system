import { useState, useEffect } from 'react';
import { getHomeLocationCardsApi } from '~/Services/LocationService'; 
import { getRecommendedLocationsApi } from '~/Services/HomeService';
import useAuth from '~/Hooks/useAuth'; 
export default function useHomeLocations(limit = 12) {
    const [location, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                setLoading(true);
                let data;

                if (isAuthenticated) {
                    // Nếu đã đăng nhập: Lấy danh sách GỢI Ý
                    data = await getRecommendedLocationsApi(limit);
                } else {
                    // Nếu chưa đăng nhập: Lấy danh sách NỔI BẬT
                    data = await getHomeLocationCardsApi(limit);
                }
                
                setDestinations(data);
            } catch (err) {
                setError(err.message || 'Có lỗi xảy ra khi tải địa điểm.');
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, [limit, isAuthenticated]);

    return { location, loading, error };
}