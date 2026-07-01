import { useEffect, useState, useCallback } from "react";
import { getApprovedReviewsApi } from "~/Services/ReviewService";

export const useReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadReviews = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);                    // Reset lỗi trước khi fetch

            const data = await getApprovedReviewsApi();
            
            setReviews(data || []);            // Đảm bảo là mảng
        } catch (err) {
            console.error("Lỗi khi load đánh giá:", err);
            setError(err);
            setReviews([]);                    // Reset data khi lỗi
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadReviews();
    }, [loadReviews]);

    return {
        reviews,
        loading,
        error,
        refetch: loadReviews
    };
};