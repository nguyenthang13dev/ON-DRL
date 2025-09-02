import {
  ConfigUpload,
  createEditType,
  HuyDangKyType,
  searchNP_DangKyNghiPhepDataType,
  tableNP_DangKyNghiPhepDataType,
  ThongKeNghiPhepResponse,
  ThongTinNghiPhepResponse,
  ThongTinNghiPhepType,
} from "@/types/NP_DangKyNghiPhep/NP_DangKyNghiphep";
import { apiService } from "../../index";
import { DataToSend, Response, ResponsePageList } from "@/types/general";

class NP_DangKyNghiPhepService {
  public async getDataByPage(
    searchData: searchNP_DangKyNghiPhepDataType
  ): Promise<Response<ResponsePageList<tableNP_DangKyNghiPhepDataType[]>>> {
    try {
      const response = await apiService.post<
        Response<ResponsePageList<tableNP_DangKyNghiPhepDataType[]>>
      >("/NP_DangKyNghiPhep/GetData", searchData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Create(formData: createEditType): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/NP_DangKyNghiPhep/Create",
        formData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Update(formData: createEditType): Promise<Response> {
    try {
      const response = await apiService.put<Response>(
        "/NP_DangKyNghiPhep/Update",
        formData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Delete(id: string): Promise<Response> {
    try {
      const response = await apiService.delete<Response>(
        "/NP_DangKyNghiPhep/Delete/" + id
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async PheDuyet(id: string): Promise<Response> {
    try {
      const response = await apiService.put<Response>(
        "/NP_DangKyNghiPhep/PheDuyet/" + id
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Trinh(id: string): Promise<Response> {
    try {
      const response = await apiService.put<Response>(
        "/NP_DangKyNghiPhep/Trinh/" + id
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async TuChoi(id: string, formData: HuyDangKyType): Promise<Response> {
    try {
      const response = await apiService.put<Response>(
        "/NP_DangKyNghiPhep/TuChoi/" + id,
        formData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async exportExcel(): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        "/NP_DangKyNghiPhep/export"
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async exportTemplateImport(): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        "/NP_DangKyNghiPhep/exportTemplateImport"
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getDataImportView(): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        "/NP_DangKyNghiPhep/import"
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async saveImport(form: DataToSend): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/NP_DangKyNghiPhep/importExcel",
        form
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async configUpload(config: ConfigUpload): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        `/NP_DangKyNghiPhep/ConfigUpload`,
        config
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getTaiLieuDinhKem(): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        `/NP_DangKyNghiPhep/GetTaiLieuDinhKem`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async GetSoNgayPhep(): Promise<Response<ThongTinNghiPhepType>> {
    try {
      const response = await apiService.get<Response<ThongTinNghiPhepType>>(
        "/NP_DangKyNghiPhep/GetSoNgayPhep"
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  public async Preview(Id: string): Promise<Response<ThongTinNghiPhepResponse>> {
    try {
      const response = await apiService.get<Response<ThongTinNghiPhepResponse>>(
        `/NP_DangKyNghiPhep/Preview/${Id}`
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  public async GetThongKe(): Promise<Response<ThongKeNghiPhepResponse>> {
    try {
      const response = await apiService.get<Response<ThongKeNghiPhepResponse>>(
        `/NP_DangKyNghiPhep/ThongKeNghiPhep`
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }
}

export const nP_DangKyNghiPhepService = new NP_DangKyNghiPhepService();
