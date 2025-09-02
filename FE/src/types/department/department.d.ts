import { EntityType } from "../general";

export interface Department {
  id: string;
  name: string;
  code: string;
  parentId?: string;
  priority?: number;
  level: number;
  loai: string;
  diaDanh?: string;
  shortName?: string;
  isActive: boolean;
  capBac?: string;
  departmentChilds?: Department[] | undefined;
  soNgayTiepTrenThang?: number;
}
export interface DepartmentDetail extends Department {
  users?: { id: string; name: string }[];
  children?: { id: string; name: string }[];
}

export interface DepartmentSearch extends SearchBase {
  name?: string;
  loai?: string;
  level?: number;
  parentId?: string;
  isActive?: boolean;
}

export interface TreeNode {
  id: string;
  title: string;
  code: string;
  shortName?: string;
  diaDanh?: string;
  parentId: string | null;
  priority: number;
  level: number;
  loai: string;
  isActive: boolean;
  capBac?: string;
  children: TreeNode[] | null;
  soNgayTiepTrenThang?: number;
}
