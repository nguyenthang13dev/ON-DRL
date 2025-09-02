import { EntityType, SearchBase } from "../../general";
import dayjs from "dayjs";

export interface NS_BangCapType extends EntityType {
  nhanSuId: string;
  trinhDoId: string;
  ngayCap: string | dayjs.Dayjs | null;
  noiCap: string;
  ghiChu: string;
}

export interface NS_BangCapCreateOrUpdateType {
  id?: string;
  nhanSuId: string;
  trinhDoId: string;
  ngayCap?: string | dayjs.Dayjs | null;
  noiCap: string;
  ghiChu?: string | null;
}

export interface NS_BangCapSearchType extends SearchBase {
  nhanSuId?: string;
  trinhDoId?: string;
  ngayCap?: string | dayjs.Dayjs | null;
  noiCap?: string;
  ghiChu?: string;
}
