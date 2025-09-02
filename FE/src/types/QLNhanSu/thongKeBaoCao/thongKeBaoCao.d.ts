import { NS_NhanSuType } from "../nS_NhanSu/nS_NhanSu";

export interface BaoCaoTHongKeNS {
  nameSearch?: string;
  total: number;
  listItem: NS_NhanSuType[];
}
