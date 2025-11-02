import { Response } from "@/types/general";
import { upDateKeKhaiSummaryVM } from "@/types/KeKhaiSummary/keKhaiSummary";
import { apiService } from "..";

class KeKhaiSummaryService
{
    private static _instance: KeKhaiSummaryService;
    public static get instance(): KeKhaiSummaryService
    {
        if ( !KeKhaiSummaryService._instance )
        {
            KeKhaiSummaryService._instance = new KeKhaiSummaryService();
        }
        return KeKhaiSummaryService._instance;
    }

    public async UpdateStatus(model: upDateKeKhaiSummaryVM) : Promise<Response>
    {
        const response = await apiService.post<Response>( "KeKhaiSummary/UpdateStatus", model );
        return response.data;
    }

}

export const keKhaiSummaryService = KeKhaiSummaryService.instance;