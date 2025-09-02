import dayjs from "dayjs";
import { EntityType, SearchBase } from "../general";

export interface ArcDocumentType extends EntityType {
	docCode: string;
	fileCode: string;
	nam: number;
	docOrdinal: number;
	typeName: string;
	codeNumber: string;
	codeNotation: string;
	issuedDate: Date;
	organName: string;
	fullName?: string;
	subject?: string;
	security: number;
	language: string;
	pageAmount: number;
	description?: string;
	keyword: string;
	mode?: string;
	confidenceLevel?: string;
	autograph?: string;
	format: string;
	attachmentName?: string;
	signature?: string;
	securityName?: string;

	//
	acttachmentId?: string;
	duongDanFile?: string;
}

export interface ArcDocumentCreateOrUpdateType {
	id?: string;
	docCode: string;
	fileCode: string;
	nam: number;
	docOrdinal: number;
	typeName: string;
	codeNumber: string;
	codeNotation: string;
	issuedDate: string | dayjs;
	organName: string;
	fullName?: string;
	subject?: string;
	security: number | string;
	language: string;
	pageAmount: number;
	description?: string;
	keyword: string;
	mode?: string;
	confidenceLevel?: string;
	autograph?: string;
	format: string;
	attachmentName?: string;
	signature?: string;

	//
	attachmentId?: string;
	duongDanFile?: string;
}

export interface ArcDocumentSearchType extends SearchBase {
	docCode?: string;
	fileCode?: string;
	typeName?: string;
	codeNumber?: string;
	codeNotation?: string;
	issuedDateFrom?: Date;
	issuedDateTo?: Date;
	organName?: string;
	subject?: string;
	security?: number;
	keyword?: string;
}
