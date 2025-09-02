import dayjs from "dayjs";
import { EntityType, SearchBase } from "../general";

export interface ArcPlanType extends EntityType {
	description: string;
	startDate: Date;
	endDate: Date;
	ghiChu: string;
	method: string;
	name: string;
	outcome: string;
	planID: string;
	status: string;

	//
	statusName?: string
}

export interface ArcPlanCreateOrUpdateType {
	id?: string;
	description: string;
	ghiChu: string;
	method: string;
	name: string;
	outcome: string;
	planID: string;
	status: string;
	startDate?: string | dayjs;
	endDate?: string | dayjs
}

export interface ArcPlanSearchType extends SearchBase {
	planID?: string;
	name?: string;
	description?: string;
	startDate?: string | dayjs;
	endDate?: string | dayjs
	method?: string;
	outcome?: string;
}
