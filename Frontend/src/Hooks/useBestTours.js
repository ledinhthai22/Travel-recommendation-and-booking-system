import { useEffect, useState, useCallback } from "react";
import { getBestToursApi, getTourDesignJustForYouApi, getNextTripSuggestionsApi } from "~/Services/HomeService";
import useAuth from "~/Hooks/useAuth";

export const useBestTours = (limit = 12, type = "best") => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuth();

    const fetchTours = useCallback(async () => {
        try {
            setLoading(true);
            let data;

            if (isAuthenticated) {
                if (type === "next-trip") {
                    data = await getNextTripSuggestionsApi(limit);
                } else {
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
    }, [limit, isAuthenticated, type]);

    useEffect(() => {
        fetchTours();
    }, [fetchTours]);

    return { tours, loading, error, refetch: fetchTours };
};