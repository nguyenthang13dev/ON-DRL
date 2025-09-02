import { apiService } from "@/services";
import {
  DataToSend,
  Dictionary,
  DropdownOption,
  Response,
  ResponsePageList,
} from "@/types/general";
import {
  NS_ChamCongCreateOrUpdateType,
  NS_ChamCongSearchType,
  NS_ChamCongType,
  DataTableChamCongType,
  DataTableSearch,
  UpdateDataListByMaNV,
  DataChamCongDto,
} from "@/types/QLNhanSu/nS_ChamCong/nS_ChamCong";

class NS_ChamCongService {
  private static _instance: NS_ChamCongService;
  public static get instance(): NS_ChamCongService {
    if (!NS_ChamCongService._instance) {
      NS_ChamCongService._instance = new NS_ChamCongService();
    }
    return NS_ChamCongService._instance;
  }

  public async getData(
    searchData: NS_ChamCongSearchType
  ): Promise<Response<ResponsePageList<NS_ChamCongType[]>>> {
    const response = await apiService.post<
      Response<ResponsePageList<NS_ChamCongType[]>>
    >("/nS_ChamCong/getData", searchData);
    return response.data;
  }

  public async create(
    formData: NS_ChamCongCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.post<Response>(
      "/nS_ChamCong/create",
      formData
    );
    return response.data;
  }

  public async update(
    formData: NS_ChamCongCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.put<Response>(
      "/nS_ChamCong/update",
      formData
    );
    return response.data;
  }
  public async updateDataListByMaNV(
    payload: UpdateDataListByMaNV
  ): Promise<Response> {
    const response = await apiService.put<Response>(
      "/nS_ChamCong/UpdateDataListByMaNV",
      payload
    );
    return response.data;
  }
  public async delete(id: string): Promise<Response> {
    const response = await apiService.delete<Response>(
      "/nS_ChamCong/delete/" + id
    );
    return response.data;
  }
  public async getDropdowns(): Promise<Response<Dictionary<DropdownOption[]>>> {
    const response = await apiService.get<
      Response<Dictionary<DropdownOption[]>>
    >("/nS_ChamCong/getDropDowns");
    return response.data;
  }

  public async exportExcel(
    search: NS_ChamCongSearchType
  ): Promise<Response<string>> {
    const response = await apiService.post<Response>(
      "/nS_ChamCong/exportExcel",
      search
    );
    return response.data;
  }

  public async exportTemplateImport(): Promise<Response> {
    const response = await apiService.get<Response>(
      "/nS_ChamCong/exportTemplateImport"
    );
    return response.data;
  }

  public async getDataImportView(): Promise<Response> {
    const response = await apiService.get<Response>("/NS_ChamCong/import");
    return response.data;
  }

  public async saveImport(form: DataToSend): Promise<Response> {
    const response = await apiService.post<Response>(
      "/nS_ChamCong/importExcel",
      form
    );
    return response.data;
  }
  public async importExcel(file: File): Promise<Response> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiService.post<Response>(
      "/nS_ChamCong/ImportDuLieuChamCong",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  public async getDataTableChamCong(
    search: DataTableSearch
  ): Promise<Response<DataTableChamCongType[]>> {
    const response = await apiService.post<Response<DataTableChamCongType[]>>(
      "/nS_ChamCong/GetDataTableChamCong",
      search
    );
    return response.data;
  }

  public async getDataChamCong(
    search: DataTableSearch
  ): Promise<Response<DataChamCongDto[]>> {
    const response = await apiService.get<Response<DataChamCongDto[]>>(
      `/nS_ChamCong/DanhSachChamCongThang/${search.maNV}/${search.month}/${search.year}`
    );
    return response.data;
  }
}

const nS_ChamCongService = NS_ChamCongService.instance;
export default nS_ChamCongService;
