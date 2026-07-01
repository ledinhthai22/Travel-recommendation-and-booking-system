// ~/Hooks/useRefetchOnBack.js
import { useEffect, useRef } from 'react';

export default function useRefetchOnBack(refetchFn) {
    const refetchRef = useRef(refetchFn);
    refetchRef.current = refetchFn;

    useEffect(() => {
        const handleRefetch = () => {
            // Delay một chút để đảm bảo component đã mounted lại
            setTimeout(() => {
                refetchRef.current();
            }, 100);
        };

        window.addEventListener('pageshow', handleRefetch);
        window.addEventListener('focus', handleRefetch);
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') handleRefetch();
        });

        // Popstate (khi bấm back/forward)
        window.addEventListener('popstate', handleRefetch);

        return () => {
            window.removeEventListener('pageshow', handleRefetch);
            window.removeEventListener('focus', handleRefetch);
            document.removeEventListener('visibilitychange', handleRefetch);
            window.removeEventListener('popstate', handleRefetch);
        };
    }, []);
}