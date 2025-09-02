import {
    searchGroupUserData,
    tableGroupUserDataType,
    createEditType,
} from "@/types/groupUser/groupUser";
import { apiService } from "../index";
import { ResponsePageList, Response } from "@/types/general";

class groupUserService {
    public async getDataByPage(
        searchData: searchGroupUserData
    ): Promise<Response<ResponsePageList<tableGroupUserDataType[]>>> {
        try {
            const response = await apiService.post<
                Response<ResponsePageList<tableGroupUserDataType[]>>
            >("/GroupUser/GetData", searchData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async Create(formData: createEditType): Promise<Response> {
        try {
            const response = await apiService.post<Response>(
                "/GroupUser/Create",
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
                "/GroupUser/Update",
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
                "/GroupUser/Delete/" + id
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async getDropdown(): Promise<Response> {
        try {
            const res = await apiService.get<Response>("/GroupUser/GetDropdown/");
            return res.data;
        } catch (er) {
            throw er;
        }
    }

    public async exportExcel(): Promise<Response> {
        try {
            const response = await apiService.get<Response>("/GroupUser/export");
            return response.data;
        } catch (error) {
            throw error;
        }
    }

}

export const GroupUserService = new groupUserService();
