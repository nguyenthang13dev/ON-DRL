// DTO
export interface GroupTelegramDto {
  id: string;
  groupName: string;
  chatId: string;
  description?: string;
  eventTypeCode?: string;
  isActive: boolean;
  createdDate?: string;
  updatedDate?: string;
  createdBy?: string;
  updatedBy?: string;
  tenEventTypeCode?: string;
}

// Search
export interface GroupTelegramSearch {
  groupName?: string;
  chatId?: string;
  eventTypeCode?: string;
  isActive?: boolean;
  pageIndex: number;
  pageSize: number;
}

// Create
export interface GroupTelegramCreate {
  groupName: string;
  chatId: string;
  description?: string;
  eventTypeCode?: string;
}

// Edit
export interface GroupTelegramEdit extends GroupTelegramCreate {
  id: string;
} 