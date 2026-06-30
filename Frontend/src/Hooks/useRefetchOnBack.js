import { useEffect } from 'react';

// Refetch lại data khi trang được phục hồi từ bfcache (back/forward của trình duyệt
// hoặc breadcrumb điều hướng khiến trang bị "đóng băng" rồi phục hồi nguyên trạng cũ).
export default function useRefetchOnBack(refetchFn) {
    useEffect(() => {
        const handlePageShow = (event) => {
            if (event.persisted) {
                refetchFn();
            }
        };
        window.addEventListener('pageshow', handlePageShow);
        return () => window.removeEventListener('pageshow', handlePageShow);
    }, [refetchFn]);
}