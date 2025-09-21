import { EntityType, SearchBase } from "../general";
import { TaiLieuDinhKem } from "../taiLieuDinhKem/taiLieuDinhKem";

export interface ActivitiesType extends EntityType {
  startDate: Date;
  name: string;
  description: string;
  qRPath: string;
  thumbnail: TaiLieuDinhKem | null;
}

export interface ActivitiesCreateOrUpdateType {
  id?: string;
  startDate: Date;
  name: string;
  description: string;
  qRPath: string;
  image: string;
}

export interface ActivitiesSearchType extends SearchBase {
  startDate?: Date;
  name?: string;
  description?: string;
  qRPath?: string;
}
