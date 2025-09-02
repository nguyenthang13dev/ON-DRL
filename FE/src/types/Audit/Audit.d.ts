import { SearchBase } from "../general";

export interface tableAuditDataType {
    id?: string;
    sessionID: string;
    auditID: string;
    iPAddress: string;
    userName: string;
    userId: string;
    uRLAccessed: string;
    timeAccessed: Date;
    note: string;
    type: number;
    // A new Data property that is going to store JSON;
    // string objects that will later be able to be;
    // deserialized into objects if necessary to view;
    // details about a Request;
    data: string;
}


export interface createEditType {
    id?: string;
    sessionID: string;
    auditID: string;
    iPAddress: string;
    userName: string;
    userId: string;
    uRLAccessed: string;
    timeAccessed: Date;
    note: string;
    type: number;
    // A new Data property that is going to store JSON;
    // string objects that will later be able to be;
    // deserialized into objects if necessary to view;
    // details about a Request;
    data: string;
}
export interface searchAuditDataType extends SearchBase {
    sessionID?: string;
    auditID?: string;
    iPAddress?: string;
    userName?: string;
    userId?: string;
    uRLAccessed?: string;
    timeAccessed?: Date;
    note?: string;
    type?: number;
    // A new Data property that is going to store JSON;
    // string objects that will later be able to be;
    // deserialized into objects if necessary to view;
    // details about a Request;
    data?: string;
}
export interface tableConfigImport {
    order: number;
    columnName?: string;
    displayName?: string;
}
export interface ImportResponse {
    data?: tableAuditDataType[];
}
