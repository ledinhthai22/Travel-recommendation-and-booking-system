import { useMemo } from 'react';

export default function useHotelFilter({
    hotels, search, location, starFilter, amenityFilter, sort
}) {

    return useMemo(() => {
        return hotels
            .filter(h => {
                const matchSearch =
                    h.name.toLowerCase().includes(search.toLowerCase()) ||
                    h.location.toLowerCase().includes(search.toLowerCase());

                const matchLoc = location === 'Tất cả' || h.location === location;
                const matchStar = starFilter === 'Tất cả' || h.stars === parseInt(starFilter);
                const matchAmen =
                    amenityFilter.length === 0 ||
                    amenityFilter.every(a => h.amenities.includes(a));

                return matchSearch && matchLoc && matchStar && matchAmen;
            })
            .sort((a, b) => {
                if (sort === 'price_asc') return a.price - b.price;
                if (sort === 'price_desc') return b.price - a.price;
                if (sort === 'rating') return b.rating - a.rating;
                return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
            });

    }, [hotels, search, location, starFilter, amenityFilter, sort]);
}