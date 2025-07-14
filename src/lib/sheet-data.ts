import Papa from "papaparse";

export const METRICS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQuwyufJenCPrGJl-DelPbHxC1o-7SfNPNLAY1ClRxRIQsdZf_Vk4EuXoYlc-C_r3lMSygEkp428fpg/pub?gid=0&single=true&output=csv";
export const PUMPLOGS_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQuwyufJenCPrGJl-DelPbHxC1o-7SfNPNLAY1ClRxRIQsdZf_Vk4EuXoYlc-C_r3lMSygEkp428fpg/pub?gid=217517940&single=true&output=csv";

export async function fetchMetricsCSV(): Promise<string> {
  const response = await fetch(METRICS_CSV_URL);
  if (!response.ok) throw new Error("Failed to fetch Metrics CSV");
  return await response.text();
}

export async function fetchPumpLogsCSV(): Promise<string> {
  const response = await fetch(PUMPLOGS_CSV_URL);
  if (!response.ok) throw new Error("Failed to fetch Pump Logs CSV");
  return await response.text();
}

export async function getMetricsData<T = any>(): Promise<T[]> {
  const csv = await fetchMetricsCSV();
  const { data } = Papa.parse<T>(csv, { header: true });
  return data;
}

export async function getPumpLogsData<T = any>(): Promise<T[]> {
  const csv = await fetchPumpLogsCSV();
  const { data } = Papa.parse<T>(csv, { header: true });
  return data;
}
