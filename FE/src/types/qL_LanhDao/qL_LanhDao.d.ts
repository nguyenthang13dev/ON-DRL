import { EntityType, SearchBase } from "../general";

export interface QL_LanhDaoType extends EntityType {
  hoTen?: string;
	email?: string;
	dienThoai?: string;
	gioiTinh?: number;
	//ngaySinh?: Date;
	
	ngaySinh?: any | null;
	phongBan?: string;
	diaChi?: string;
	chucVu?: string;
	id?: string;
	gioiTinh_txt?: string;
	tenPhongBan?: string;
}

export interface QL_LanhDaoCreateOrUpdateType {
  id?: string;
  hoTen?: string;
	email?: string;
	dienThoai?: string;
	gioiTinh?: number;
	//ngaySinh?: Date;
	ngaySinh?: string | dayjs;
	phongBan?: string;
	diaChi?: string;
	chucVu?: string;
}

export interface QL_LanhDaoSearchType extends SearchBase {
  hoTen?: string;
	email?: string;
	dienThoai?: string;
	gioiTinh?: number;
	ngaySinhFrom?: Date;
	ngaySinhTo?: Date;
	phongBan?: string;
	diaChi?: string;
	chucVu?: string;
}
