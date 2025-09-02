import { TacNhan_UseCaseType, TacNhan_UseCaseSearchType, TacNhan_UseCaseCreateType, TacNhan_UseCaseEditType } from "@/types/TacNhan_UseCase/TacNhan_UseCase";
import { apiService } from "../index";
import { Response, ResponsePageList } from "@/types/general";

class TacNhan_UseCaseService {
  public async getData(search: TacNhan_UseCaseSearchType): Promise<Response<ResponsePageList<TacNhan_UseCaseType[]>>> {
    const response = await apiService.post<Response<ResponsePageList<TacNhan_UseCaseType[]>>>(
      "/TacNhan_UseCase/GetData",
      search
    );
    return response.data;
  }

  public async getDto(id: string): Promise<Response<TacNhan_UseCaseType>> {
    const response = await apiService.get<Response<TacNhan_UseCaseType>>(
      `/TacNhan_UseCase/GetDto/${id}`
    );
    return response.data;
  }

  public async create(data: TacNhan_UseCaseCreateType): Promise<Response<TacNhan_UseCaseType>> {
    const response = await apiService.post<Response<TacNhan_UseCaseType>>(
      "/TacNhan_UseCase/Create",
      data
    );
    return response.data;
  }

  public async update(data: TacNhan_UseCaseEditType): Promise<Response<TacNhan_UseCaseType>> {
    const response = await apiService.put<Response<TacNhan_UseCaseType>>(
      "/TacNhan_UseCase/Update",
      data
    );
    return response.data;
  }

  public async delete(id: string): Promise<Response<void>> {
    const response = await apiService.delete<Response<void>>(
      `/TacNhan_UseCase/Delete/${id}`
    );
    return response.data;
  }
}

export const tacNhan_UseCaseService = new TacNhan_UseCaseService(); 