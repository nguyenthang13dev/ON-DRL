
import { apiService } from "@/services";
import {
  DataToSend,
  Dictionary,
  DropdownOption,
  Response,
  ResponsePageList,
} from "@/types/general";
import { 
  DA_NhatKyTrienKhaiType, 
  DA_NhatKyTrienKhaiCreateOrUpdateType,
  DA_NhatKyTrienKhaiSearchType,
  ImportNhatKyTrienKhaiResponse
} from "@/types/dA_DuAn/dA_NhatKyTrienKhai";


class DA_NhatKyTrienKhaiService {
    private static _instance: DA_NhatKyTrienKhaiService;
    public static get instance(): DA_NhatKyTrienKhaiService {
        if (!DA_NhatKyTrienKhaiService._instance) {
            DA_NhatKyTrienKhaiService._instance = new DA_NhatKyTrienKhaiService();
        }
        return DA_NhatKyTrienKhaiService._instance;
    }

    public async readImportExcelDA_NhatKyTrienKhai(file: File, idDuAn: string): Promise<Response<ImportNhatKyTrienKhaiResponse>> {
        const formData = new FormData();
        formData.append("file", file);
        const response = await apiService.post<Response<ImportNhatKyTrienKhaiResponse>>(`/DA_NhatKyTrienKhai/ReadNhatKyTrienKhaiFromFile?idDuAn=${idDuAn}`, formData);
        return response.data;
    }
    
  
    public async saveImportedData(items: DA_NhatKyTrienKhaiCreateOrUpdateType[]): Promise<Response<any>> {
        const response = await apiService.post<Response<any>>('/DA_NhatKyTrienKhai/CreateNhatKyTrienKhaiRange', items);
        return response.data;
    }

    public async delete(id: string): Promise<Response<any>> {
        const response = await apiService.get<Response<any>>(`/DA_NhatKyTrienKhai/Delete/${id}`);
        return response.data;
    }

    public async create(data: DA_NhatKyTrienKhaiCreateOrUpdateType): Promise<Response<any>> {
        const response = await apiService.post<Response<any>>('/DA_NhatKyTrienKhai/Create', data);
        return response.data;
    }

    public async update( data: DA_NhatKyTrienKhaiCreateOrUpdateType): Promise<Response<any>> {
        const response = await apiService.put<Response<any>>(`/DA_NhatKyTrienKhai/Update/`, data);
        return response.data;
    }

    public async getByDuAnId(duAnId: string): Promise<Response<any>> {
        const response = await apiService.get<Response<any>>(`/DA_NhatKyTrienKhai/GetByDuAnId/${duAnId}`);
        return response.data;
    }

    public async getData(searchParams: DA_NhatKyTrienKhaiSearchType): Promise<Response<any>> {
        const response = await apiService.post<Response<any>>('/DA_NhatKyTrienKhai/GetData', searchParams);
        return response.data;
    }

    public async exportExcel(searchParams: DA_NhatKyTrienKhaiSearchType): Promise<Response<any>> {
        const response = await apiService.post<Response<any>>('/DA_NhatKyTrienKhai/ExportExcel', searchParams);
        return response.data;
    }

    public async exportWord(duAnId: string): Promise<Response<any>> {
        const response = await apiService.get<Response<any>>(`/DA_NhatKyTrienKhai/EportWordNhatKyTrienKhai?duAnId=${duAnId}`);
        return response.data;
    }
    public async ExportWordNhatKyTrienKhaiTuKeHoachThucHien(duAnId: string,isDay: boolean): Promise<Response<any>> {
        const response = await apiService.get<Response<any>>(`/DA_NhatKyTrienKhai/ExportWordNhatKyTrienKhaiTuKeHoachThucHien?duAnId=${duAnId}&isDay=${isDay}`);
        return response.data;
    }
}


const dA_NhatKyTrienKhaiService = DA_NhatKyTrienKhaiService.instance;
export default dA_NhatKyTrienKhaiService;   