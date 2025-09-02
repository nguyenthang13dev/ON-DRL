import { apiService } from "../index";
import { Response, SearchBase } from "@/types/general";
import { FileManagerCreateOrUpdateType, FileManagerSearchType, FileManagerType, FileSecurityType } from "@/types/fileManager/fileManager";

class fileManagerService {
    public async getData(
        searchData: FileManagerSearchType
    ): Promise<Response<FileManagerType[]>> {
        try {
            const response = await apiService.post<
                Response<FileManagerType[]>
            >("/fileManager/getData", searchData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async searchData(
        searchData: FileManagerSearchType
    ): Promise<Response<FileManagerType[]>> {
        try {
            const response = await apiService.post<
                Response<FileManagerType[]>
            >("/fileManager/searchData", searchData);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async Create(formData: FileManagerCreateOrUpdateType): Promise<Response> {
        try {
            const response = await apiService.post<Response>(
                "/fileManager/Create",
                formData
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async Update(formData: FileManagerCreateOrUpdateType): Promise<Response> {
        try {
            const response = await apiService.put<Response>(
                "/fileManager/Update",
                formData
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async Delete(ids: string[]): Promise<Response> {
        try {
            const response = await apiService.post<Response>(
                "/fileManager/Delete", ids
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async Rename(id: string, newName: string): Promise<Response> {
        try {
            const response = await apiService.get<Response>(
                "/fileManager/Rename", { params: { id: id, newName: newName } }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async Download(fileIDs: string[]): Promise<Response> {
        try {
            const response = await apiService.post<Response>(
                "/fileManager/Download", fileIDs,
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async Copy(sourceItems: FileManagerType[], destinationFolder: FileManagerType): Promise<Response> {
        try {
            const response = await apiService.post<Response>(
                "/fileManager/copy", { sourceItems, destinationFolder }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async Move(sourceItems: FileManagerType[], destinationFolder: FileManagerType): Promise<Response> {
        try {
            const response = await apiService.post<Response>(
                "/fileManager/move", { sourceItems, destinationFolder }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async GetSecurity(id: string): Promise<Response> {
        try {
            const response = await apiService.get<Response>(
                "/fileManager/GetSecurity/" + id,
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async SaveSecurity(fileSecurities: FileSecurityType[], fileID: string): Promise<Response> {
        try {
            const response = await apiService.post<Response>(
                `/fileManager/SaveSecurity/?fileID=${fileID}`, fileSecurities
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async GetDropdownObject(): Promise<Response> {
        try {
            const response = await apiService.get<Response>(
                "/fileManager/GetDropdownObject"
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    public async GetDropdownOption(): Promise<Response> {
        try {
            const response = await apiService.get<Response>(
                "/fileManager/GetDropdownOption"
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

}

export const FileManagerService = new fileManagerService();
