import {
  searchDuLieuDanhMucData,
  createEditType,
} from '@/types/duLieuDanhMuc/duLieuDanhMuc'
import { apiService } from '../index'
import { DropdownTreeOptionAntd, Response } from '@/types/general'
import { FormDeclarationSearch } from '@/types/formDeclaration/formDeclaration'

class FormDeclarationService {
  public async getDataByPage(
    searchData: FormDeclarationSearch
  ): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        '/FormDeclaration/GetData',
        searchData
      )
      return response.data
    } catch (error) {
      throw error
    }
  }
  public async GetById(id: string): Promise<Response> {
    try {
      const response = await apiService.get<Response>(`/FormDeclaration/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  }

  public async GenerateFormHtml(id: string): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        `/FormDeclaration/GenerateFormHtml/${id}`
      )
      return response.data
    } catch (error) {
      throw error
    }
  }

  public async CreatOrUpdate(formData: FormData): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        '/FormDeclaration/CreateOrUpdate',
        formData
      )
      return response.data
    } catch (error) {
      throw error
    }
  }
  // public async UpdateFormDeclarationField(
  //   FormDeclarationId: string,
  //   updatedFields: FieldDefinition
  // ): Promise<Response> {
  //   const response = await apiService.post<Response>(
  //     `/FormDeclaration/${FormDeclarationId}/field/update`,
  //     updatedFields
  //   )
  //   return response.data
  // }
  public async Delete(id: string): Promise<Response> {
    try {
      const response = await apiService.delete<Response>(
        `/FormDeclaration/Delete/${id}`
      )
      return response.data
    } catch (error) {
      throw error
    }
  }

  // public async Export(searchData: searchDuLieuDanhMucData): Promise<Response> {
  //   try {
  //     const response = await apiService.post<Response>(
  //       '/DM_DuLieuDanhMuc/Export',
  //       searchData
  //     )
  //     return response.data
  //   } catch (error) {
  //     throw error
  //   }
  // }

  // public async GetHierarchicalDropdownList(
  //   id?: string,
  //   disabledParent?: boolean
  // ): Promise<Response<DropdownTreeOptionAntd>> {
  //   try {
  //     const response = await apiService.get<Response<DropdownTreeOptionAntd>>(
  //       `/DM_DuLieuDanhMuc/GetHierarchicalDropdownList?id=${id}&disabledParent=${disabledParent}`
  //     )
  //     return response.data
  //   } catch (error) {
  //     throw error
  //   }
  // }
  // public async GetDropdown(groupCode: string): Promise<Response> {
  //   try {
  //     const response = await apiService.get<Response>(
  //       `/DM_DuLieuDanhMuc/GetDropdownByGroupCode/${groupCode}`
  //     )
  //     return response.data
  //   } catch (error) {
  //     throw error
  //   }
  // }
  // public async GetDropDownByDonViId(id: string): Promise<Response> {
  //   try {
  //     const response = await apiService.get<Response>(
  //       `/DM_DuLieuDanhMuc/GetDropDownByDonViId/${id}`
  //     )
  //     return response.data
  //   } catch (error) {
  //     throw error
  //   }
  // }

  // public async GetByCode(code: string): Promise<Response> {
  //   try {
  //     const response = await apiService.get<Response>(
  //       `/DM_DuLieuDanhMuc/GetByCode/${code}`
  //     )
  //     return response.data
  //   } catch (error) {
  //     throw error
  //   }
  // }
  // public async GetDropdownCode(groupCode: string): Promise<Response> {
  //   try {
  //     const response = await apiService.get<Response>(
  //       `/DM_DuLieuDanhMuc/GetDropdownCode/${groupCode}`
  //     )
  //     return response.data
  //   } catch (error) {
  //     throw error
  //   }
  // }

  // public async GetDropdownByGroupCode(groupCode: string): Promise<Response> {
  //   try {
  //     const response = await apiService.get<Response>(
  //       `/DM_DuLieuDanhMuc/GetDropdownByGroupCode/${groupCode}`
  //     )
  //     return response.data
  //   } catch (error) {
  //     throw error
  //   }
  // }

  // public async GetListDataByGroupCode(groupCode: string): Promise<Response> {
  //   try {
  //     const response = await apiService.get<Response>(
  //       `/DM_DuLieuDanhMuc/GetListDataByGroupCode/${groupCode}`
  //     )
  //     return response.data
  //   } catch (error) {
  //     throw error
  //   }
  // }
  // public async GetDropdownTreeOption(groupCode: string): Promise<Response> {
  //   try {
  //     const response = await apiService.get<Response>(
  //       `/DM_DuLieuDanhMuc/GetDropdownTreeOption/${groupCode}`
  //     )
  //     return response.data
  //   } catch (error) {
  //     throw error
  //   }
  // }
  // public async GetDropdownCodeAndNote(
  //   groupCode: string,
  //   note: string
  // ): Promise<Response> {
  //   try {
  //     const response = await apiService.get<Response>(
  //       `/DM_DuLieuDanhMuc/GetDropdownCodeAndNote/${groupCode}/${note}`
  //     )
  //     return response.data
  //   } catch (error) {
  //     throw error
  //   }
  // }
}

export const formDeclarationService = new FormDeclarationService()
