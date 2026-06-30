import { useState, useEffect } from 'react';
import { getCategoriesApi } from '~/Services/HomeService';

export const useCategories = () => {
    const [categories, setCategories] = useState([{ id: 'Tất cả', name: 'Tất cả' }]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategoriesApi();
                setCategories([{ id: 'Tất cả', name: 'Tất cả' }, ...data]);
            } catch (error) {
                console.error("Lỗi lấy danh mục:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return { categories, loading };
};