import { useEffect, useState, useCallback } from "react";
import { getTopDestinationsApi } from "~/Services/HomeService";

export const useDestinations = () => {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadDestinations = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);                    // Reset lỗi cũ

            const data = await getTopDestinationsApi();
            
            setDestinations(data || []);       // Đảm bảo luôn là mảng
        } catch (err) {
            console.error("Lỗi khi load địa điểm:", err);
            setError(err);
            setDestinations([]);               // Reset data khi lỗi
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDestinations();
    }, [loadDestinations]);

    return {
        destinations,
        loading,
        error,
        refetch: loadDestinations   // Thêm refetch cho nhất quán
    };
};