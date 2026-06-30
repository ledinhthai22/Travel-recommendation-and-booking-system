import { useEffect, useState } from "react";
import { getBestToursApi, getTourDesignJustForYouApi, getNextTripSuggestionsApi } from "~/Services/HomeService";
import useAuth from "~/Hooks/useAuth";

export const useBestTours = (limit = 12, type = "best") => { 
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchTours = async () => {
            try {
                setLoading(true);
                let data;

                if (isAuthenticated) {
                    // Nếu type là "next-trip" và đã đăng nhập -> Gọi API chuyến đi tiếp theo
                    if (type === "next-trip") {
                        data = await getNextTripSuggestionsApi(limit);
                    } else {
                        // Mặc định là gợi ý cá nhân
                        data = await getTourDesignJustForYouApi(limit);
                    }
                } else {
                    data = await getBestToursApi(limit);
                }
                setTours(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTours();
    }, [limit, isAuthenticated, type]);

    return { tours, loading, error };
};