import { apiService } from "@/services";
import {
  DataToSend,
  Dictionary,
  DropdownOption,
  Response,
  ResponsePageList,
} from "@/types/general";
import {
  ArcFilePlanCreateOrUpdateType,
  ArcFilePlanSearchType,
  ArcFilePlanType,
} from "@/types/arcFilePlan/arcFilePlan";

class ArcFilePlanService {
  private static _instance: ArcFilePlanService;
  public static get instance(): ArcFilePlanService {
    if (!ArcFilePlanService._instance) {
      ArcFilePlanService._instance = new ArcFilePlanService();
    }
    return ArcFilePlanService._instance;
  }

  public async getData(
    searchData: ArcFilePlanSearchType
  ): Promise<Response<ResponsePageList<ArcFilePlanType[]>>> {
    const response = await apiService.post<
      Response<ResponsePageList<ArcFilePlanType[]>>
    >("/arcFilePlan/getData", searchData);
    return response.data;
  }

  public async create(
    formData: ArcFilePlanCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.post<Response>(
      "/arcFilePlan/create",
      formData
    );
    return response.data;
  }

  public async update(
    formData: ArcFilePlanCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.put<Response>(
      "/arcFilePlan/update",
      formData
    );
    return response.data;
  }

  public async delete(id: string): Promise<Response> {
    const response = await apiService.delete<Response>(
      "/arcFilePlan/delete/" + id
    );
    return response.data;
  }
  public async getDropdowns(): Promise<Response<Dictionary<DropdownOption[]>>> {
    const response = await apiService.get<Response<Dictionary<DropdownOption[]>>>(
      "/arcFilePlan/getDropDowns"
    );
    return response.data;
  }

  public async exportExcel(
    search: ArcFilePlanSearchType
  ): Promise<Response<string>> {
    const response = await apiService.post<Response>(
      "/arcFilePlan/exportExcel",
      search
    );
    return response.data;
  }

  public async exportTemplateImport(): Promise<Response> {
    const response = await apiService.get<Response>(
      "/arcFilePlan/exportTemplateImport"
    );
    return response.data;
  }

  public async getDataImportView(): Promise<Response> {
    const response = await apiService.get<Response>("/ArcFilePlan/import");
    return response.data;
  }

  public async saveImport(form: DataToSend): Promise<Response> {
    const response = await apiService.post<Response>(
      "/arcFilePlan/importExcel",
      form
    );
    return response.data;
  }


}

const arcFilePlanService = ArcFilePlanService.instance;
export default arcFilePlanService;
