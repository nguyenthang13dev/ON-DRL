
import { UseCase_NhomCreateAndEditType, UseCase_NhomType } from "@/types/UseCase_Nhom/UseCase_Nhom";
import { apiService } from "..";
import { Response } from "@/types/general";

class UseCase_NhomService {
    public async create(data: UseCase_NhomCreateAndEditType): Promise<Response<UseCase_NhomCreateAndEditType>> {
        try {
            const response = await apiService.post<Response<UseCase_NhomCreateAndEditType>>("/UC_UseCase/Create", data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    public async update(data: UseCase_NhomCreateAndEditType): Promise<Response<UseCase_NhomCreateAndEditType>> {
        try {
            const response = await apiService.put<Response<UseCase_NhomCreateAndEditType>>("/UC_UseCase/Update", data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    public async delete(id: string): Promise<Response<void>> {
        try {
            const response = await apiService.delete<Response<void>>(`/UC_UseCase/Delete/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}   

export const useCase_NhomService = new UseCase_NhomService();