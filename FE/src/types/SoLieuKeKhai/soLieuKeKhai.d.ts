import { ConfigFormType } from "../ConfigForm/ConfigForm";
import { ConfigFormKeyType } from "../ConfigFormKey/ConfigFormKey";

export interface tableSoLieuKeKhaiCreateVMDataType
{ 
    kTT_KEY: string;
    kTT_VALUE: any;
}

export interface SoLieuKeKhaiUserDto {
    ktT_VALUE: string;
    ktT_KEY: ConfigFormKeyType;
    configForm: ConfigFormType;
}


export interface SoLieuKeKhaiType
{
    formId: string;
    UserId?: string | null;
    lst_KeKhai: tableSoLieuKeKhaiCreateVMDataType[];
}