import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import HotelFormPage from "./HotelFormPage";
import { getHotelByIdApi } from "~/Services/HotelService";

export default function HotelDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const data = await getHotelByIdApi(id);

                console.log("Hotel Detail:", data);

                setHotel(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchHotel();
    }, [id]);

    if (loading) {
        return (
            <div className="p-10 text-center">
                Đang tải dữ liệu...
            </div>
        );
    }

    if (!hotel) {
        return (
            <div className="p-10 text-center text-red-500">
                Không tìm thấy khách sạn
            </div>
        );
    }

    return (
        <div className="p-4 max-w-[1440px] mx-auto">
            <HotelFormPage
                mode="view"
                initialData={hotel}
                onCancel={() =>
                    navigate("/Quan-ly/Khach-san")
                }
            />
        </div>

    );
}