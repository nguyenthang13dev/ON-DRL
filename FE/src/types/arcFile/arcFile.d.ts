import { NumericDictionary } from "lodash";
import { EntityType, SearchBase } from "../general";
import dayjs from "dayjs";

export interface ArcFileType extends EntityType {
	fileCode: string;
	organId?: string;
	fileCataLog: number;
	fileNotation: string;
	title: string;
	maintenance: string;
	rights: boolean;
	language: string;
	startDate: string | dayjs;
	endDate: string | dayjs;
	totalDoc?: number;
	description?: string;
	keyWord: string;
	sheetNumber?: number;
	pageNumber?: number;
	format: string;
	nam: number;
	inforSign?: string;
	maintenceName?: string;
	langName?: string;
	organName?: string;
}

export interface ArcFileCreateOrUpdateType {
	id?: string;
	fileCode: string;
	fileCataLog: number;
	fileNotation: string;
	title: string;
	maintenance: string;
	rights: boolean;
	language: string | string[];
	startDate: string | dayjs;
	endDate: string | dayjs;
	keyWord: string;
	format: string;
	nam: number;
	organId?: string;
	totalDoc?: number;
	description?: string;
	inforSign?: string;
	sheetNumber?: number;
	pageNumber?: number;
}

export interface ArcFileSearchType extends SearchBase {
	fileCode?: string;
	organId?: string;
	title?: string;
	rights?: boolean;
	language?: string;
}
