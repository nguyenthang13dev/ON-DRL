import { apiService } from "@/services";
import {
  DataToSend,
  Dictionary,
  DropdownOption,
  Response,
  ResponsePageList,
} from "@/types/general";
import {
  DA_KeHoachThucHienCreateOrUpdateType,
  DA_KeHoachThucHienSearchType,
  DA_KeHoachThucHienType,
  DA_GetFormByDuAnResponse
} from "@/types/dA_DuAn/dA_KeHoachThucHien";

class DA_KeHoachThucHienService {
  private static _instance: DA_KeHoachThucHienService;
  public static get instance(): DA_KeHoachThucHienService {
    if (!DA_KeHoachThucHienService._instance) {
      DA_KeHoachThucHienService._instance = new DA_KeHoachThucHienService();
    }
    return DA_KeHoachThucHienService._instance;
  }

  public async getData(
    searchData: DA_KeHoachThucHienSearchType
  ): Promise<Response<ResponsePageList<DA_KeHoachThucHienType[]>>> {
    const response = await apiService.post<
      Response<ResponsePageList<DA_KeHoachThucHienType[]>>
    >("/dA_KeHoachThucHien/getData", searchData);
    return response.data;
  }

  /**
   * async getFormByDuAn()  */
  public async getFormByDuAn(
    id: string,
    isKeHoachNoiBo?: boolean
  ): Promise<Response<DA_GetFormByDuAnResponse>> {
    const response = await apiService.get<Response<DA_GetFormByDuAnResponse>>(
      "/dA_KeHoachThucHien/getFormByDuAn?id=" +
        id +
        (isKeHoachNoiBo ? "&isKeHoachNoiBo=" + isKeHoachNoiBo : "")
    );
    console.log("response.data.getFormByDuAn", response.data);
    return response.data;
  }

  public async create(
    formData: DA_KeHoachThucHienCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.post<Response>(
      "/dA_KeHoachThucHien/create",
      formData
    );
    return response.data;
  }

  public async saveForm(
    duAnId: string,
    isNoiBo: boolean,
    formData: DA_KeHoachThucHienCreateOrUpdateType[]
  ): Promise<Response> {
    const response = await apiService.post<Response>(
      `/dA_KeHoachThucHien/saveRange?duAnId=${duAnId}&isKeHoachNoiBo=${isNoiBo}`,
      formData
    );
    return response.data;
  }

  public async update(
    formData: DA_KeHoachThucHienCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.put<Response>(
      "/dA_KeHoachThucHien/update",
      formData
    );
    return response.data;
  }

  public async updateKHTrienKhai(
    formData: DA_KeHoachThucHienCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.put<Response>(
      "/dA_KeHoachThucHien/updateKHTrienKhai",
      formData
    );
    return response.data;
  }

  
  public async updateProgress(
    formData: {id: string, progress: number}
  ): Promise<Response> {
    const response = await apiService.put<Response>(
      "/dA_KeHoachThucHien/updateProgress",
      formData
    );
    return response.data;
  }
  public async delete(id: string, isNoiBo: boolean): Promise<Response> {
    const response = await apiService.delete<Response>(
      "/dA_KeHoachThucHien/delete/" + id + "&isNoiBo=" + isNoiBo
    );
    return response.data;
  }

  public async deleteByDuAn(id: string,isNoiBo: boolean): Promise<Response> {
    const response = await apiService.delete<Response>(
      "/dA_KeHoachThucHien/deleteByDuAn?id=" + id + "&isKeHoachNoiBo=" + isNoiBo
    );
    return response.data;
  }

    public async deleteByDuAnNew(id: string,isNoiBo: boolean): Promise<Response> {
    const response = await apiService.delete<Response>(
      "/dA_KeHoachThucHien/deleteByDuAn?id=" + id + "&isKeHoachNoiBo=" + isNoiBo
    );
    return response.data;
  }

  public async getDropdowns(): Promise<Response<Dictionary<DropdownOption[]>>> {
    const response = await apiService.get<
      Response<Dictionary<DropdownOption[]>>
    >("/dA_KeHoachThucHien/getDropDowns");
    return response.data;
  }


  public async getDropdownsTree(
    duAnId: string,
    isNoiBo: boolean,
  ): Promise<Response<any[]>> {
    const response = await apiService.get<Response<any[]>>(
      `/DA_KeHoachThucHien/GetDropdowns?id=${duAnId}&isKeHoachNoiBo=${isNoiBo}`
    );
    return response.data;
  }

  public async GetDropdownsHangMucCongViec(
    duAnId: string,
    isNoiBo: boolean,
  ): Promise<Response<any[]>> {
    const response = await apiService.get<Response<any[]>>(
      `/DA_KeHoachThucHien/GetDropdownsHangMucCongViec?id=${duAnId}&isKeHoachNoiBo=${isNoiBo}`
    );
    return response.data;
  }



  public async getDropdownsTreeTemplate(
    duAnId: string,
    isNoiBo: boolean,
  ): Promise<Response<any[]>> {
    const response = await apiService.get<Response<any[]>>(
      `/DA_KeHoachThucHien/getTemplateKeHoachTrienKhai?duAnId=${duAnId}&isKeHoachNoiBo=${isNoiBo}`
    );
    return response.data;
  }


  
  public async exportKeHoachThucHienDA(duAnId: string, isNoiBo: boolean): Promise<Response<string>> {
    const response = await apiService.get<Response<string>>(
      `/DA_KeHoachThucHien/ExportKeHoacThucHiemDA?DuAnId=${duAnId}&isKeHoachNoiBo=${isNoiBo}`
    );
    return response.data;
  }

  public async exportExcel(
    search: DA_KeHoachThucHienSearchType
  ): Promise<Response<string>> {
    const response = await apiService.post<Response>(
      "/dA_KeHoachThucHien/exportExcel",
      search
    );
    return response.data;
  }

  public async exportTemplateImport(): Promise<Response> {
    const response = await apiService.get<Response>(
      "/dA_KeHoachThucHien/exportTemplateImport"
    );
    return response.data;
  }

  public async getDataImportView(): Promise<Response> {
    const response = await apiService.get<Response>(
      "/DA_KeHoachThucHien/import"
    );
    return response.data;
  }

  public async SaveImportExcel(
    duAnId: string,
    isNoiBo: boolean,
    formData: DA_KeHoachThucHienCreateOrUpdateType[]
  ): Promise<Response> {
    const response = await apiService.post<Response>(
      `/dA_KeHoachThucHien/SaveImportExcel?duAnId=${duAnId}&isKeHoachNoiBo=${isNoiBo}`,
      formData
    );
    return response.data;
  }
}

const dA_KeHoachThucHienService = DA_KeHoachThucHienService.instance;
export default dA_KeHoachThucHienService;
