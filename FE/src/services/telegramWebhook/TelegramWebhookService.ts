import { apiService } from "@/services";
import { Response } from "@/types/general";
import {
  SetupWebhookRequest,
} from "@/types/telegramWebhook/TelegramWebhook";

class TelegramWebhookService {
  private static _instance: TelegramWebhookService;
  public static get instance(): TelegramWebhookService {
    if (!TelegramWebhookService._instance) {
      TelegramWebhookService._instance = new TelegramWebhookService();
    }
    return TelegramWebhookService._instance;
  }

  public async setupWebhook(
    data: SetupWebhookRequest
  ): Promise<Response> {
    const response = await apiService.post<Response>(
      "/telegram/webhook/setup",
      data
    );
    return response.data;
  }

  public async getWebhookInfo(): Promise<Response> {
    const response = await apiService.get<Response>(
      "/telegram/webhook/info"
    );
    return response.data;
  }

  public async deleteWebhook(): Promise<Response> {
    const response = await apiService.post<Response>(
      "/telegram/webhook/delete"
    );
    return response.data;
  }
}

const telegramWebhookService = TelegramWebhookService.instance;
export default telegramWebhookService; 