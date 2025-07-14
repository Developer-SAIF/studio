"use client";

import { useState, useEffect } from "react";
import { getMetricsData } from "@/lib/sheet-data";
import { MetricCard } from "@/components/dashboard/metric-card";
import { HistoricalCharts } from "@/components/dashboard/historical-charts";
import { PumpActivityLog } from "@/components/dashboard/pump-activity-log";
import { EfficiencyInsights } from "@/components/dashboard/efficiency-insights";
import { PumpControl } from "@/components/dashboard/pump-control";
import { Thermometer, Zap, TrendingUp, Wind } from "lucide-react";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    surfaceTemp: 0,
    ambientTemp: 0,
    voltage: 0,
  });

  useEffect(() => {
    // Set initial metrics on client-side to avoid hydration mismatch
    setMetrics({
      surfaceTemp: 52.3,
      ambientTemp: 0,
      voltage: 24.1,
    });

    // Fetch ambient temperature from weather API every 10 minutes
    const fetchAmbientTemp = async () => {
      try {
        const res = await fetch(
          "https://api.weatherapi.com/v1/current.json?key=f430eb044d11477697d83148251407&q=Dhaka&aqi=no"
        );
        const data = await res.json();
        const ambientTemp = data?.current?.temp_c ?? 0;
        setMetrics((prev) => ({ ...prev, ambientTemp }));
      } catch {
        // fallback: do not update ambientTemp
      }
    };
    fetchAmbientTemp();
    const ambientInterval = setInterval(fetchAmbientTemp, 600000); // 10 minutes

    // Fetch latest surfaceTemp and voltage from Google Sheets every 10 seconds
    const fetchSheetMetrics = async () => {
      try {
        const rows = await getMetricsData();
        if (rows.length > 0) {
          const lastRow = rows[rows.length - 1];
          setMetrics((prev) => ({
            ...prev,
            surfaceTemp: Number(lastRow.surfaceTemp) || 0,
            voltage: Number(lastRow.voltage) || 0,
          }));
        }
      } catch {
        // fallback: do not update
      }
    };
    fetchSheetMetrics();
    const sheetInterval = setInterval(fetchSheetMetrics, 10000); // 10 seconds

    return () => {
      clearInterval(ambientInterval);
      clearInterval(sheetInterval);
    };
  }, []);

  return (
    <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
      <div className="grid gap-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <MetricCard
            icon={Thermometer}
            title="Surface Temperature"
            value={metrics.surfaceTemp.toFixed(1)}
            unit="°C"
            footerText="Real-time data"
          />
          <MetricCard
            icon={Wind}
            title="Ambient Temperature"
            value={metrics.ambientTemp.toFixed(1)}
            unit="°C"
            footerText="Real-time data"
          />
          <MetricCard
            icon={Zap}
            title="Voltage Output"
            value={metrics.voltage.toFixed(1)}
            unit="V"
            footerText="Real-time data"
          />
          <PumpControl />
        </div>

        <HistoricalCharts />

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <EfficiencyInsights className="xl:col-span-1" />
          <PumpActivityLog className="xl:col-span-2" />
        </div>
      </div>
    </main>
  );
}
