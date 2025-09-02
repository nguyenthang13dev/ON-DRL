import dayjs, { Dayjs } from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrBefore);

// Hàm chuyển đổi chuỗi có dấu thành không dấu => tìm kiếm tiếng Việt ở dropdown
export const removeAccents = (str: string): string => {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
};

export const calculateWorkingDays = (start: Dayjs, end: Dayjs): number => {
  let total = 0;
  let current = start.startOf("day");

  while (current.isSameOrBefore(end, "day")) {
    const dayOfWeek = current.day();

    if (dayOfWeek === 0) {
      total += 0;
    } else if (dayOfWeek === 6) {
      total += 0.5;
    } else {
      total += 1;
    }

    current = current.add(1, "day");
  }

  return total;
};