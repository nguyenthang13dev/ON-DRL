import { apiService } from "@/services";
import {
  DataToSend,
  Dictionary,
  DropdownOption,
  Response,
  ResponsePageList,
} from "@/types/general";
import {
  NS_BangCapCreateOrUpdateType,
  NS_BangCapSearchType,
  NS_BangCapType,
} from "@/types/QLNhanSu/nS_BangCap/nS_BangCap";

class NS_BangCapService {
  private static _instance: NS_BangCapService;
  public static get instance(): NS_BangCapService {
    if (!NS_BangCapService._instance) {
      NS_BangCapService._instance = new NS_BangCapService();
    }
    return NS_BangCapService._instance;
  }

  public async getData(
    searchData: NS_BangCapSearchType
  ): Promise<Response<ResponsePageList<NS_BangCapType[]>>> {
    const response = await apiService.post<
      Response<ResponsePageList<NS_BangCapType[]>>
    >("/nS_BangCap/getData", searchData);
    return response.data;
  }

  public async create(
    formData: NS_BangCapCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.post<Response>(
      "/nS_BangCap/create",
      formData
    );
    return response.data;
  }

  public async update(
    formData: NS_BangCapCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.put<Response>(
      "/nS_BangCap/update",
      formData
    );
    return response.data;
  }

  public async delete(id: string): Promise<Response> {
    const response = await apiService.delete<Response>(
      "/nS_BangCap/delete/" + id
    );
    return response.data;
  }
  public async getDropdowns(): Promise<Response<Dictionary<DropdownOption[]>>> {
    const response = await apiService.get<
      Response<Dictionary<DropdownOption[]>>
    >("/nS_BangCap/getDropDowns");
    return response.data;
  }

  public async exportExcel(
    search: NS_BangCapSearchType
  ): Promise<Response<string>> {
    const response = await apiService.post<Response>(
      "/nS_BangCap/exportExcel",
      search
    );
    return response.data;
  }

  public async exportTemplateImport(): Promise<Response> {
    const response = await apiService.get<Response>(
      "/nS_BangCap/exportTemplateImport"
    );
    return response.data;
  }

  public async getDataImportView(): Promise<Response> {
    const response = await apiService.get<Response>("/NS_BangCap/import");
    return response.data;
  }

  public async saveImport(form: DataToSend): Promise<Response> {
    const response = await apiService.post<Response>(
      "/nS_BangCap/importExcel",
      form
    );
    return response.data;
  }
}

const nS_BangCapService = NS_BangCapService.instance;
export default nS_BangCapService;
