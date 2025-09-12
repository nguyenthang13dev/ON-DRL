export interface tableConfigFormKeyEditVMData { 
    id? : string;
    kTT_KEY?: string;
    type?: string;
    min?: number;
    max?: number;
    isSystem: boolean;
    isRequired: boolean;
    defaultKey?: string;
    configId: string;
}