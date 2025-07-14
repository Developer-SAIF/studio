import Papa from "papaparse";

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTXHDX6mbNMBNzU8td9c4Qt-lXLACPS_QKbXNRkmZd3afctmSiuUkxmefJwSLFUiE0_HlymKLR7QlDf/pub?output=csv";

export async function fetchSheetCSV(): Promise<string> {
  const response = await fetch(CSV_URL);
  if (!response.ok) throw new Error("Failed to fetch Google Sheet CSV");
  return await response.text();
}

export async function getSheetData<T = any>(): Promise<T[]> {
  const csv = await fetchSheetCSV();
  const { data } = Papa.parse<T>(csv, { header: true });
  return data;
}
