import { getPumpLogsData } from "@/lib/sheet-data";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = await getPumpLogsData();
    // Assuming the latest row is the last one
    const latest = data[data.length - 1];
    res.status(200).json(latest);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pump logs data" });
  }
}
