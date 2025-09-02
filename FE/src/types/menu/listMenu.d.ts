import { MenuType } from "./menu";

export interface ListMenuType {
  id: string;
  code?: string;
  name?: string;
  order?: number;
  isShow?: boolean;
  icon?: StringDecoder;
  classCss?: string;
  styleCss?: string;
  link?: string;
  allowFilterScope?: boolean;
  isMobile?: boolean;
  listMenu?: MenuType[];
}