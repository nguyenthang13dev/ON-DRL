import { EntityType, SearchBase } from "../general";

export interface ChuKyType extends EntityType {
  userId: string;
  name: string;
  duongDanFile: string;
}
