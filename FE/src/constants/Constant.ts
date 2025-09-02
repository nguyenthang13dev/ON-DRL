import { DropdownOption } from "@/types/general";

type ConstantDefinition = Record<string, string | number>;
type ConstantData = Record<string | number, { displayName: string }>;

export function createConstant<T extends ConstantDefinition>(
  definition: T,
  data: ConstantData
) {
  const constant = {
    ...definition,
    data,
    getDisplayName(value: number | string): string | number | "" {
      return data[value]?.displayName || "";
    },
    getValue(key: keyof T): number | string {
      return definition[key];
    },
    getDropdownList(): { label: string; value: number | string }[] {
      return Object.entries(data).map(([key, value]) => ({
        label: value.displayName,
        value: typeof key === "number" ? Number(key) : key,
      }));
    },
    getDropdownOption(): DropdownOption[] {
      return Object.entries(data).map(([key, value]) => ({
        label: value.displayName,
        value: isNaN(Number(key)) ? key : String(Number(key)), 
        disabled: false, 
        selected: false, 
      }));
    },
  };
  
  return constant;
}
