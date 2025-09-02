import { apiService } from "@/services";
import {
  DataToSend,
  Dictionary,
  DropdownOption,
  Response,
  ResponsePageList,
} from "@/types/general";
import {
  DA_PhanCongCreateOrUpdateType,
  DA_PhanCongSearchType,
  DA_PhanCongType,
} from "@/types/dA_DuAn/dA_PhanCong";

class DA_PhanCongService {
  private static _instance: DA_PhanCongService;
  public static get instance(): DA_PhanCongService {
    if (!DA_PhanCongService._instance) {
      DA_PhanCongService._instance = new DA_PhanCongService();
    }
    return DA_PhanCongService._instance;
  }

  public async getData(
    searchData: DA_PhanCongSearchType
  ): Promise<Response<ResponsePageList<DA_PhanCongType[]>>> {
    const response = await apiService.post<
      Response<ResponsePageList<DA_PhanCongType[]>>
    >("/dA_PhanCong/getData", searchData);
    return response.data;
  }

  public async create(
    formData: DA_PhanCongCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.post<Response>(
      "/dA_PhanCong/create",
      formData
    );
    return response.data;
  }

  public async update(
    formData: DA_PhanCongCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.put<Response>(
      "/dA_PhanCong/update",
      formData
    );
    return response.data;
  }

  public async delete(id: string): Promise<Response> {
    const response = await apiService.delete<Response>(
      "/dA_PhanCong/delete/" + id
    );
    return response.data;
  }
  public async getDropdowns(): Promise<Response<Dictionary<DropdownOption[]>>> {
    const response = await apiService.get<Response<Dictionary<DropdownOption[]>>>(
      "/dA_PhanCong/getDropDowns"
    );
    return response.data;
  }

  public async exportExcel(
    search: DA_PhanCongSearchType
  ): Promise<Response<string>> {
    const response = await apiService.post<Response>(
      "/dA_PhanCong/exportExcel",
      search
    );
    return response.data;
  }

  public async exportTemplateImport(): Promise<Response> {
    const response = await apiService.get<Response>(
      "/dA_PhanCong/exportTemplateImport"
    );
    return response.data;
  }

  public async getDataImportView(): Promise<Response> {
    const response = await apiService.get<Response>("/DA_PhanCong/import");
    return response.data;
  }

  public async saveImport(form: DataToSend): Promise<Response> {
    const response = await apiService.post<Response>(
      "/dA_PhanCong/importExcel",
      form
    );
    return response.data;
  }

  // Hàm lưu nhiều phân công
  public async saveList(
    duAnId: string,
    list: DA_PhanCongCreateOrUpdateType[]
  ): Promise<Response> {
    const response = await apiService.post<Response>(
      "/dA_PhanCong/saveList?duAnId=" + duAnId,
      list
    );
    return response.data;
  }


    // Lấy danh sách phân công hiển thị trong form
  public async GetListByDuAnId(
    duAnId: string,
    list: DA_PhanCongCreateOrUpdateType[]
  ): Promise<Response> {
    const response = await apiService.get<Response>(
      "/dA_PhanCong/GetListByDuAnId/" + duAnId
    );
    return response.data;
  }

// Lấy danh sách phân công hiển thị trong chi tiết dự án
  public async GetListByDuAnIdDto(
    duAnId: string,
    list: DA_PhanCongType[]
  ): Promise<Response> {
    const response = await apiService.get<Response>(
      "/dA_PhanCong/GetListByDuAnIdDto/" + duAnId
    );
    return response.data;
  }



  public async saveValidList(
    duAnId: string,
    phanCongList: DA_PhanCongCreateOrUpdateType[]
  ): Promise<Response> {
    const validPhanCongList = phanCongList
      .filter((item) => !!item.userId) // UserId là bắt buộc
      .map((item) => ({
        ...item,
        UserId: item.userId, // map đúng tên cho backend
        VaiTroId: item.vaiTroId, // map đúng tên cho backend
      }));

    const response = await apiService.post<Response>(
      "/dA_PhanCong/saveList?duAnId=" + duAnId,
      validPhanCongList
    );
    return response.data;
  }
}

const dA_PhanCongService = DA_PhanCongService.instance;
export default dA_PhanCongService;
