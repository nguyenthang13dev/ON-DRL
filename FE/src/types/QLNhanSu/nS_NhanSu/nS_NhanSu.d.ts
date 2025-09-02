import dayjs from "dayjs";
import { EntityType, SearchBase } from "../../general";

export interface NS_NhanSuType extends EntityType {
  chucVuId?: string;
  phongBanId?: string;
  ngaySinh?: string | dayjs.Dayjs | null;
  ngayCapCMND?: string | dayjs.Dayjs | null;
  ngayVaoLam?: string | dayjs.Dayjs | null;
  gioiTinh?: number;
  trangThai?: string | null;
  hinhAnh?: string | null;
  maNV: string | null;
  hoTen: string | null;
  cMND?: string | null;
  noiCapCMND?: string | null;
  diaChiThuongTru?: string | null;
  diaChiTamTru?: string | null;
  dienThoai?: string | null;
  email?: string | null;
  maSoThueCaNhan?: string | null;
  soTaiKhoanNganHang?: string | null;
  nganHang?: string | null;
  chucVuCode?: string | null;
  phongBanCode?: string | null;
  chucVu_txt?: string | null;
  phongBan_txt?: string | null;
}

export interface NS_NhanSuCreateOrUpdateType {
  id?: string;
  chucVuId?: string;
  phongBanId?: string;
  ngaySinh?: string | dayjs.Dayjs | null;
  ngayCapCMND?: string | dayjs.Dayjs | null;
  ngayVaoLam?: string | dayjs.Dayjs | null;
  gioiTinh?: string | null;
  trangThai?: string | null;
  hinhAnh?: File | null;
  hoTen?: string | null;
  maNV: string | null;
  cMND?: string | null;
  noiCapCMND?: string | null;
  diaChiThuongTru?: string | null;
  diaChiTamTru?: string | null;
  dienThoai?: string | null;
  email?: string | null;
  maSoThueCaNhan?: string | null;
  soTaiKhoanNganHang?: string | null;
  nganHang?: string | null;
}

export interface NS_NhanSuSearchType extends SearchBase {
  chucVuId?: string;
  ngaySinh?: string | dayjs.Dayjs | null;
  ngayCapCMND?: string | dayjs.Dayjs | null;
  ngayVaoLam?: string | dayjs.Dayjs | null;
  gioiTinh?: string | null;
  trangThai?: string | null;
  hinhAnh?: string | null;
  maNV?: string | null;
  hoTen?: string | null;
  cMND?: string | null;
  noiCapCMND?: string | null;
  diaChiThuongTru?: string | null;
  diaChiTamTru?: string | null;
  dienThoai?: string | null;
  email?: string | null;
  maSoThueCaNhan?: string | null;
  soTaiKhoanNganHang?: string | null;
  nganHang?: string | null;
}

export interface NS_NhanSuTypeDto extends NS_NhanSuType {
  phongBan_txt?: string;
  chucVu_txt?: string;
}
