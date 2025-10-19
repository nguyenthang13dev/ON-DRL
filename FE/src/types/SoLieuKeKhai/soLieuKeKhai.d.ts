export interface tableSoLieuKeKhaiCreateVMDataType
{ 
    kTT_KEY: string;
    kTT_VALUE: any;
}

export interface SoLieuKeKhaiUserDto {
    KTT_VALUE: string;
    KTT_KEY: ConfigFormKeyType;
    configForm: ConfigFormKeyType;
}


export interface SoLieuKeKhaiType
{
    formId: string;
    UserId?: string | null;
    lst_KeKhai: tableSoLieuKeKhaiCreateVMDataType[];
}