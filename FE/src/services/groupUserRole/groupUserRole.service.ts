import { apiService } from "../index";
import { Response } from "@/types/general";
import { createEditType } from "@/types/groupUserRole/groupUserRole";

class GroupUserRoleService {
    public async Create(formData: createEditType): Promise<Response> {
        try {
            const response = await apiService.post<Response>(
                "/GroupUserRole/Create",
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
                "/GroupUserRole/Delete/" + id
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

}

export const groupUserRoleService = new GroupUserRoleService();
