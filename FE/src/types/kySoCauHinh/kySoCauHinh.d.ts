import { EntityType, SearchBase } from '../general';

export interface KySoCauHinhType extends EntityType {
  idBieuMau?: string;
  idDTTienTrinhXuLy?: string;
  type?: string;
  posX: number;
  posY: number;
  width: number;
  height: number;
  content: string;
  imageSrc: string;
  fontSize: number;
  textColor?: string;
  //
  pdfTempLink?: string;
  imageFile?: File;
}

export interface KySoCauHinhCreateOrUpdateType {
  id?: string;
  idBieuMau?: string;
  idDTTienTrinhXuLy?: string;
  type?: string;
  posX?: number;
  posY?: number;
  width?: number;
  height?: number;
  content?: string;
  imageSrc?: string;
  fontSize?: number;
}

export interface KySoCauHinhSearchType extends SearchBase {
  idBieuMau?: string;
  idDTTienTrinhXuLy?: string;
  type?: string;
  posX?: number;
  posY?: number;
  width?: number;
  height?: number;
  content?: string;
  imageSrc?: string;
  fontSize?: number;
}

export interface PdfDisplayType {
  displayWidth: number;
  displayHeight: number;
  marginLeft: number;
  marginTop: number;
}

export interface KySoCauHinhSaveType {
  file?: File;
  idBieuMau?: string;
  idDTTienTrinhXuLy?: string;
  listCauHinh?: KySoCauHinhType[];
}
