import { Response } from "@/types/general";
import { SoLieuKeKhaiType, SoLieuKeKhaiUserDto } from "@/types/SoLieuKeKhai/soLieuKeKhai";
import { apiService } from "..";



class SoLieuKeKhaiService
{
    private static _instance: SoLieuKeKhaiService;
    public static get instance(): SoLieuKeKhaiService
    {
        if ( !SoLieuKeKhaiService._instance )
        {
            SoLieuKeKhaiService._instance = new SoLieuKeKhaiService();
        }
        return SoLieuKeKhaiService._instance;
    }

    public async KeKhaiSoLieu( formData: SoLieuKeKhaiType ): Promise<Response>
    {
        const response = await apiService.post<Response>( "SoLieuKeKhai/KeKhaiForm", formData );
        return response.data;
    }

    public async GetSoLieuKeKhaiByFormAndUser( formId: string ): Promise<Response<SoLieuKeKhaiUserDto[]>>
    {
        const response = await apiService.get<Response<SoLieuKeKhaiUserDto[]>>( `SoLieuKeKhai/GetSoLieuKeKhai?Id=${formId}` );
        return response.data;
    }

}

export const soLieuKeKhaiService = SoLieuKeKhaiService.instance;