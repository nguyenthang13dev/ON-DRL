


import { Response } from "@/types/general";
import
    {
        SearchTypeDanhMucData,
        TypeDanhMucCreateVM,
    } from "@/types/TypeDanhMuc/TypeDanhMuc";
import { apiService } from "../index";

class TypeDanhMucService {
  private static _instance: TypeDanhMucService;
  public static get instance(): TypeDanhMucService {
    if (!TypeDanhMucService._instance) {
      TypeDanhMucService._instance = new TypeDanhMucService();
    }
    return TypeDanhMucService._instance;
  }

  public async getDataByPage(
    searchData: SearchTypeDanhMucData
  ): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/TypeDanhMuc/GetData",
        searchData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getById(id: string): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        `/TypeDanhMuc/GetById/${id}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async getByType(type: string): Promise<Response> {
    try {
      const response = await apiService.get<Response>(
        `/TypeDanhMuc/GetByType/${type}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async create(formData: TypeDanhMucCreateVM): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/TypeDanhMuc/Create",
        formData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async update(formData: TypeDanhMucCreateVM): Promise<Response> {
    try {
      const response = await apiService.put<Response>(
        "/TypeDanhMuc/Update",
        formData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: string): Promise<Response> {
    try {
      const response = await apiService.delete<Response>(
        "/TypeDanhMuc/Delete/" + id
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async export(searchData: SearchTypeDanhMucData): Promise<Response> {
    try {
      const response = await apiService.post<Response>(
        "/TypeDanhMuc/Export",
        searchData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export const typeDanhMucService = TypeDanhMucService.instance;