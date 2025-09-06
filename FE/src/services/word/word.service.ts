import { Response } from "@/types/general";

export interface WordUploadResponse {
  htmlPreview: string;
  keys: string[];
  fileId: string;
  fileName: string;
  fileSize: number;
}

export interface KeyConfig {
  id: string;
  key: string;
  label: string;
  type: "text" | "number" | "select";
  required: boolean;
  placeholder?: string;
  options?: string[];
  defaultValue?: any;
}

export interface WordTemplateConfig {
  id?: string;
  name: string;
  description?: string;
  fileId: string;
  htmlPreview: string;
  keys: string[];
  keyConfigs: KeyConfig[];
  createdAt?: string;
  updatedAt?: string;
}

class WordService {
  private baseUrl = "/api/word";

  /**
   * Upload file Word và convert sang HTML
   */
  public async uploadAndConvert(
    file: File
  ): Promise<Response<WordUploadResponse>> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${this.baseUrl}/upload-and-convert`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
        message: "Upload và convert thành công",
      };
    } catch (error) {
      console.error("Upload and convert error:", error);
      return {
        success: false,
        data: {} as WordUploadResponse,
        message:
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi upload file",
      };
    }
  }

  /**
   * Lưu cấu hình template Word
   */
  public async saveTemplateConfig(
    config: WordTemplateConfig
  ): Promise<Response<WordTemplateConfig>> {
    try {
      const response = await fetch(`${this.baseUrl}/template-config`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
        message: "Lưu cấu hình template thành công",
      };
    } catch (error) {
      console.error("Save template config error:", error);
      return {
        success: false,
        data: {} as WordTemplateConfig,
        message:
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi lưu cấu hình",
      };
    }
  }

  /**
   * Lấy danh sách template Word
   */
  public async getTemplates(): Promise<Response<WordTemplateConfig[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/templates`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
        message: "Lấy danh sách template thành công",
      };
    } catch (error) {
      console.error("Get templates error:", error);
      return {
        success: false,
        data: [] as WordTemplateConfig[],
        message:
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi lấy danh sách template",
      };
    }
  }

  /**
   * Lấy template theo ID
   */
  public async getTemplateById(
    id: string
  ): Promise<Response<WordTemplateConfig>> {
    try {
      const response = await fetch(`${this.baseUrl}/templates/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
        message: "Lấy template thành công",
      };
    } catch (error) {
      console.error("Get template error:", error);
      return {
        success: false,
        data: {} as WordTemplateConfig,
        message:
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi lấy template",
      };
    }
  }

  /**
   * Cập nhật template
   */
  public async updateTemplate(
    id: string,
    config: Partial<WordTemplateConfig>
  ): Promise<Response<WordTemplateConfig>> {
    try {
      const response = await fetch(`${this.baseUrl}/templates/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
        message: "Cập nhật template thành công",
      };
    } catch (error) {
      console.error("Update template error:", error);
      return {
        success: false,
        data: {} as WordTemplateConfig,
        message:
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi cập nhật template",
      };
    }
  }

  /**
   * Xóa template
   */
  public async deleteTemplate(id: string): Promise<Response<boolean>> {
    try {
      const response = await fetch(`${this.baseUrl}/templates/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data: true,
        message: "Xóa template thành công",
      };
    } catch (error) {
      console.error("Delete template error:", error);
      return {
        success: false,
        data: false,
        message:
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi xóa template",
      };
    }
  }

  /**
   * Generate form từ template
   */
  public async generateForm(
    templateId: string,
    data: Record<string, any>
  ): Promise<Response<string>> {
    try {
      const response = await fetch(`${this.baseUrl}/generate-form`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        },
        body: JSON.stringify({
          templateId,
          data,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.html,
        message: "Generate form thành công",
      };
    } catch (error) {
      console.error("Generate form error:", error);
      return {
        success: false,
        data: "",
        message:
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi generate form",
      };
    }
  }

  /**
   * Extract keys từ HTML content
   */
  public async extractKeys(htmlContent: string): Promise<Response<string[]>> {
    try {
      const response = await fetch(`${this.baseUrl}/extract-keys`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
        },
        body: JSON.stringify({ htmlContent }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result.keys,
        message: "Extract keys thành công",
      };
    } catch (error) {
      console.error("Extract keys error:", error);
      return {
        success: false,
        data: [],
        message:
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi extract keys",
      };
    }
  }
}

export const wordService = new WordService();
export default wordService;
