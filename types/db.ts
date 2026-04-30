export interface JsonRecord {
  [key: string]: string | number | boolean | null | JsonRecord | JsonRecord[];
}
