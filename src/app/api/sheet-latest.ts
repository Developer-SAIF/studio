import { getMetricsData } from "@/lib/sheet-data";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = await getMetricsData();
    // Find the last row with valid surfaceTemp, voltage, and current
    let latest = null;
    for (let i = data.length - 1; i >= 0; i--) {
      const row = data[i];
      if (
        row.surfaceTemp !== undefined &&
        row.surfaceTemp !== "" &&
        row.voltage !== undefined &&
        row.voltage !== "" &&
        row.current !== undefined &&
        row.current !== ""
      ) {
        latest = row;
        break;
      }
    }
    if (!latest) {
      return res.status(404).json({ error: "No valid metrics row found" });
    }
    res.status(200).json({
      surfaceTemp: Number(latest.surfaceTemp) || 0,
      voltage: Number(latest.voltage) || 0,
      current: Number(latest.current) || 0,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch sheet data" });
  }
}
