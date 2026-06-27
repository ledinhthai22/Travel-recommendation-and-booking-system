import { useEffect, useState } from "react";
import { getBestToursApi } from "~/Services/HomeService";

export const useBestTours = () => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                setLoading(true);
                const data = await getBestToursApi();
                setTours(data);
            } catch (err) {
                console.error("Lỗi khi load Best Tours:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTours();
    }, []);

    return { tours, loading };
};