import { UseCaseType, UseCaseImportResponseType, UseCaseGroupType, UseCaseCreateAndEditType, UseCaseCreate } from "@/types/UseCase/UseCase";
import { apiService } from "../index";
import { DropdownOption, Response } from "@/types/general";

class UseCaseService {
  public async GetData(): Promise<Response<UseCaseType[]>> {
    try {
      const response = await apiService.post<Response<UseCaseType[]>>(
        "/UC_UseCase/GetData"
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async GetById(): Promise<Response<UseCaseType[]>> {
    try {
      const response = await apiService.get<Response<UseCaseType[]>>(
        "/UC_UseCase/Get"
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }


  public async createUseCaseList(data: UseCaseCreate[]): Promise<Response<UseCaseCreate[]>> {
    try {
      const response = await apiService.post<Response<UseCaseCreate[]>>("/UC_UseCase/Create", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async create(data: UseCaseCreateAndEditType): Promise<Response<UseCaseCreateAndEditType>> {
    try {
      const response = await apiService.post<Response<UseCaseCreateAndEditType>>("/UC_MoTa_UseCase/Create", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async update(data: UseCaseCreateAndEditType): Promise<Response<UseCaseCreateAndEditType>> {
    try {
      const response = await apiService.put<Response<UseCaseCreateAndEditType>>("/UC_MoTa_UseCase/Update", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: string): Promise<Response<void>> {

    try {
      const response = await apiService.delete<Response<void>>(`/UC_MoTa_UseCase/Delete/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async readExcel(data: File, idDuAn: string): Promise<UseCaseImportResponseType> {
    try {
      const formData = new FormData();
      formData.append('fileTestCase', data);
      
      const response = await apiService.post<UseCaseImportResponseType>(
        "/UC_UseCase/ReadExcel?idDuAn=" + idDuAn,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async createUseCaseAndTestCase(data: UseCaseGroupType): Promise<Response<UseCaseGroupType>> {
    try {
      // Clean up data trước khi gửi API
      const cleanedData: UseCaseGroupType = {
        ...data,
        id: data.id || crypto.randomUUID(),
        listUC_mota: data.listUC_mota?.map(testCase => ({
          ...testCase,
          id: testCase.id && testCase.id.includes('-') && !testCase.id.startsWith('temp_') 
            ? testCase.id 
            : crypto.randomUUID(),
          idUseCase: data.id || crypto.randomUUID(), // Link to parent Use Case
        })) || []
      };


      // Gửi trực tiếp cleanedData, không wrap trong object
      const response = await apiService.post<Response<UseCaseGroupType>>(
        `/UC_UseCase/CreateUseCaseAndTestCase?idDuAn=${data.idDuAn}`, 
        cleanedData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('CreateUseCaseAndTestCase API Error:', error);
      throw error;
    }
  }

  public async importExcelSaveRange(data: UseCaseGroupType[], idDuAn: string): Promise<Response<UseCaseGroupType[]>> {
    try {
      const response = await apiService.post<Response<UseCaseGroupType[]>>(
        `/UC_UseCase/ImportExcelSaveRange?DuAnId=${idDuAn}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getDataintoUseCaseMota(idDuAn: string): Promise<Response<UseCaseGroupType[]>> {
    try {
      const response = await apiService.get<Response<UseCaseGroupType[]>>(
        `/UC_UseCase/GetDataintoUseCaseMota?DuAnId=${idDuAn}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  
  public async ExportExcelUseCaseAndTestCase(idDuAn: string): Promise<Response<string>> {
    try {
      const response = await apiService.get<Response<string>>(
        `/UC_UseCase/ExportExcelUseCase?DuAnId=${idDuAn}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
    
}

export const useCaseService = new UseCaseService();
