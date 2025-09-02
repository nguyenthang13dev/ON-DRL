import { EntityType, SearchBase } from "../../general";
import dayjs from "dayjs";

export interface NS_KNLamViecType extends EntityType {
  nhanSuId: string;
  tuNgay: string | dayjs.Dayjs | null;
  denNgay: string | dayjs.Dayjs | null;
  tenCongTy: string;
  chucVu: string;
  maNV: string;
  totalMonth: number;
  moTa: string;
  hoTenNhanSu?: string;
}

export interface NS_KNLamViecCreateOrUpdateType {
  id?: string;
  nhanSuId: string;
  tuNgay: string | dayjs.Dayjs | null;
  denNgay: string | dayjs.Dayjs | null;
  tenCongTy?: string | null;
  chucVu?: string | null;
  maNV?: string | null;
  totalMonth?: number | null;
  moTa?: string | null;
}
