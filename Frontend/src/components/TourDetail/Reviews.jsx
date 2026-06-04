import { Star } from "lucide-react";

export function Reviews({
    reviews = [],
    reviewCount = 0
}) {
    const averageRating =
        reviews.length > 0
            ? (
                  reviews.reduce(
                      (sum, review) =>
                          sum + review.diemDanhGia,
                      0
                  ) / reviews.length
              ).toFixed(1)
            : 0;

    return (
        <div>
            <h2 className="mb-4 text-[24px] font-bold text-slate-800">
                Đánh giá
            </h2>

            <div className="rounded-4xl border border-slate-200 p-4">

                {/* Summary */}
                <div className="mb-5 flex items-center gap-4 rounded-4xl border border-slate-200 bg-slate-50 p-4">

                    <div className="text-center">
                        <p
                            className="text-4xl font-bold"
                            style={{ color: "#0EA5E5" }}
                        >
                            {averageRating}
                        </p>

                        <div className="mt-1 flex justify-center gap-0.5">
                            {Array.from({ length: 5 }).map(
                                (_, i) => (
                                    <Star
                                        key={i}
                                        size={14}
                                        fill={
                                            i <
                                            Math.floor(
                                                averageRating
                                            )
                                                ? "#FBBF24"
                                                : "transparent"
                                        }
                                        stroke="#FBBF24"
                                    />
                                )
                            )}
                        </div>

                        <p className="mt-1 text-xs text-slate-500">
                            {reviewCount} đánh giá
                        </p>
                    </div>

                    <div className="flex-1 space-y-1.5">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count =
                                reviews.filter(
                                    (r) =>
                                        r.diemDanhGia ===
                                        star
                                ).length;

                            const percentage =
                                reviewCount > 0
                                    ? (count /
                                          reviewCount) *
                                      100
                                    : 0;

                            return (
                                <div
                                    key={star}
                                    className="flex items-center gap-2"
                                >
                                    <span className="w-2 text-right text-xs text-slate-500">
                                        {star}
                                    </span>

                                    <Star
                                        size={11}
                                        fill="#FBBF24"
                                        stroke="#FBBF24"
                                    />

                                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                                        <div
                                            className="h-full rounded-full bg-amber-400"
                                            style={{
                                                width: `${percentage}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div
                            key={review.maDanhGia}
                            className="rounded-4xl border border-slate-100 bg-white p-4 shadow-sm"
                        >
                            <div className="mb-2 flex items-center justify-between">

                                <div className="flex items-center gap-2.5">

                                    <div
                                        className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                                        style={{
                                            backgroundColor:
                                                "#0EA5E5",
                                        }}
                                    >
                                        {review.nguoiDung.hoTen.charAt(
                                            0
                                        )}
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">
                                            {
                                                review
                                                    .nguoiDung
                                                    .hoTen
                                            }
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            {
                                                review.ngayTao
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-0.5">
                                    {Array.from({
                                        length:
                                            review.diemDanhGia,
                                    }).map(
                                        (_, index) => (
                                            <Star
                                                key={
                                                    index
                                                }
                                                size={13}
                                                fill="#FBBF24"
                                                stroke="#FBBF24"
                                            />
                                        )
                                    )}
                                </div>

                            </div>

                            <p className="text-sm leading-relaxed text-slate-600">
                                {review.noiDung}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

