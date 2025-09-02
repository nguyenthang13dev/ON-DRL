import { EntityType, SearchBase } from "../general";

export interface ArcFilePlanType extends EntityType {
	fileCode: string;
	fileCatalog: number;
	fileNotaion: string;
	title: string;
}

export interface ArcFilePlanCreateOrUpdateType {
	id?: string;
	fileCode: string;
	fileCatalog: number;
	fileNotaion: string;
	title: string;
}

export interface ArcFilePlanSearchType extends SearchBase {
	fileCode?: string;
	fileCatalog?: number;
	fileNotaion?: string;
	title?: string;
}
