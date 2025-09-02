import { apiService } from "@/services";
import {
  DataToSend,
  Dictionary,
  DropdownOption,
  Response,
  ResponsePageList,
} from "@/types/general";
import {
  NS_HopDongLaoDongCreateOrUpdateType,
  NS_HopDongLaoDongSearchType,
  NS_HopDongLaoDongType,
} from "@/types/QLNhanSu/nS_HopDongLaoDong/nS_HopDongLaoDong";

class NS_HopDongLaoDongService {
  private static _instance: NS_HopDongLaoDongService;
  public static get instance(): NS_HopDongLaoDongService {
    if (!NS_HopDongLaoDongService._instance) {
      NS_HopDongLaoDongService._instance = new NS_HopDongLaoDongService();
    }
    return NS_HopDongLaoDongService._instance;
  }

  public async getData(
    searchData: NS_HopDongLaoDongSearchType
  ): Promise<Response<ResponsePageList<NS_HopDongLaoDongType[]>>> {
    const response = await apiService.post<
      Response<ResponsePageList<NS_HopDongLaoDongType[]>>
    >("/nS_HopDongLaoDong/getData", searchData);
    return response.data;
  }
  public async getDocx(
    maBieuMau: string,
    hopDongLaoDongId: string
  ): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/nS_HopDongLaoDong/ExportHopDongLaoDongDocx",
        {
          maBieuMau,
          hopDongLaoDongId,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async create(
    formData: NS_HopDongLaoDongCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.post<Response>(
      "/nS_HopDongLaoDong/create",
      formData
    );
    return response.data;
  }

  public async update(
    formData: NS_HopDongLaoDongCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.put<Response>(
      "/nS_HopDongLaoDong/update",
      formData
    );
    return response.data;
  }

  public async delete(id: string): Promise<Response> {
    const response = await apiService.delete<Response>(
      "/nS_HopDongLaoDong/delete/" + id
    );
    return response.data;
  }
  public async getDropdowns(): Promise<Response<Dictionary<DropdownOption[]>>> {
    const response = await apiService.get<
      Response<Dictionary<DropdownOption[]>>
    >("/nS_HopDongLaoDong/getDropDowns");
    return response.data;
  }

  public async exportExcel(
    search: NS_HopDongLaoDongSearchType
  ): Promise<Response<string>> {
    const response = await apiService.post<Response>(
      "/nS_HopDongLaoDong/exportExcel",
      search
    );
    return response.data;
  }

  public async exportTemplateImport(): Promise<Response> {
    const response = await apiService.get<Response>(
      "/nS_HopDongLaoDong/exportTemplateImport"
    );
    return response.data;
  }

  public async getDataImportView(): Promise<Response> {
    const response = await apiService.get<Response>(
      "/NS_HopDongLaoDong/import"
    );
    return response.data;
  }

  public async saveImport(form: DataToSend): Promise<Response> {
    const response = await apiService.post<Response>(
      "/nS_HopDongLaoDong/importExcel",
      form
    );
    return response.data;
  }
}

const nS_HopDongLaoDongService = NS_HopDongLaoDongService.instance;
export default nS_HopDongLaoDongService;
