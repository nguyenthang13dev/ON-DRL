import { tableOperationType } from "../opearation/operation";

export interface tableModuleGroupData {
  id?: string;
  moduleName: string;
  moduleCode: string;
  operations?: tableOperationType[];
  selectedCodes?: undefined;
}

interface TableRowHeader {
  //   lstOperation: tableOperationType[]
  isAllChecked: boolean;
  isIndeterminate: boolean;
  moduleCode: string;
}
