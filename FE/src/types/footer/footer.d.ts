import { FooterSearch } from "./footer";
import { EntityType, SearchBase } from "../general";
export interface Footer extends EntityType {
  type: string;
  hasImage?: boolean;
  hasDateTime?: boolean;
  hasTitle?: boolean;
  hasDescription?: boolean;
  html: string;
  css: string;
}
