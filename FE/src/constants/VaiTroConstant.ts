import { createConstant } from "./Constant";

export const VaiTroConstant = createConstant(
  {
    NhanVien: "NHANVIEN",
    Admin: "Admin",
    HR: "HR",
    Dev: "DEV",
    QA: "QA",
    Tester: "TESTER",
    TruongBan: "TRUONGBAN",
  },
  {
    NhanVien: { displayName: "Nhân viên" },
    Admin: { displayName: "Quản trị viên" },
    HR: { displayName: "HR" },
    Dev: { displayName: "Dev" },
    QA: { displayName: "QA" },
    Tester: { displayName: "Tester" },
    TruongBan: { displayName: "Truong ban" },
  }
);
