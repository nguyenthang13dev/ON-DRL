import { EntityType, SearchBase } from "../general";

export interface EmailTemplateType extends EntityType {
  code: string;
  name: string;
  content: string;
  tenLoaiEmailTemPlate?: string;
  loaiTemPlate?: string;
  description?: string;
  isActive: boolean;
  lstKeyEmailTemplate?: KeyEmailTemplateType[]; 
}

export interface KeyEmailTemplateType {
  id?: string;
  key: string;
  value: string;
  emailTemplateId: string;
}
export interface EmailTemplateCreateOrUpdateType {
  id?: string;
  code: string;
  name: string;
  content: string;
  loaiTemPlate?: string;
  description?: string;
  isActive?: boolean;
  lstKeyEmailTemplate?: Record<string, string>;
}

export interface EmailTemplateSearchType extends SearchBase {
  code?: string;
  Name?: string;
  loaiTemPlate?: string;
  isActive?: boolean;
} 