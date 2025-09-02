import {ApiResponse, apiService} from "@/services";
import {Response,} from "@/types/general";
import {ArcTransferSearch, ArcTransferType} from "@/types/arcTransfer/arcTransfer";


class ArcTransferService {
    private static _instance: ArcTransferService;
    public static get instance(): ArcTransferService {
        if (!ArcTransferService._instance) {
            ArcTransferService._instance = new ArcTransferService();
        }
        return ArcTransferService._instance;
    }

    public async getArcTransferData(search: ArcTransferSearch): Promise<Response> {
        const response = await apiService.post<Response>(
            `/arcTransfer/GetData`,
            search
        );
        return response.data;
    }

    async createArcTransfer(data: ArcTransferType): Promise<ApiResponse<ArcTransferType>> {
        const response = await apiService.post<ApiResponse<ArcTransferType>>(
            '/arcTransfer/Create',
            data);
        return response.data;
    }

    async updateArcTransfer(id: string, data: ArcTransferType): Promise<ApiResponse<ArcTransferType>> {
        const response = await apiService.put<ApiResponse<ArcTransferType>>(
            '/arcTransfer/Update',
            data);
        return response.data;
    }

    async deleteArcTransfer(id: string): Promise<ApiResponse<ArcTransferType>> {
        const response = await apiService.delete<ApiResponse<ArcTransferType>>(
            '/arcTransfer/Delete/' + id);
        return response.data;
    }

    async getArcTransferById(id: string): Promise<ApiResponse<ArcTransferType>> {
        const response = await apiService.get<ApiResponse<ArcTransferType>>(
            `/arcTransfer/Get/${id}`
        );
        return response.data;
    }

}

const arcTransferService = ArcTransferService.instance;
export default arcTransferService;