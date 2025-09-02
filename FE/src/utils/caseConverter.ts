// utils/caseConverter.ts
function toPascalCase(str: string) {
  return str
    .replace(/(^\w|_\w)/g, (match) => match.replace('_', '').toUpperCase());
}

export function keysToPascalCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(keysToPascalCase);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [toPascalCase(k), keysToPascalCase(v)])
    );
  }
  return obj;
}