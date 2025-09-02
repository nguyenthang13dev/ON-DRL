import { apiService } from "@/services";
import { Response, ResponsePageList } from "@/types/general";
import {
  TemplateTestCase,
  TemplateTestCaseCreate,
  TemplateTestCaseEdit,
  TemplateTestCaseSearch,
} from "@/types/templateTestCase/templateTestCase";

// DTOs cho hàm generate use case strings - Cập nhật theo API mới
export interface UseCaseInputDto {
  tenUseCase: string;
  maTacNhanChinhs: string[]; // Thay đổi từ tacNhanChinh (string) thành maTacNhanChinhs (array)
  doPhucTapCode: string; // Thay đổi từ doPhucTap (number) thành doPhucTapCode (string)
}

export interface UseCaseGenerateResultDto {
  tenUseCase: string;
  tacNhanChinh: string;
  doPhucTapCode: string;
  doPhucTapName: string;
  moTaTruongHop?: string[];
  lstHanhDongNangCao?: string[];
}

// Interface cho dropdown options
export interface DropdownOption {
  value: string;
  label: string;
}

class TemplateTestCaseService {
  private static _instance: TemplateTestCaseService;
  public static get instance(): TemplateTestCaseService {
    if (!TemplateTestCaseService._instance) {
      TemplateTestCaseService._instance = new TemplateTestCaseService();
    }
    return TemplateTestCaseService._instance;
  }

  public async create(
    model: TemplateTestCaseCreate
  ): Promise<Response<TemplateTestCase>> {
    try {
      const response = await apiService.post<Response<TemplateTestCase>>(
        "/UC_TemplateTestCase/create",
        model
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async update(
    model: TemplateTestCaseEdit
  ): Promise<Response<TemplateTestCase>> {
    try {
      const response = await apiService.put<Response<TemplateTestCase>>(
        "/UC_TemplateTestCase/update",
        model
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async get(id: string): Promise<Response<TemplateTestCase>> {
    try {
      const response = await apiService.get<Response<TemplateTestCase>>(
        `/UC_TemplateTestCase/get/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getData(
    search: TemplateTestCaseSearch
  ): Promise<Response<ResponsePageList<TemplateTestCase[]>>> {
    try {
      const response = await apiService.post<
        Response<ResponsePageList<TemplateTestCase[]>>
      >("/UC_TemplateTestCase/getData", search);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: string): Promise<Response<void>> {
    try {
      const response = await apiService.delete<Response<void>>(
        `/UC_TemplateTestCase/delete/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async generateUseCaseStrings(
    inputList: UseCaseInputDto[]
  ): Promise<Response<UseCaseGenerateResultDto[]>> {
    try {
      const response = await apiService.post<
        Response<UseCaseGenerateResultDto[]>
      >("/UC_TemplateTestCase/GenerateUseCaseStrings", inputList);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Thêm method để lấy danh sách độ phức tạp
  public async getDoPhucTapCode(): Promise<Response<DropdownOption[]>> {
    try {
      const response = await apiService.get<Response<DropdownOption[]>>(
        "/UC_TemplateTestCase/GetDoPhucTapCode"
      );
      console.log("Service getDoPhucTapCode response:", response);
      console.log("Service getDoPhucTapCode response.data:", response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

const templateTestCaseService = TemplateTestCaseService.instance;
export default templateTestCaseService;
