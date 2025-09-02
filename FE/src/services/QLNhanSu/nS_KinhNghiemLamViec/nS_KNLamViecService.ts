import { apiService } from "@/services";
import {
  DataToSend,
  Dictionary,
  DropdownOption,
  Response,
  ResponsePageList,
} from "@/types/general";
import {
  NS_KNLamViecCreateOrUpdateType,
  NS_KNLamViecType,
} from "@/types/QLNhanSu/nS_KinhNghiemLamViec/nS_KNLamViec";

interface NS_KNLamViecSearchType {
  nhanSuId?: string;
  pageIndex?: number;
  pageSize?: number;
}

class NS_KNLamViecService {
  private static _instance: NS_KNLamViecService;
  public static get instance(): NS_KNLamViecService {
    if (!NS_KNLamViecService._instance) {
      NS_KNLamViecService._instance = new NS_KNLamViecService();
    }
    return NS_KNLamViecService._instance;
  }

  public async getData(
    searchData: NS_KNLamViecSearchType
  ): Promise<Response<ResponsePageList<NS_KNLamViecType[]>>> {
    const response = await apiService.post<
      Response<ResponsePageList<NS_KNLamViecType[]>>
    >("/nS_KNLamViec/getData", searchData);
    return response.data;
  }

  public async create(
    formData: NS_KNLamViecCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.post<Response>(
      "/nS_KNLamViec/create",
      formData
    );
    return response.data;
  }

  public async update(
    formData: NS_KNLamViecCreateOrUpdateType
  ): Promise<Response> {
    const response = await apiService.put<Response>(
      "/nS_KNLamViec/update",
      formData
    );
    return response.data;
  }

  public async delete(id: string): Promise<Response> {
    const response = await apiService.delete<Response>(
      "/nS_KNLamViec/delete/" + id
    );
    return response.data;
  }

  public async getListDto(
    idNhanSu: string
  ): Promise<Response<ResponsePageList<NS_KNLamViecType[]>>> {
    const response = await apiService.get<
      Response<ResponsePageList<NS_KNLamViecType[]>>
    >("/nS_KNLamViec/getListDto/" + idNhanSu);
    return response.data;
  }
}
const nS_KNLamViecService = NS_KNLamViecService.instance;
export default nS_KNLamViecService;
