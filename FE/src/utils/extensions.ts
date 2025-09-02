import { DropdownOption } from "@/types/general";

export function toDateString(date?: Date, locale: string = "vi-VN"): string {
  if (!date) {
    return "";
  }
  return new Date(date).toLocaleDateString(locale);
}

export function getDropdownOptionSelected(
  dropdowns?: DropdownOption[]
): string {
  if (!dropdowns || !Array.isArray(dropdowns) || dropdowns.length === 0) {
    return "";
  }

  return dropdowns.find((item) => item.selected)?.value || "";
}
