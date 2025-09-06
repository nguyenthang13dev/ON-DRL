import { EntityType, SearchBase } from "../general";

export interface ActivitiesType extends EntityType {
  startDate: Date;
  endDate: Date;
  name: string;
  description: string;
  qRPath: string;
  image: string;
}

export interface ActivitiesCreateOrUpdateType {
  id?: string;
  startDate: Date;
  endDate: Date;
  name: string;
  description: string;
  qRPath: string;
  image: string;
}

export interface ActivitiesSearchType extends SearchBase {
  startDate?: Date;
  endDate?: Date;
  name?: string;
  description?: string;
  qRPath?: string;
  image?: string;
}
