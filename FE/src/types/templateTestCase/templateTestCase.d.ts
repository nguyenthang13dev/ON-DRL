import { SearchBase } from "../general";

export interface TemplateTestCase { 
    id: string;            
    templateName: string;
    // Key : thêm, tạo, thêm mới
    // Ghi chú các từ khoá cách nhau dấu , ( trong view thì thêm dấu + ? )
    keyWord: string;
    // ghi chú trong view thêm : Một số key cho trước 
    // // VD: {TenUseCase}, {TenChucNang}, {TacNhan}, {HanhDong}
    templateContent: string;

}


export interface TemplateTestCaseCreate {
    templateName: string;
    keyWord: string;
    templateContent: string;
}

export interface TemplateTestCaseEdit {
    id: string;
    templateName: string;
    keyWord: string;
    templateContent: string;
}

export interface TemplateTestCaseSearch extends SearchBase {
    templateName?: string;
    keyWord?: string;
    templateContent?: string;
}



