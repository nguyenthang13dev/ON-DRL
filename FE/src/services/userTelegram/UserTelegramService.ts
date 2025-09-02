import { apiService } from "@/services";
import { Response, ResponsePageList } from "@/types/general";
import { UserTelegramDto, UserTelegramSearch, UserTelegramCreate, UserTelegramEdit } from "@/types/userTelegram/UserTelegram";

class UserTelegramService {
  private static _instance: UserTelegramService;
  public static get instance(): UserTelegramService {
    if (!UserTelegramService._instance) {
      UserTelegramService._instance = new UserTelegramService();
    }
    return UserTelegramService._instance;
  }

  public async getData(
    search: UserTelegramSearch
  ): Promise<Response<ResponsePageList<UserTelegramDto[]>>> {
    const response = await apiService.post<
      Response<ResponsePageList<UserTelegramDto[]>>
    >("/UserTelegram/GetData", search);
    return response.data;
  }

  public async get(id: string): Promise<Response<UserTelegramDto>> {
    const response = await apiService.get<Response<UserTelegramDto>>(
      `/UserTelegram/Get/${id}`
    );
    return response.data;
  }

  // public async create(data: UserTelegramCreate): Promise<Response<UserTelegramDto>> {
  //   const response = await apiService.post<Response<UserTelegramDto>>(
  //     "/UserTelegram/Create",
  //     data
  //   );
  //   return response.data;
  // }

  // public async update(data: UserTelegramEdit): Promise<Response> {
  //   const response = await apiService.put<Response>(
  //     `/UserTelegram/Update/${data.id}`,
  //     data
  //   );
  //   return response.data;
  // }

  // public async delete(id: string): Promise<Response> {
  //   const response = await apiService.delete<Response>(
  //     `/UserTelegram/Delete/${id}`
  //   );
  //   return response.data;
  // }

  public async unlinkAllTelegramAccount(userIds: string[]): Promise<Response> {
    const response = await apiService.delete<Response>(
      "/UserTelegram/UnlinkAllTelegramAccount",
      { data: userIds }
    );
    return response.data;
  }

  public async unlinkTelegramAccountId(userTelegramIds: string[]): Promise<Response> {
    const response = await apiService.delete<Response>(
      "/UserTelegram/UnlinkTelegramAccountId",
      { data: userTelegramIds }
    );
    return response.data;
  }

  public async unlinkByChatIds(chatIds: string[]): Promise<Response> {
    const response = await apiService.delete<Response>(
      "/UserTelegram/UnlinkByChatIds",
      { data: chatIds }
    );
    return response.data;
  }

  public async generateTelegramLinkToken(): Promise<Response<{ token: string }>> {
    const response = await apiService.get<Response<{ token: string }>>(
      "/UserTelegram/GenerateTelegramLinkToken"
    );
    return response.data;
  }

  public async checkLinked(token: string): Promise<Response<{ Linked: boolean; UserId?: string; ChatId?: string; LinkedAt?: string }>> {
    const response = await apiService.post<Response<{ Linked: boolean; UserId?: string; ChatId?: string; LinkedAt?: string }>>(
      "/UserTelegram/CheckLinked",
      token,
      { headers: { 'Content-Type': 'application/json' } }
    );
    return response.data;
  }

  public async getAllLinked(): Promise<Response<UserTelegramDto[]>> {
    const response = await apiService.get<Response<UserTelegramDto[]>>(
      "/UserTelegram/GetAllLinked"
    );
    return response.data;
  }
}

const userTelegramService = UserTelegramService.instance;
export default userTelegramService; 