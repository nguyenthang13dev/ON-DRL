export interface searchOperation extends SearchBase {
  name?: string;
  code?: string;
  isShow?: boolean;
  moduleId: string | null;
}

export interface tableOperationType {
  moduleId: string | null;
  id?: string | null;
  code?: string | null;
  name?: string | null;
  url?: string | null;
  order?: number | null;
  isShow?: boolean | null;
  icon?: StringDecoder | null;
  css?: string | null;
  isAccess: boolean;
}

export interface createEditType {
  moduleId: string | null;
  id?: string | null;
  code?: string | null;
  name?: string | null;
  url?: string | null;
  order?: number | null;
  isShow?: boolean | null;
  icon?: StringDecoder | null;
  css?: string | null;
}
