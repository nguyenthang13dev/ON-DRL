import { Response } from "@/types/general";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { debug } from "console";
import { toast } from "react-toastify";
export interface ApiResponse<T> {
  data: T;
  status: number;
}

export class ApiService {
  private static instance: ApiService;
  private api: AxiosInstance;

  private constructor() {
    this.api = axios.create({
      baseURL:
        process.env.NEXT_PUBLIC_API_URL + "/api" || "http://localhost:3000/api",
      timeout: 20000,
    });

    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("AccessToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (typeof window !== "undefined") {
          if (error.response?.status === 401) {
            localStorage.removeItem("AccessToken");
            window.location.href = "/auth/login";
          }
          if (error.response?.status === 403) {
            window.location.href = "/frobiden";
            return;
          }
          if (error.response?.status === 500) {
            const response = error.response.data as Response<any>;
            if (response) {
              toast.error(response.message || "Đã xảy ra lỗi không xác định!");
            }
          }
        }
        console.log("API Error:", error.response);
        return Promise.reject(error.response.data.title);
        // Luôn reject error object để phía gọi có thể xử lý và log chi tiết
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Các phương thức API với kiểu dữ liệu trả về
  public async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.api.get(url, config);
    return { data: response.data, status: response.status };
  }

  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.api.post(url, data, config);
    return { data: response.data, status: response.status };
  }

  public async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.api.put(url, data, config);
    return { data: response.data, status: response.status };
  }

  public async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.api.delete(url, config);
    return { data: response.data, status: response.status };
  }
}

export const apiService = ApiService.getInstance();
