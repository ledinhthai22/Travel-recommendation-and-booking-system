export const formatCurrency = (value) => {
    const numericValue = Number(value || 0);

    if (numericValue >= 1000000000) {
        return `${(numericValue / 1000000000).toFixed(2).replace(/\.00$/, '')} Tỷ ₫`;
    }

    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(numericValue);
};