import { apiService } from "@/services";
import {
  DataToSend,
  Dictionary,
  DropdownOption,
  Response,
  ResponsePageList,
} from "@/types/general";
import {
  ArcFileCreateOrUpdateType,
  ArcFileSearchType,
  ArcFileType,
} from "@/types/arcFile/arcFile";

class ArcFileService {
  private static _instance: ArcFileService;
  public static get instance(): ArcFileService {
    if (!ArcFileService._instance) {
      ArcFileService._instance = new ArcFileService();
    }
    return ArcFileService._instance;
  }

  public async getData(
    searchData: ArcFileSearchType
  ): Promise<Response<ResponsePageList<ArcFileType[]>>> {
    const response = await apiService.post<
      Response<ResponsePageList<ArcFileType[]>>
    >("/ArcFile/GetData", searchData);
    return response.data;
  }

  public async create(
    formData: ArcFileCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.post<Response>(
      "/ArcFile/Create",
      formData
    );
    console.log("formData: ", formData);
    return response.data;
  }

  public async update(
    formData: ArcFileCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.put<Response>(
      "/ArcFile/Update",
      formData
    );
    return response.data;
  }

  public async delete(id: string): Promise<Response> {
    const response = await apiService.delete<Response>(
      "/ArcFile/Delete/" + id
    );
    return response.data;
  }
  public async getDropdowns(): Promise<Response<Dictionary<DropdownOption[]>>> {
    const response = await apiService.get<Response<Dictionary<DropdownOption[]>>>(
      "/ArcFile/GetDropDowns"
    );
    return response.data;
  }

  public async exportExcel(
    search: ArcFileSearchType
  ): Promise<Response<string>> {
    const response = await apiService.post<Response>(
      "/ArcFile/ExportExcel",
      search
    );
    return response.data;
  }

  public async exportTemplateImport(): Promise<Response> {
    const response = await apiService.get<Response>(
      "/ArcFile/ExportTemplateImport"
    );
    return response.data;
  }

  public async getDataImportView(): Promise<Response> {
    const response = await apiService.get<Response>("/ArcFile/Import");
    return response.data;
  }

  public async saveImport(form: DataToSend): Promise<Response> {
    const response = await apiService.post<Response>(
      "/ArcFile/ImportExcel",
      form
    );
    return response.data;
  }


}

const arcFileService = ArcFileService.instance;
export default arcFileService;
