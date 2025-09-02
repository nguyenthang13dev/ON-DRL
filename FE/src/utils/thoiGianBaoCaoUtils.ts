// src/utils/baoCao/thoiGianUtils.ts
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {LOAI_BAO_CAO_CONSTANT} from "@/constants/BaoCao/LoaiBaoCaoConstant";
import {Form, Select} from "antd";
import React from "react";

dayjs.extend(utc);

/**
 * Kiểm tra xem kỳ báo cáo có phải là trong tương lai hay không
 * @param periodType Loại kỳ báo cáo (THANG, QUY, SAU_THANG, CHIN_THANG, NAM)
 * @param year Năm báo cáo
 * @param period Kỳ báo cáo (tháng, quý, hoặc nửa năm)
 */
export const isPeriodInFuture = (
    periodType: string,
    year: number,
    period: number
): boolean => {
    const now = dayjs();
    const currentYear = now.year();

    // If the selected year is in the future, nothing should be disabled
    if (year > currentYear) return false;

    // If the selected year is in the past, nothing should be disabled
    if (year < currentYear) return false;

    // For the current year, check based on the period type
    if (year === currentYear) {
        const currentMonth = now.month() + 1; // dayjs months are 0-indexed

        switch (periodType) {
            case LOAI_BAO_CAO_CONSTANT.THANG:
                return period > currentMonth;
            case LOAI_BAO_CAO_CONSTANT.QUY:
                const currentQuarter = Math.ceil(currentMonth / 3);
                return period > currentQuarter;
            case LOAI_BAO_CAO_CONSTANT.SAU_THANG:
                const currentHalfYear = currentMonth > 6 ? 2 : 1;
                return period > currentHalfYear;
            default:
                return false;
        }
    }

    return false;
};

/**
 * Tính khoảng thời gian dựa trên loại báo cáo
 * @param loaiBaoCao Loại báo cáo (THANG, QUY, SAU_THANG, CHIN_THANG, NAM)
 * @param nam Năm báo cáo
 * @param thang Tháng báo cáo (cho báo cáo THANG)
 * @param quy Quý báo cáo (cho báo cáo QUY, 1-4)
 * @param nua Nửa năm (cho báo cáo SAU_THANG, 1: nửa đầu, 2: nửa cuối)
 */
export const tinhKhoangThoiGian = (loaiBaoCao: string, nam?: number, thang?: number, quy?: number, nua?: number) => {
    const now = dayjs();
    const currentYear = nam || now.year();
    const currentMonth = thang || now.month() + 1; // dayjs month is 0-indexed
    const previousYear = currentYear - 1;

    switch (loaiBaoCao) {
        case LOAI_BAO_CAO_CONSTANT.THANG: {
            // Báo cáo hằng tháng: Từ ngày 06 tháng trước đến ngày 05 của tháng báo cáo
            const selectedMonth = thang || currentMonth;
            const previousMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
            const previousMonthYear = selectedMonth === 1 ? previousYear : currentYear;

            const from = dayjs().year(previousMonthYear).month(previousMonth - 1).date(6);
            const to = dayjs().year(currentYear).month(selectedMonth - 1).date(5);

            return {from, to};
        }
        case LOAI_BAO_CAO_CONSTANT.QUY: {
            const selectedQuy = quy || 1;

            if (selectedQuy === 1) {
                // Báo cáo Quý I: Từ ngày 06/12 năm trước đến ngày 05/03 năm báo cáo
                const from = dayjs().year(previousYear).month(11).date(6);
                const to = dayjs().year(currentYear).month(2).date(5);
                return {from, to};
            }
            // else if (selectedQuy === 2) {
            //     // Từ ngày 06/03 đến ngày 05/06
            //     const from = dayjs().year(currentYear).month(2).date(6);
            //     const to = dayjs().year(currentYear).month(5).date(5);
            //     return {from, to};
            // } else if (selectedQuy === 3) {
            //     // Từ ngày 06/06 đến ngày 05/09
            //     const from = dayjs().year(currentYear).month(5).date(6);
            //     const to = dayjs().year(currentYear).month(8).date(5);
            //     return {from, to};
            // } else {
            //     // Từ ngày 06/09 đến ngày 05/12
            //     const from = dayjs().year(currentYear).month(8).date(6);
            //     const to = dayjs().year(currentYear).month(11).date(5);
            //     return {from, to};
            // }
        }
        case LOAI_BAO_CAO_CONSTANT.SAU_THANG: {
            // Báo cáo 6 tháng
            if (nua === 2) {
                // Nửa cuối năm: 06/06 - 05/12
                const from = dayjs().year(currentYear).month(5).date(6);
                const to = dayjs().year(currentYear).month(11).date(5);
                return {from, to};
            }
            // else {
            //     // Nửa đầu năm (mặc định): 06/12 năm trước - 05/06
            //     const from = dayjs().year(previousYear).month(11).date(6);
            //     const to = dayjs().year(currentYear).month(5).date(5);
            //     return {from, to};
            // }
        }
        case LOAI_BAO_CAO_CONSTANT.CHIN_THANG: {
            // Báo cáo 9 tháng: Từ ngày 06/12 năm trước đến ngày 05/09 năm báo cáo
            const from = dayjs().year(previousYear).month(11).date(6);
            const to = dayjs().year(currentYear).month(8).date(5);
            return {from, to};
        }
        case LOAI_BAO_CAO_CONSTANT.NAM: {
            // Báo cáo năm: Từ ngày 06/12 năm trước đến ngày 05/12 năm báo cáo
            const from = dayjs().year(previousYear).month(11).date(6);
            const to = dayjs().year(currentYear).month(11).date(5);
            return {from, to};
        }
        default:
            // Mặc định là báo cáo tháng hiện tại
            const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
            const previousMonthYear = currentMonth === 1 ? previousYear : currentYear;

            const from = dayjs().year(previousMonthYear).month(previousMonth - 1).date(6);
            const to = dayjs().year(currentYear).month(currentMonth - 1).date(5);

            return {from, to};
    }
};




export const formatDateRange = (from: dayjs.Dayjs, to: dayjs.Dayjs) => {
    return `Từ ${from.format("DD/MM/YYYY")} đến ${to.format("DD/MM/YYYY")}`;
};

