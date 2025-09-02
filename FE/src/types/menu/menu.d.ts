export interface MenuType {
  id: string;
  moduleId: string;
  name?: string;
  url?: string;
  code?: string;
  css?: string;
  isShow: boolean;
  order: number;
  icon?: string;
  trangThaiHienThi?: string;
  isAccess: boolean;
}

export interface MenuDataType {
  id: string;
  code?: string;
  link?: string;
  name?: string;
  order?: number;
  isShow?: boolean;
  isAccess?: boolean;
  icon?: StringDecoder;
  classCss?: string;
  styleCss?: string;
  url?: string;
  allowFilterScope?: boolean;
  isMobile?: boolean;
  listMenu?: MenuDataType[];
}

export interface searchModule extends SearchBase {
  name?: string;
  code?: string;
  isShow?: boolean;
}

export interface tableModuleType {
  id?: string | null;
  code?: string | null;
  link?: string | null;
  name?: string | null;
  order?: number | null;
  isShow?: boolean | null;
  icon?: StringDecoder | null;
  classCss?: string | null;
  styleCss?: string | null;
  url?: string | null;
  allowFilterScope?: boolean | null;
  isMobile?: boolean | null;
  duongDanIcon?: string;
}

export interface createEditType {
  id?: string | null;
  code?: string | null;
  link?: string | null;
  name?: string | null;
  order?: number | null;
  isShow?: boolean | null;
  icon?: StringDecoder | null;
  classCss?: string | null;
  styleCss?: string | null;
  url?: string | null;
  allowFilterScope?: boolean | null;
  isMobile?: boolean | null;
  fileIcon?: any;
}
