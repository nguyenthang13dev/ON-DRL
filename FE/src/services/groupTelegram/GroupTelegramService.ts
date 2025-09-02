import { apiService } from "@/services";
import { Response, ResponsePageList } from "@/types/general";
import { GroupTelegramDto, GroupTelegramSearch, GroupTelegramCreate, GroupTelegramEdit } from "@/types/groupTelegram/GroupTelegram";

class GroupTelegramService {
  private static _instance: GroupTelegramService;
  public static get instance(): GroupTelegramService {
    if (!GroupTelegramService._instance) {
      GroupTelegramService._instance = new GroupTelegramService();
    }
    return GroupTelegramService._instance;
  }

  public async getData(
    search: GroupTelegramSearch
  ): Promise<Response<ResponsePageList<GroupTelegramDto[]>>> {
    const response = await apiService.post<
      Response<ResponsePageList<GroupTelegramDto[]>>
    >("/GroupTelegram/GetData", search);
    return response.data;
  }

  public async get(id: string): Promise<Response<GroupTelegramDto>> {
    const response = await apiService.get<Response<GroupTelegramDto>>(
      `/GroupTelegram/Get/${id}`
    );
    return response.data;
  }

  // public async create(data: GroupTelegramCreate): Promise<Response<GroupTelegramDto>> {
  //   const response = await apiService.post<Response<GroupTelegramDto>>(
  //     "/GroupTelegram/Create",
  //     data
  //   );
  //   return response.data;
  // }

  // public async update(data: GroupTelegramEdit): Promise<Response> {
  //   const response = await apiService.put<Response>(
  //     `/GroupTelegram/Update/${data.id}`,
  //     data
  //   );
  //   return response.data;
  // }

  // public async delete(id: string): Promise<Response> {
  //   const response = await apiService.delete<Response>(
  //     `/GroupTelegram/Delete/${id}`
  //   );
  //   return response.data;
  // }

  public async unlinkGroups(chatIds: string[]): Promise<Response> {
    const response = await apiService.post<Response>(
      "/GroupTelegram/UnlinkGroups",
      chatIds
    );
    return response.data;
  }

  public async unlinkGroupsByEventTypeCodes(eventTypeCodes: string[]): Promise<Response> {
    const response = await apiService.post<Response>(
      "/GroupTelegram/UnlinkGroupsByEventTypeCodes",
      eventTypeCodes
    );
    return response.data;
  }

  public async getGroupTelegramLinkToken(groupName: string, eventTypeCode: string): Promise<Response<string>> {
    const response = await apiService.get<Response<string>>(
      `/GroupTelegram/GetGroupTelegramLinkToken?groupName=${encodeURIComponent(groupName)}&eventTypeCode=${encodeURIComponent(eventTypeCode)}`
    );
    return response.data;
  }
}

const groupTelegramService = GroupTelegramService.instance;
export default groupTelegramService; 