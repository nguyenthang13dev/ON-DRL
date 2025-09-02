import { apiService } from "@/services";
import {
  DataToSend,
  Dictionary,
  DropdownOption,
  Response,
  ResponsePageList,
} from "@/types/general";
import {
  ArcDocumentCreateOrUpdateType,
  ArcDocumentSearchType,
  ArcDocumentType,
} from "@/types/arcDocument/arcDocument";

class ArcDocumentService {
  private static _instance: ArcDocumentService;
  public static get instance(): ArcDocumentService {
    if (!ArcDocumentService._instance) {
      ArcDocumentService._instance = new ArcDocumentService();
    }
    return ArcDocumentService._instance;
  }

  public async getData(
    searchData: ArcDocumentSearchType
  ): Promise<Response<ResponsePageList<ArcDocumentType[]>>> {
    const response = await apiService.post<
      Response<ResponsePageList<ArcDocumentType[]>>
    >("/arcDocument/getData", searchData);
    return response.data;
  }

  public async create(
    formData: ArcDocumentCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.post<Response>(
      "/arcDocument/create",
      formData
    );
    return response.data;
  }

  public async update(
    formData: ArcDocumentCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.put<Response>(
      "/arcDocument/update",
      formData
    );
    return response.data;
  }

  public async delete(id: string): Promise<Response> {
    const response = await apiService.delete<Response>(
      "/arcDocument/delete/" + id
    );
    return response.data;
  }
  public async getDropdowns(): Promise<Response<Dictionary<DropdownOption[]>>> {
    const response = await apiService.get<Response<Dictionary<DropdownOption[]>>>(
      "/arcDocument/getDropDowns"
    );
    return response.data;
  }

  public async exportExcel(
    search: ArcDocumentSearchType
  ): Promise<Response<string>> {
    const response = await apiService.post<Response>(
      "/arcDocument/exportExcel",
      search
    );
    return response.data;
  }

  public async exportTemplateImport(): Promise<Response> {
    const response = await apiService.get<Response>(
      "/arcDocument/exportTemplateImport"
    );
    return response.data;
  }

  public async getDataImportView(): Promise<Response> {
    const response = await apiService.get<Response>("/ArcDocument/import");
    return response.data;
  }

  public async saveImport(form: DataToSend): Promise<Response> {
    const response = await apiService.post<Response>(
      "/arcDocument/importExcel",
      form
    );
    return response.data;
  }

  public async getTypeDocument(): Promise<Response> {
    const response = await apiService.get<Response>("/ArcDocument/getTypeDocument");
    return response.data;
  }


}

const arcDocumentService = ArcDocumentService.instance;
export default arcDocumentService;
