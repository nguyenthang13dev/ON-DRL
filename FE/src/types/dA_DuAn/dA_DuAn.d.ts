import { EntityType, SearchBase } from "../general";
import dayjs from "dayjs";
import { DA_NoiDungCuocHopType } from "./dA_NoiDungCuocHop";

export interface DA_DuAnType extends EntityType {
  ngayBatDau: string | dayjs.Dayjs | null;
  ngayKetThuc: string | dayjs.Dayjs | null;
  tenDuAn: string;
  moTaDuAn: string;
  ngayTiepNhan: string | dayjs.Dayjs | null;
  yeuCauDuAn: string;
  trangThaiThucHien: number | null;
  timeCaiDatMayChu: string | dayjs.Dayjs | null;
  isBackupMayChu: boolean;
  linkDemo: string;
  linkThucTe: string;
  phanCongList?: DA_PhanCongType[] | null;

  tenTrangThaiThucHien?: number | null


  hasFileKhaoSat: boolean;
  hasFileNoiDungKhaoSat: boolean;
  hasFileKeHoachTrienKhaiKhachHang: boolean;
  hasFileKeHoachTrienKhaiNoiBo: boolean;
  hasFileTestCase: boolean;
  hasCheckListNghiemThuKyThuat: boolean;
  hasFileNghiemThuKyThuat: boolean;
}

export interface DA_DuAnCreateOrUpdateType extends EntityType {
  id?: string;
  ngayBatDau: string | dayjs.Dayjs | null;
  ngayKetThuc: string | dayjs.Dayjs | null;
  tenDuAn: string;
  moTaDuAn?: string | null;
  ngayTiepNhan?: string | dayjs.Dayjs | null;
  yeuCauDuAn?: string | null;
  trangThaiThucHien?: number | null;
  timeCaiDatMayChu?: string | dayjs.Dayjs | null;
  isBackupMayChu?: boolean | null;
  linkDemo?: string | null;
  linkThucTe?: string | null;
  phanCongList?: DA_PhanCongType[] | null;
}

export interface DA_DuAnSearchType extends SearchBase {
  ngayBatDau?: string | dayjs.Dayjs | null;
  ngayKetThuc?: string | dayjs.Dayjs | null;
  tenDuAn?: string;
  moTaDuAn?: string;
  ngayTiepNhan?: string | dayjs.Dayjs | null;
  yeuCauDuAn?: string;
  trangThaiThucHien?: number | null;
  timeCaiDatMayChu?: string | dayjs.Dayjs | null;
  isBackupMayChu?: boolean;
  linkDemo?: string;
  linkThucTe?: string;
}
