import { apiService } from "@/services";
import { Response, ResponsePageList } from "@/types/general";
import {
  LichSuXuLyType,
  LichSuXuLyDtoType,
  LichSuXuLyCreateType,
  LichSuXuLyEditType,
  LichSuXuLySearchType,
} from "@/types/LichSuXuLy/LichSuXuLy";

class LichSuXuLyService {
  private static _instance: LichSuXuLyService;
  public static get instance(): LichSuXuLyService {
    if (!LichSuXuLyService._instance) {
      LichSuXuLyService._instance = new LichSuXuLyService();
    }
    return LichSuXuLyService._instance;
  }

  public async getData(
    searchData: LichSuXuLySearchType
  ): Promise<Response<ResponsePageList<LichSuXuLyDtoType[]>>> {
    const response = await apiService.post<
      Response<ResponsePageList<LichSuXuLyDtoType[]>>
    >("/LichSuXuLy/GetData", searchData);
    return response.data;
  }

  public async get(id: string): Promise<Response<LichSuXuLyDtoType>> {
    const response = await apiService.get<Response<LichSuXuLyDtoType>>(
      `/LichSuXuLy/Get/${id}`
    );
    return response.data;
  }

  public async getByItem(itemId: string, itemType: string): Promise<Response<LichSuXuLyDtoType[]>> {
    const response = await apiService.get<Response<LichSuXuLyDtoType[]>>(
      `/LichSuXuLy/GetByItem/${itemId}/${itemType}`
    );
    return response.data;
  }

  public async create(
    formData: LichSuXuLyCreateType
  ): Promise<Response> {
    const response = await apiService.post<Response>(
      "/LichSuXuLy/Create",
      formData
    );
    return response.data;
  }

  public async update(
    formData: LichSuXuLyEditType
  ): Promise<Response> {
    const response = await apiService.post<Response>(
      "/LichSuXuLy/Update",
      formData
    );
    return response.data;
  }

  public async delete(id: string): Promise<Response> {
    const response = await apiService.delete<Response>(
      `/LichSuXuLy/Delete/${id}`
    );
    return response.data;
  }
}

const lichSuXuLyService = LichSuXuLyService.instance;
export default lichSuXuLyService; 