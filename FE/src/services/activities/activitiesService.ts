import { apiService } from "@/services";
import {
  DataToSend,
  Dictionary,
  DropdownOption,
  Response,
  ResponsePageList,
} from "@/types/general";
import {
  ActivitiesCreateOrUpdateType,
  ActivitiesSearchType,
  ActivitiesType,
} from "@/types/activities/activities";

class ActivitiesService {
  private static _instance: ActivitiesService;
  public static get instance(): ActivitiesService {
    if (!ActivitiesService._instance) {
      ActivitiesService._instance = new ActivitiesService();
    }
    return ActivitiesService._instance;
  }

  public async get(id: string): Promise<Response<ActivitiesType>> {
    const response = await apiService.get<Response<ActivitiesType>>(
      `/activities/get/${id}`
    );
    return response.data;
  }
  public async getData(
    searchData: ActivitiesSearchType
  ): Promise<Response<ResponsePageList<ActivitiesType[]>>> {
    const response = await apiService.post<
      Response<ResponsePageList<ActivitiesType[]>>
    >("/activities/getData", searchData);
    return response.data;
  }

  public async create(
    formData: ActivitiesCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.post<Response>(
      "/activities/create",
      formData
    );
    return response.data;
  }

  public async update(
    formData: ActivitiesCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.put<Response>(
      "/activities/update",
      formData
    );
    return response.data;
  }

  public async delete(id: string): Promise<Response> {
    const response = await apiService.delete<Response>(
      "/activities/delete/" + id
    );
    return response.data;
  }
  public async getDropdowns(): Promise<Response<Dictionary<DropdownOption[]>>> {
    const response = await apiService.get<
      Response<Dictionary<DropdownOption[]>>
    >("/activities/getDropDowns");
    return response.data;
  }

  public async exportExcel(
    search: ActivitiesSearchType
  ): Promise<Response<string>> {
    const response = await apiService.post<Response>(
      "/activities/exportExcel",
      search
    );
    return response.data;
  }

  public async exportTemplateImport(): Promise<Response> {
    const response = await apiService.get<Response>(
      "/activities/exportTemplateImport"
    );
    return response.data;
  }

  public async getDataImportView(): Promise<Response> {
    const response = await apiService.get<Response>("/Activities/import");
    return response.data;
  }

  public async saveImport(form: DataToSend): Promise<Response> {
    const response = await apiService.post<Response>(
      "/activities/importExcel",
      form
    );
    return response.data;
  }
}

const activitiesService = ActivitiesService.instance;
export default activitiesService;
