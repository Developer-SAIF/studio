// This file is machine-generated - edit at your own risk.
"use server";

import { getEfficiencyInsights } from "@/ai/flows/efficiency-insights";
import type { HistoricalDataPoint, PumpLog } from "@/lib/types";

const fetchDhakaAmbientTemp = async (): Promise<number> => {
  try {
    const res = await fetch(
      "https://api.weatherapi.com/v1/current.json?key=f430eb044d11477697d83148251407&q=Dhaka&aqi=no"
    );
    const data = await res.json();
    return data?.current?.temp_c ?? 0;
  } catch {
    return 0;
  }
};

// Fetch ambient temperature only once to avoid API limit exhaustion
const generateInitialHistoricalData = async (): Promise<
  HistoricalDataPoint[]
> => {
  let ambientTemp = 32;
  try {
    ambientTemp = await fetchDhakaAmbientTemp();
  } catch {}
  const data: HistoricalDataPoint[] = [];
  for (let i = 6; i >= 0; i--) {
    const time = new Date();
    time.setHours(time.getHours() - i);
    data.push({
      time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      surfaceTemp: 40 + Math.random() * 15,
      voltage: 23.5 + Math.random(),
      power: 130 + Math.random() * 15,
    });
  }
  return data;
};

const generateInitialPumpLogs = (): PumpLog[] => {
  const logs: PumpLog[] = [];
  for (let i = 1; i <= 5; i++) {
    const time = new Date();
    time.setMinutes(time.getMinutes() - i * 45);
    const preCoolTemp = 60 + Math.random() * 15;
    const postCoolTemp = preCoolTemp - (10 + Math.random() * 10);
    logs.push({
      id: i,
      timestamp: time.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      preCoolTemp: parseFloat(preCoolTemp.toFixed(1)),
      postCoolTemp: parseFloat(postCoolTemp.toFixed(1)),
      duration: "60s",
    });
  }
  return logs.reverse();
};

export async function generateInsights() {
  try {
    const historicalData = await generateInitialHistoricalData();
    const pumpLogs = generateInitialPumpLogs();

    const historicalDataString = JSON.stringify({
      pumpLogs,
      performanceData: historicalData,
    });

    // Artificial delay to simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const result = await getEfficiencyInsights({
      historicalData: historicalDataString,
    });

    if (!result || !result.suggestions) {
      return {
        success: false,
        error: "Received an invalid response from the AI.",
      };
    }

    return { success: true, suggestions: result.suggestions };
  } catch (error) {
    console.error("Error generating efficiency insights:", error);
    return {
      success: false,
      error: "Failed to generate insights due to a server error.",
    };
  }
}
