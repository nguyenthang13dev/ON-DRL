import { apiService } from "@/services";
import {
  DataToSend,
  Dictionary,
  DropdownOption,
  Response,
  ResponsePageList,
} from "@/types/general";
import {
  DA_DuAnCreateOrUpdateType,
  DA_DuAnSearchType,
  DA_DuAnType,
} from "@/types/dA_DuAn/dA_DuAn";

class DA_DuAnService {
  private static _instance: DA_DuAnService;
  public static get instance(): DA_DuAnService {
    if (!DA_DuAnService._instance) {
      DA_DuAnService._instance = new DA_DuAnService();
    }
    return DA_DuAnService._instance;
  }

  public async getData(
    searchData: DA_DuAnSearchType
  ): Promise<Response<ResponsePageList<DA_DuAnType[]>>> {
    const response = await apiService.post<
      Response<ResponsePageList<DA_DuAnType[]>>
    >("/dA_DuAn/getData", searchData);
    return response.data;
  }

  public async create(
    formData: any // hoặc Record<string, any>
  ): Promise<Response> {
    const response = await apiService.post<Response>(
      "/dA_DuAn/create",
      formData
    );
    return response.data;
  }

  public async update(
  formData: any // hoặc Record<string, any>
  ): Promise<Response> {
    const response = await apiService.put<Response>(
      "/dA_DuAn/update",
      formData
    );
    return response.data;
  }

  public async delete(id: string): Promise<Response> {
    const response = await apiService.delete<Response>(
      "/DA_DuAn/delete/" + id
    );
    return response.data;
  }
  public async getDropdowns(): Promise<Response<Dictionary<DropdownOption[]>>> {
    const response = await apiService.get<Response<Dictionary<DropdownOption[]>>>(
      "/dA_DuAn/getDropDowns"
    );
    return response.data;
  }

  public async exportExcel(
    search: DA_DuAnSearchType
  ): Promise<Response<string>> {
    const response = await apiService.post<Response>(
      "/dA_DuAn/exportExcel",
      search
    );
    return response.data;
  }

  public async exportTemplateImport(): Promise<Response> {
    const response = await apiService.get<Response>(
      "/dA_DuAn/exportTemplateImport"
    );
    return response.data;
  }

  public async getDataImportView(): Promise<Response> {
    const response = await apiService.get<Response>("/DA_DuAn/import");
    return response.data;
  }

  public async saveImport(form: DataToSend): Promise<Response> {
    const response = await apiService.post<Response>(
      "/dA_DuAn/importExcel",
      form
    );
    return response.data;
  }

  public async getFormById(
    id: string  // hoặc number
  ): Promise<Response<DA_DuAnCreateOrUpdateType>> {
    const response = await apiService.get<Response<DA_DuAnCreateOrUpdateType>>(
      "/dA_DuAn/getFormById/" + id
    );
    return response.data;
  }


    public async get(
    id: string  // hoặc number
  ): Promise<Response<DA_DuAnType> | null> {
    try {
      const response = await apiService.get<Response<DA_DuAnType>>(
        "/dA_DuAn/get/" + id
      );
   
      if (!response || !response.data) return null;
      return response.data;
    } catch (error) {
      console.error("Error in DA_DuAnService.get:", error);
      return null;
    }
  }


}

const dA_DuAnService = DA_DuAnService.instance;
export default dA_DuAnService;
