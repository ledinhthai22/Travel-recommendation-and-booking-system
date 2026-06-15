export const toLocalInput = (utcString) => {
    if (!utcString) return "";

    const date = new Date(utcString);

    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
};

export const toVNTime = (utcString) => {
    if (!utcString) return "";

    const date = new Date(utcString);

    return date.toLocaleString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        hour12: false
    });
};