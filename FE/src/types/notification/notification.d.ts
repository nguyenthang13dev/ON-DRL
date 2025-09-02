import { EntityType, SearchBase } from '../general';

export default interface Notification extends EntityType {
  message?: string;
  link?: string;
  isRead?: string;
  type?: string;
  itemName?: string;
  itemType?: string;
  fromUser?: string;
  fromUserName?: string;
  createdDate?: Date;
  createdBy?: string;
  toUser?: string;
  email?: string;
  loaiThongBao?: string;
  productId?: string;
  productName?: string;
  tieuDe?: string;
  noiDung?: string;
  nguoiTao?: string;
  fileDinhKem?: string;
  isXuatBan?: boolean;
  fileTaiLieu?: { id: string; name: string; url: string } | null;
}

export interface NotificationSearch extends SearchBase {
  toUser?: string;
  fromUserName?: string;
  message?: string;
  fromDate?: Date;
  toDate?: Date;
}

export interface NotificationCreate extends EntityType {
  message?: string;
  link?: string;
  isRead?: string;
  type?: string;
  itemName?: string;
  itemType?: string;
  createdDate?: Date;
  toUser?: string;
  email?: string;
  loaiThongBao?: string;
  productId?: string;
  productName?: string;
  isXuatBan?: boolean;
}

export interface NotificationUser extends EntityType {
  message?: string;
  link?: string;
  isRead?: string;
}
