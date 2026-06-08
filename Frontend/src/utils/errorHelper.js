export const getErrorMessage = (error) => {
    const data = error?.response?.data;

    if (!data) {
        return "Không thể kết nối đến máy chủ";
    }

    if (typeof data === "string") {
        return data;
    }

    if (data.message) {
        return data.message;
    }

    if (data.errors) {
        const firstKey = Object.keys(data.errors)[0];

        if (
            firstKey &&
            Array.isArray(data.errors[firstKey])
        ) {
            return data.errors[firstKey][0];
        }
    }

    return "Có lỗi xảy ra";
};