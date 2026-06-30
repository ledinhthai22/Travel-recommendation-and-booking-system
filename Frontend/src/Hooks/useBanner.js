import { useEffect, useState, useCallback } from "react";
import { getPublicBannerApi } from "~/Services/BannerService";

export default function useBanner() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBanners = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getPublicBannerApi();
            setBanners(data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBanners();
    }, [fetchBanners]);

    return {
        banners,
        loading,
        refresh: fetchBanners
    };
}