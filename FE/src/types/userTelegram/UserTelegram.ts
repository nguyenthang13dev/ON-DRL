// DTO
export interface UserTelegramDto {
  id: string;
  userId: string;
  chatId: string;
  isActive: boolean;
  createdDate?: string;
  updatedDate?: string;
  createdBy?: string;
  updatedBy?: string;
  fullName?: string;
  linkedAt?: string;
}

// Search
export interface UserTelegramSearch {
  userId?: string;
  chatId?: string;
  isActive?: boolean;
  pageIndex: number;
  pageSize: number;
}

// Create
export interface UserTelegramCreate {
  fullName?:string;
  userId: string;
  chatId: string;
  isActive?: boolean;
}

// Edit
export interface UserTelegramEdit extends UserTelegramCreate {
  id: string;
} 