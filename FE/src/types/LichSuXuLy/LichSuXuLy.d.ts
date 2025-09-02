import { EntityType, SearchBase } from "../general";

export interface LichSuXuLyType extends EntityType {
  ItemId: string;
  ItemType: string;
  note?: string;
  oldData?: string;
  newDaTa?: string;
  createdDate?: string;
  createdBy?: string | null;
  updatedDate?: string;
}

export interface LichSuXuLyDtoType extends LichSuXuLyType {
  // Kế thừa từ LichSuXuLyType, có thể thêm các field đặc biệt cho DTO nếu cần
}

export interface LichSuXuLyCreateType {
  ItemId: string;
  ItemType: string;
  note?: string;
  oldData?: string;
  newDaTa?: string;
}

export interface LichSuXuLyEditType extends LichSuXuLyCreateType {
  Id: string;
}

export interface LichSuXuLySearchType extends SearchBase {
  ItemId?: string;
  ItemType?: string;
  Note?: string;
} 