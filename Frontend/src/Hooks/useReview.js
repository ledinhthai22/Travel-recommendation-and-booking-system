import { useEffect, useState } from "react";
import { getApprovedReviewsApi } from "~/Services/ReviewService";

export const useReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadReviews = async () => {
            try {
                setLoading(true);
                const data = await getApprovedReviewsApi();
                setReviews(data);
            } catch (err) {
                console.error("Lỗi khi load đánh giá:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        loadReviews();
    }, []);

    return {
        reviews,
        loading,
        error
    };
};