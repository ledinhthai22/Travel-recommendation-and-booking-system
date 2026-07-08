import axiosClient from "./axiosClient";

export const createScheduleApi = async (data) => {
    const response = await axiosClient.post(
        "/admin/Schedule",
        data,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

 
    return response.data;
};

export const getScheduleByTourApi = async (maTour) => {
    const response = await axiosClient.get(
        `/admin/Schedule/tour/${maTour}`
    );

    return response.data;
};

export const updateScheduleApi = async (maLichTrinh, data) => {
    const response = await axiosClient.put(
        `/admin/Schedule/${maLichTrinh}`,
        data,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    
    return response.data;
};

export const deleteScheduleApi = async (maLichTrinh) => {
    const response = await axiosClient.delete(
        `/admin/Schedule/${maLichTrinh}`
    );

    return response.data;
};

export const createScheduleDetailApi = async (data) => {
    const response = await axiosClient.post(
        "/admin/Schedule/create-ScheduleDetail",
        data
    );

    return response.data;
};

export const getScheduleDetailApi = async (maLichTrinh) => {
    const response = await axiosClient.get(
        `/admin/Schedule/by-Schedule/${maLichTrinh}`
    );

    return response.data;
};

export const updateScheduleDetailApi = async (maCTLT, data) => {
    const response = await axiosClient.put(
        `/admin/Schedule/update-ScheduleDetail/${maCTLT}`,
        data
    );

    return response.data;
};

export const deleteScheduleDetailApi = async (maCTLT) => {
    const response = await axiosClient.delete(
        `/admin/Schedule/delete-ScheduleDetail/${maCTLT}`
    );

    return response.data;
};

export const mapScheduleFromApi = (scheduleData) => {
    if (!scheduleData) return null;
    
    return {
        id: scheduleData.maLichTrinh,
        maLichTrinh: scheduleData.maLichTrinh,
        maTour: scheduleData.maTour,
        tenLichTrinh: scheduleData.tenLichTrinh || "",
        buaAn: scheduleData.buaAn || "",
        soThuTuNgay: scheduleData.soThuTuNgay,
        hoatDongChinh: scheduleData.hoatDongChinh || "",
        luuY: scheduleData.luuY || "",
        trangThai: scheduleData.trangThai ?? true,
        duongDanAnh: scheduleData.duongDanAnh || "",
        maKhachSan: scheduleData.maKhachSan?.toString() || "",
        tenKhachSan: scheduleData.tenKhachSan || "",
        slugKhachSan: scheduleData.slugKhachSan || "",
        soSaoKhachSan: scheduleData.soSaoKhachSan,
        preview: scheduleData.duongDanAnh ? 
            (scheduleData.duongDanAnh.startsWith("http") ? 
                scheduleData.duongDanAnh : 
                `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://localhost:7016'}${scheduleData.duongDanAnh}`
            ) : null,
        file: null,
        chiTietLichTrinhs: (scheduleData.chiTietLichTrinhs || []).map(ct => ({
            maCTLT: ct.maCTLT,
            maLichTrinh: ct.maLichTrinh,
            maDiaDiem: ct.maDiaDiem,
            gioBatDau: ct.gioBatDau || "",
            gioKetThuc: ct.gioKetThuc || null,
            hoatDong: ct.hoatDong || ""
        }))
    };
};


export const mapScheduleDetailFromApi = (detailData) => {
    if (!detailData) return null;
    
    return {
        maCTLT: detailData.maCTLT,
        maLichTrinh: detailData.maLichTrinh,
        maDiaDiem: detailData.maDiaDiem,
        tenDiaDiem: detailData.tenDiaDiem || "",
        gioBatDau: detailData.gioBatDau || "",
        gioKetThuc: detailData.gioKetThuc || null,
        hoatDong: detailData.hoatDong || ""
    };
};