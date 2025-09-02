import { apiService } from "@/services";
import {
  DataToSend,
  DropdownOption,
  Response,
  ResponsePageList,
} from "@/types/general";
import {
  QLThongBaoCreateOrUpdateType,
  QLThongBaoSearchType,
  QLThongBaoType,
} from "@/types/QLThongBao/QLThongBao";

class QLThongBaoService {
  private static _instance: QLThongBaoService;
  public static get instance(): QLThongBaoService {
    if (!QLThongBaoService._instance) {
      QLThongBaoService._instance = new QLThongBaoService();
    }
    return QLThongBaoService._instance;
  }
  public async getData(
    searchData: QLThongBaoSearchType
  ): Promise<Response<ResponsePageList<QLThongBaoType[]>>> {
    const payload = {
      ...searchData,
      loaiThongBao: Array.isArray(searchData.loaiThongBao)
        ? searchData.loaiThongBao.join(",")
        : searchData.loaiThongBao,
    };
    const response = await apiService.post<
      Response<ResponsePageList<QLThongBaoType[]>>
    >("/QLThongBao/GetData", payload);
    return response.data;
  }

  public async Create(
    formData: QLThongBaoCreateOrUpdateType
  ): Promise<Response<QLThongBaoType>> {
    const response = await apiService.post<Response<QLThongBaoType>>(
      "/QLThongBao/Create",
      formData
    );
    return response.data;
  }
  public async Update(
    formData: QLThongBaoCreateOrUpdateType
  ): Promise<Response<QLThongBaoType>> {
    const response = await apiService.put<Response<QLThongBaoType>>(
      "/QLThongBao/Update",
      formData
    );
    return response.data;
  }
  public async Delete(id: string): Promise<Response> {
    const response = await apiService.delete<Response>(
      "/QLThongBao/Delete/" + id
    );
    return response.data;
  }
}

const QL_ThongBaoService = QLThongBaoService.instance;
export default QL_ThongBaoService;
