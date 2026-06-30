import { useEffect, useState } from "react";
import { getTopDestinationsApi } from "~/Services/HomeService";

export const useDestinations = () => {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDestinations = async () => {
            try {
                setLoading(true);
                const data = await getTopDestinationsApi();
                setDestinations(data);
            } catch (err) {
                console.error("Lỗi khi load địa điểm:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadDestinations();
    }, []);

    return {
        destinations,
        loading,
        error
    };
};