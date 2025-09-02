import { apiService } from "@/services";
import {
  DataToSend,
  Dictionary,
  DropdownOption,
  Response,
  ResponsePageList,
} from "@/types/general";
import {
  NS_NhanSuCreateOrUpdateType,
  NS_NhanSuSearchType,
  NS_NhanSuType,
} from "@/types/QLNhanSu/nS_NhanSu/nS_NhanSu";

class NS_NhanSuService {
  private static _instance: NS_NhanSuService;
  public static get instance(): NS_NhanSuService {
    if (!NS_NhanSuService._instance) {
      NS_NhanSuService._instance = new NS_NhanSuService();
    }
    return NS_NhanSuService._instance;
  }

  public async getData(
    searchData: NS_NhanSuSearchType
  ): Promise<Response<ResponsePageList<NS_NhanSuType[]>>> {
    const response = await apiService.post<
      Response<ResponsePageList<NS_NhanSuType[]>>
    >("/nS_NhanSu/getData", searchData);
    return response.data;
  }

  public async create(
    formData: NS_NhanSuCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.post<Response>(
      "/nS_NhanSu/create",
      formData
    );
    return response.data;
  }

  public async update(
    formData: NS_NhanSuCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.put<Response>(
      "/nS_NhanSu/update",
      formData
    );
    return response.data;
  }
  public async getDetail(id: string): Promise<Response<NS_NhanSuType>> {
    try {
      const response = await apiService.get<Response<NS_NhanSuType>>(
        `/nS_NhanSu/Get/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  public async delete(id: string): Promise<Response> {
    const response = await apiService.delete<Response>(
      "/nS_NhanSu/delete/" + id
    );
    return response.data;
  }
  public async UploadAvatar(file: File, id: string): Promise<Response> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await apiService.post<Response>(
        "/nS_NhanSu/UploadAvatar/" + id,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  public async getDropdowns(): Promise<Response<DropdownOption[]>> {
    const response = await apiService.get<
      Response<DropdownOption[]>
    >("/nS_NhanSu/getDropDowns");
    return response.data;
  }
  

  public async exportExcel(
    search: NS_NhanSuSearchType
  ): Promise<Response<string>> {
    const response = await apiService.post<Response>(
      "/nS_NhanSu/exportExcel",
      search
    );
    return response.data;
  }

  public async exportTemplateImport(): Promise<Response> {
    const response = await apiService.get<Response>(
      "/nS_NhanSu/exportTemplateImport"
    );
    return response.data;
  }

  public async getDataImportView(): Promise<Response> {
    const response = await apiService.get<Response>("/NS_NhanSu/import");
    return response.data;
  }

  public async saveImport(form: DataToSend): Promise<Response> {
    const response = await apiService.post<Response>(
      "/nS_NhanSu/importExcel",
      form
    );
    return response.data;
  }
}

const nS_NhanSuService = NS_NhanSuService.instance;
export default nS_NhanSuService;
