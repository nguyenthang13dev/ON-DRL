import { KySoCauHinhType } from './kySoCauHinh';

export const DEFAULT_CAU_HINH_TEXT: KySoCauHinhType = {
  id: '',
  idBieuMau: '',
  idDTTienTrinhXuLy: '',
  type: 'TEXT',
  posX: 0,
  posY: 0,
  width: 200,
  height: 35,
  content: 'KÝ BỞI: THANH TRA VIÊN QUÂN KHU 2 \n KÝ NGÀY: 01/01/2020 09:10',
  imageSrc: '',
  fontSize: 8,
  textColor: '#CE1127',
};

export const DEFAULT_CAU_HINH_IMAGE: KySoCauHinhType = {
  id: '',
  idBieuMau: '',
  idDTTienTrinhXuLy: '',
  type: 'IMAGE',
  posX: 0,
  posY: 0,
  width: 0,
  height: 0,
  content: '',
  imageSrc: '',
  fontSize: 8,
};

export const CAU_HINH_TYPES = {
  TEXT: 'TEXT',
  IMAGE: 'IMAGE',
};
