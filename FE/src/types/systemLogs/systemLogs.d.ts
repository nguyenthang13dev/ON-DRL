import { EntityType, SearchBase } from "../general";

export interface SystemLogsType extends EntityType {
  userId?: string;
	appUserName?: string;
	userName?: string;
	timestamp?: Date;
	iPAddress?: string;
	level?: string;
	logLevelName?: string;
	message?: string;
	maQuanLyId?: string;
	maQuanLyName?: string;
}

export interface SystemLogsCreateOrUpdateType {
  id?: string;
  userId?: string;
	userName?: string;
	timestamp?: Date;
	iPAddress?: string;
	level?: string;
	message?: string;
}

export interface SystemLogsSearchType extends SearchBase {
  userName?: string;
	timestampFrom?: Date;
	timestampTo?: Date;
	iPAddress?: string;
	level?: string;
	message?: string;
}
