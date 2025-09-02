import { apiService } from "@/services";
import {
  DataToSend,
  Dictionary,
  DropdownOption,
  Response,
  ResponsePageList,
} from "@/types/general";
import {
  SystemLogsCreateOrUpdateType,
  SystemLogsSearchType,
  SystemLogsType,
} from "@/types/systemLogs/systemLogs";

class SystemLogsService {
  private static _instance: SystemLogsService;
  public static get instance(): SystemLogsService {
    if (!SystemLogsService._instance) {
      SystemLogsService._instance = new SystemLogsService();
    }
    return SystemLogsService._instance;
  }

  public async getData(
    searchData: SystemLogsSearchType
  ): Promise<Response<ResponsePageList<SystemLogsType[]>>> {
    const response = await apiService.post<
      Response<ResponsePageList<SystemLogsType[]>>
    >("/systemLogs/getData", searchData);
    return response.data;
  }

  public async create(
    formData: SystemLogsCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.post<Response>(
      "/systemLogs/create",
      formData
    );
    return response.data;
  }

  public async update(
    formData: SystemLogsCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.put<Response>(
      "/systemLogs/update",
      formData
    );
    return response.data;
  }

  public async delete(id: string): Promise<Response> {
    const response = await apiService.delete<Response>(
      "/systemLogs/delete/" + id
    );
    return response.data;
  }
  public async getDropdowns(): Promise<Response<Dictionary<DropdownOption[]>>> {
    const response = await apiService.get<Response<Dictionary<DropdownOption[]>>>(
      "/systemLogs/getDropDowns"
    );
    return response.data;
  }

  public async exportExcel(
    search: SystemLogsSearchType
  ): Promise<Response<string>> {
    const response = await apiService.post<Response>(
      "/systemLogs/Export",
      search
    );
    return response.data;
  }

  public async exportTemplateImport(): Promise<Response> {
    const response = await apiService.get<Response>(
      "/systemLogs/exportTemplateImport"
    );
    return response.data;
  }

  public async getDataImportView(): Promise<Response> {
    const response = await apiService.get<Response>("/SystemLogs/import");
    return response.data;
  }

  public async saveImport(form: DataToSend): Promise<Response> {
    const response = await apiService.post<Response>(
      "/systemLogs/importExcel",
      form
    );
    return response.data;
  }
  public async exportPdf(
    search: SystemLogsSearchType
  ): Promise<Response<string>> {
    const response = await apiService.post<Response>(
      "/systemLogs/ExportPdf",
      search
    );
    return response.data;
  }

}

const systemLogsService = SystemLogsService.instance;
export default systemLogsService;
