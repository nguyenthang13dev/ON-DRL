import { apiService } from '@/services';
import
  {
    DataToSend,
    Dictionary,
    DropdownOption,
    Response,
    ResponsePageList,
  } from '@/types/general';
import
  {
    KySoInfoCreateOrUpdateType,
    KySoInfoSearchType,
    KySoInfoType,
  } from '@/types/kySoInfo/kySoInfo';

class KySoInfoService {
  private static _instance: KySoInfoService;
  public static get instance(): KySoInfoService {
    if (!KySoInfoService._instance) {
      KySoInfoService._instance = new KySoInfoService();
    }
    return KySoInfoService._instance;
  }

  public async getData(
    searchData: KySoInfoSearchType
  ): Promise<Response<ResponsePageList<KySoInfoType[]>>> {
    const response = await apiService.post<
      Response<ResponsePageList<KySoInfoType[]>>
    >('/kySoInfo/getData', searchData);
    return response.data;
  }

  public async GetByThongTin(
    idDoiTuong: string,
    loaiDoiTuong: string,
    thongTin: string
  ): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        '/kySoInfo/GetByThongTin/',
        {
          params: {
            idDoiTuong,
            loaiDoiTuong,
            thongTin,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async create(formData: KySoInfoCreateOrUpdateType): Promise<Response> {
    const response = await apiService.post<Response>(
      '/kySoInfo/create',
      formData
    );
    return response.data;
  }

  public async update(formData: KySoInfoCreateOrUpdateType): Promise<Response> {
    const response = await apiService.put<Response>(
      '/kySoInfo/update',
      formData
    );
    return response.data;
  }

  public async delete(id: string): Promise<Response> {
    const response = await apiService.delete<Response>(
      '/kySoInfo/delete/' + id
    );
    return response.data;
  }
  public async getDropdowns(): Promise<Response<Dictionary<DropdownOption[]>>> {
    const response = await apiService.get<
      Response<Dictionary<DropdownOption[]>>
    >('/kySoInfo/getDropDowns');
    return response.data;
  }

  public async exportExcel(
    search: KySoInfoSearchType
  ): Promise<Response<string>> {
    const response = await apiService.post<Response>(
      '/kySoInfo/exportExcel',
      search
    );
    return response.data;
  }

  public async exportTemplateImport(): Promise<Response> {
    const response = await apiService.get<Response>(
      '/kySoInfo/exportTemplateImport'
    );
    return response.data;
  }

  public async getDataImportView(): Promise<Response> {
    const response = await apiService.get<Response>('/KySoInfo/import');
    return response.data;
  }

  public async saveImport(form: DataToSend): Promise<Response> {
    const response = await apiService.post<Response>(
      '/kySoInfo/importExcel',
      form
    );
    return response.data;
  }

  public async updateStatus(model: string): Promise<Response> {
    const response = await apiService.get<Response>(`/kySoCauHinh/UpdateStatus?Id=${model}`);
    return response.data;
  }
}

const kySoInfoService = KySoInfoService.instance;
export default kySoInfoService;
