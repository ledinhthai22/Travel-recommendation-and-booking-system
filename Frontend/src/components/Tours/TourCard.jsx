import { memo, useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Calendar, ArrowRight, MapPin, Image as ImageIcon } from 'lucide-react';
import { formatCurrency } from '~/Helper/FormatCurrency';
import { Tag } from 'lucide-react';
import { AuthContext } from '~/Context/AuthContext';
import { addToWishlistApi, deleteWishlistApi } from '~/Services/TourService';
import { toastError, toastSuccess } from '~/utils/Toast';


const DEFAULT_IMAGE = 'https://cdn-media.sforum.vn/storage/app/media/anh-vinh-ha-long-2.jpg';

function TourCard({
    id,
    image,
    slug,
    name,
    destination,
    duration,
    price = 0,
    rating = 0,
    reviewCount = 0,
    availableSlots,
    showWishlist = true,
    disableLink = false,
    tourType,
    initialWishlist = false
}) {
    const { isAuthenticated, setShowLoginModal } = useContext(AuthContext);
    const [wishlisted, setWishlisted] = useState(initialWishlist);
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setWishlisted(initialWishlist);
    }, [initialWishlist]);

    useEffect(() => {
        setImageError(false);
    }, [image]);

    const handleWishlistClick = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            if (setShowLoginModal) {
                setShowLoginModal(true);
            }
            return;
        }

        const previousState = wishlisted;
        setWishlisted(!previousState);

        try {
            if (!previousState) {
                await addToWishlistApi(id);
                toastSuccess("Tour đã được thêm vào danh sách yêu thích của bạn");
            } else {
                await deleteWishlistApi([id]);
            }
        } catch (error) {
            setWishlisted(previousState);
            toastError?.("Có lỗi xảy ra khi cập nhật danh sách yêu thích.");
        }
    };

    const handleImageError = () => {
        setImageError(true);
    };


    const hasValidRating = reviewCount > 0 && rating > 0;

   
    const displayImage = (imageError || !image) ? DEFAULT_IMAGE : image;

    return (
        <article
            className="
            group flex h-[320px] w-full flex-col overflow-hidden rounded-2xl
            border border-slate-100 bg-white shadow-sm
            transition-all duration-300
            hover:-translate-y-1 hover:border-[#0EA5E5]/30 hover:shadow-lg
            "
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative h-52 w-full overflow-hidden flex-shrink-0 bg-slate-100">
                {disableLink ? (
                    <>
                        <img
                            src={displayImage}
                            alt={name || "Tour du lịch"}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            onError={handleImageError}
                        />

                        {imageError && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                                <ImageIcon size={48} className="mb-2 stroke-slate-300" />
                                <span className="text-sm font-medium text-slate-500">Không có ảnh</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />
                    </>
                ) : (
                    <Link to={`/Cac-Chuyen-Di/${slug}`} className="block h-full w-full">
                        <img
                            src={displayImage}
                            alt={name || "Tour du lịch"}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            onError={handleImageError}
                        />

                        {imageError && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                                <ImageIcon size={48} className="mb-2 stroke-slate-300" />
                                <span className="text-sm font-medium text-slate-500">Không có ảnh</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />
                    </Link>
                )}


                {hasValidRating && (
                    <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm z-10">
                        <Star size={11} className="fill-amber-400 text-amber-400" />
                        <span>{rating.toFixed(1)}</span>
                        <span className="text-white/80">({reviewCount})</span>
                    </div>
                )}

                {showWishlist && (
                    <button
                        type="button"
                        onClick={handleWishlistClick}
                        className={`
                            absolute right-3 top-3 flex h-8 w-8 items-center justify-center 
                            rounded-full bg-white/90 shadow backdrop-blur-sm 
                            transition-all duration-300 
                            hover:scale-110 active:scale-95
                            z-10
                            ${isHovered || wishlisted
                                ? 'opacity-100 translate-x-0'
                                : 'opacity-0 translate-x-2'
                            }
                        `}
                    >
                        <Heart
                            size={15}
                            className={`transition-colors ${wishlisted
                                ? "fill-rose-500 text-rose-500"
                                : "text-slate-600"
                                }`}
                        />
                    </button>
                )}

                {destination && (
                    <div className="absolute left-4 bottom-4 flex items-center gap-1.5 rounded-lg bg-black/50 px-2.5 py-1.5 text-[11px] font-medium text-white backdrop-blur-sm max-w-[calc(100%-24px)] z-10">
                        <MapPin size={12} className="shrink-0" />
                        <span className="truncate">{destination}</span>
                    </div>
                )}
            </div>


            <div className="flex flex-1 flex-col p-3 pt-2">
                <div className="flex flex-col gap-1">
                    <Link to={`/Cac-Chuyen-Di/${slug}`} className="text-left block">
                        <h3
                            title={name}
                            className="
                                truncate text-[15px] font-bold leading-tight
                                text-slate-900 transition-colors duration-200
                                group-hover:text-[#0EA5E5]
                            "
                        >
                            {name}
                        </h3>
                    </Link>
                    {tourType && (
                        <div className="mt-1">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-0.5 text-[10px] font-semibold text-sky-700 uppercase tracking-wider border border-sky-200/60">
                                <Tag className="size-3 stroke-[2.5]" />
                                {tourType}
                            </span>
                        </div>
                    )}

                    <div className="flex items-center gap-1 text-left text-[11px] text-slate-500">
                        <Calendar size={12} className="shrink-0 text-slate-400" />
                        <span className="truncate">{duration || 'Liên hệ'}</span>
                    </div>
                </div>

                <div className="mt-auto pt-2.5 flex items-center justify-between gap-3 border-t border-slate-100">
                    <div className="flex flex-col text-left">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Giá từ</span>
                        <div className="flex items-end gap-1">
                            <span className="text-lg font-bold text-slate-900">{formatCurrency(price)}</span>
                            <span className="mb-[1px] text-[10px] text-slate-400">/người</span>
                        </div>
                    </div>

                    <Link
                        to={`/Cac-Chuyen-Di/${slug}`}
                        className="
                            inline-flex shrink-0 items-center justify-center
                            rounded-full bg-[#0EA5E5] px-4 py-1.5
                            text-xs font-semibold text-white
                            transition-all duration-200
                            hover:bg-[#0EA5E5]/90 hover:shadow-md active:scale-95
                        "
                    >
                        <span className="text-[11px]">Xem chi tiết</span>
                        <ArrowRight size={13} className="ml-1 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                </div>
            </div>
        </article>
    );
}

export default memo(TourCard);