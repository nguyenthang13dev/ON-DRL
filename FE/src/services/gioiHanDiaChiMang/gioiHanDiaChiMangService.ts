import { apiService } from "@/services";
import {
  DataToSend,
  Dictionary,
  DropdownOption,
  Response,
  ResponsePageList,
} from "@/types/general";
import {
  GioiHanDiaChiMangCreateOrUpdateType,
  GioiHanDiaChiMangSearchType,
  GioiHanDiaChiMangType,
} from "@/types/gioiHanDiaChiMang/gioiHanDiaChiMang";

class GioiHanDiaChiMangService {
  private static _instance: GioiHanDiaChiMangService;
  public static get instance(): GioiHanDiaChiMangService {
    if (!GioiHanDiaChiMangService._instance) {
      GioiHanDiaChiMangService._instance = new GioiHanDiaChiMangService();
    }
    return GioiHanDiaChiMangService._instance;
  }

  public async getData(
    searchData: GioiHanDiaChiMangSearchType
  ): Promise<Response<ResponsePageList<GioiHanDiaChiMangType[]>>> {
    const response = await apiService.post<
      Response<ResponsePageList<GioiHanDiaChiMangType[]>>
    >("/gioiHanDiaChiMang/getData", searchData);
    return response.data;
  }

  public async create(
    formData: GioiHanDiaChiMangCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.post<Response>(
      "/gioiHanDiaChiMang/create",
      formData
    );
    return response.data;
  }

  public async update(
    formData: GioiHanDiaChiMangCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.put<Response>(
      "/gioiHanDiaChiMang/update",
      formData
    );
    return response.data;
  }

  public async delete(id: string): Promise<Response> {
    const response = await apiService.delete<Response>(
      "/gioiHanDiaChiMang/delete/" + id
    );
    return response.data;
  }
  public async getDropdowns(): Promise<Response<Dictionary<DropdownOption[]>>> {
    const response = await apiService.get<Response<Dictionary<DropdownOption[]>>>(
      "/gioiHanDiaChiMang/getDropDowns"
    );
    return response.data;
  }

  public async exportExcel(
    search: GioiHanDiaChiMangSearchType
  ): Promise<Response<string>> {
    const response = await apiService.post<Response>(
      "/gioiHanDiaChiMang/exportExcel",
      search
    );
    return response.data;
  }

  public async exportTemplateImport(): Promise<Response> {
    const response = await apiService.get<Response>(
      "/gioiHanDiaChiMang/exportTemplateImport"
    );
    return response.data;
  }

  public async getDataImportView(): Promise<Response> {
    const response = await apiService.get<Response>("/GioiHanDiaChiMang/import");
    return response.data;
  }

  public async saveImport(form: DataToSend): Promise<Response> {
    const response = await apiService.post<Response>(
      "/gioiHanDiaChiMang/importExcel",
      form
    );
    return response.data;
  }

  public async allowed(id: string): Promise<Response> {
    const response = await apiService.get<Response>(
      "/gioiHanDiaChiMang/Allowed/" + id
    );
    return response.data;
  }


}

const gioiHanDiaChiMangService = GioiHanDiaChiMangService.instance;
export default gioiHanDiaChiMangService;
