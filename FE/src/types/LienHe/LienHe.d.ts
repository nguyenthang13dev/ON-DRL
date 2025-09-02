import { EntityType,SearchBase } from "../general";


 interface LienHeType extends EntityType {
  hoten: string;
  sdt?: string;
  email?: string; 
}

 interface CreateLienHeType {
  id?: string | null;
  hoten: string;
  sdt?: string;
  email?: string; 
}
interface searchLienHe extends SearchBase {
    NameFilter?: string | null;
}

export default interface LienHeView { 
  id?: string | null;
  hoten: string;
  sdt?: string;
  email?: string; 
  createddate?: string;
  updateddate?: string;
}