import { ConfigFormType } from "../ConfigForm/ConfigForm";

export interface tableConfigFormKeyEditVMData { 
    id? : string;
    ktT_KEY?: string;
    ktT_TYPE?: string;
    min?: number;
    max?: number;
    isSystem: boolean;
    isRequired: boolean;
    defaultKey?: string;
    configId: string;
}


export interface ConfigFormKeyType
{
isSystem: boolean;
defaultKey: string;
min?: number;
max?: number;
// Có bắt buộc;
isRequired: boolean;
// Lưu key nội dung;
ktT_KEY: string;
// Lưu type;
ktT_TYPE: string;
// Lưu kiểu nhập;
formId: ConfigFormType;
}