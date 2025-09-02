import {
  createEditType,
  searchNP_LoaiNghiPhepDataType,
  tableNP_LoaiNghiPhepDataType,
} from "@/types/NP_LoaiNghiPhep/np_LoaiNghiPhep";
import { apiService } from "../../index";
import { DataToSend, DropdownOption, Response, ResponsePageList } from "@/types/general";
import { ThongTinNghiPhepType } from "@/types/NP_DangKyNghiPhep/NP_DangKyNghiphep";

class NP_LoaiNghiPhepService {
  public async getDataByPage(
    searchData: searchNP_LoaiNghiPhepDataType
  ): Promise<Response<ResponsePageList<tableNP_LoaiNghiPhepDataType[]>>> {
    try {
      const response = await apiService.post<
        Response<ResponsePageList<tableNP_LoaiNghiPhepDataType[]>>
      >("/NP_LoaiNghiPhep/GetData", searchData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async Create(formData: createEditType): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/NP_LoaiNghiPhep/Create",
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
        "/NP_LoaiNghiPhep/Update",
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
        "/NP_LoaiNghiPhep/Delete/" + id
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async exportExcel(): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        "/NP_LoaiNghiPhep/export"
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async exportTemplateImport(): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        "/NP_LoaiNghiPhep/exportTemplateImport"
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getDataImportView(): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        "/NP_LoaiNghiPhep/import"
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async saveImport(form: DataToSend): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/NP_LoaiNghiPhep/importExcel",
        form
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async GetDropDown(): Promise<Response<DropdownOption[]>> {
    try {
      const response = await apiService.get<Response<DropdownOption[]>>(
        "/NP_LoaiNghiPhep/GetDropDown"
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }

  public async GetDanhSach(): Promise<Response<tableNP_LoaiNghiPhepDataType[]>> {
    try {
      const response = await apiService.get<Response<tableNP_LoaiNghiPhepDataType[]>>(
        "/NP_LoaiNghiPhep/GetDanhSach"
      );
      return response.data;
    } catch (err) {
      throw err;
    }
  }
}

export const nP_LoaiNghiPhepService = new NP_LoaiNghiPhepService();
