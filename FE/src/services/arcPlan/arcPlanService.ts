import { apiService } from "@/services";
import {
  DataToSend,
  Dictionary,
  DropdownOption,
  Response,
  ResponsePageList,
} from "@/types/general";
import {
  ArcPlanCreateOrUpdateType,
  ArcPlanSearchType,
  ArcPlanType,
} from "@/types/arcPlan/arcPlan";

class ArcPlanService {
  private static _instance: ArcPlanService;
  public static get instance(): ArcPlanService {
    if (!ArcPlanService._instance) {
      ArcPlanService._instance = new ArcPlanService();
    }
    return ArcPlanService._instance;
  }

  public async getData(
    searchData: ArcPlanSearchType
  ): Promise<Response<ResponsePageList<ArcPlanType[]>>> {
    const response = await apiService.post<
      Response<ResponsePageList<ArcPlanType[]>>
    >("/arcPlan/getData", searchData);
    return response.data;
  }

  public async create(
    formData: ArcPlanCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.post<Response>(
      "/arcPlan/create",
      formData
    );
    return response.data;
  }

  public async update(
    formData: ArcPlanCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.put<Response>(
      "/arcPlan/update",
      formData
    );
    return response.data;
  }

  public async delete(id: string): Promise<Response> {
    const response = await apiService.delete<Response>(
      "/arcPlan/delete/" + id
    );
    return response.data;
  }
  public async getDropdowns(): Promise<Response<Dictionary<DropdownOption[]>>> {
    const response = await apiService.get<Response<Dictionary<DropdownOption[]>>>(
      "/arcPlan/getDropDowns"
    );
    return response.data;
  }

  public async exportExcel(
    search: ArcPlanSearchType
  ): Promise<Response<string>> {
    const response = await apiService.post<Response>(
      "/arcPlan/exportExcel",
      search
    );
    return response.data;
  }

  public async exportTemplateImport(): Promise<Response> {
    const response = await apiService.get<Response>(
      "/arcPlan/exportTemplateImport"
    );
    return response.data;
  }

  public async getDataImportView(): Promise<Response> {
    const response = await apiService.get<Response>("/ArcPlan/import");
    return response.data;
  }

  public async saveImport(form: DataToSend): Promise<Response> {
    const response = await apiService.post<Response>(
      "/arcPlan/importExcel",
      form
    );
    return response.data;
  }


}

const arcPlanService = ArcPlanService.instance;
export default arcPlanService;
