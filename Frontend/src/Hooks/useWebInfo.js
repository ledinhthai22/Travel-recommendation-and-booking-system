import { useEffect, useState } from "react";
import { getWebInfoSettingsApi } from "~/services/webInfoService";

export const useWebInfo = () => {
    const [webInfo, setWebInfo] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await getWebInfoSettingsApi();
                setWebInfo(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return {
        webInfo,
        loading
    };
};