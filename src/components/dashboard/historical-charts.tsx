"use client";

import { useState, useEffect } from "react";
import { getSheetData } from "@/lib/sheet-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ComposedChart,
} from "recharts";
import type { HistoricalDataPoint, PumpLog } from "@/lib/types";

// ...existing code...

const chartConfig = {
  surfaceTemp: {
    label: "Surface Temp (°C)",
    color: "hsl(var(--primary))",
  },
  ambientTemp: {
    label: "Ambient Temp (°C)",
    color: "hsl(var(--accent))",
  },
  voltage: {
    label: "Voltage (V)",
    color: "hsl(var(--primary))",
  },
  power: {
    label: "Power (W)",
    color: "hsl(var(--accent))",
  },
  preCoolTemp: {
    label: "Pre-Cool Temp (°C)",
    color: "hsl(var(--destructive))",
  },
  postCoolTemp: {
    label: "Post-Cool Temp (°C)",
    color: "hsl(var(--primary))",
  },
  efficiencyGain: {
    label: "Efficiency Gain (%)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function HistoricalCharts() {
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>(
    []
  );
  const [pumpLogs, setPumpLogs] = useState<PumpLog[]>([]);

  useEffect(() => {
    // Fetch data from Google Sheet CSV
    getSheetData<any>().then((rows) => {
      // Assume the sheet has columns for both historical and pump log data
      // You may need to adjust this mapping based on your sheet structure
      const historical: HistoricalDataPoint[] = rows
        .filter(
          (row) =>
            row.time &&
            row.surfaceTemp &&
            row.ambientTemp &&
            row.voltage &&
            row.power
        )
        .map((row) => ({
          time: row.time,
          surfaceTemp: parseFloat(row.surfaceTemp),
          ambientTemp: parseFloat(row.ambientTemp),
          voltage: parseFloat(row.voltage),
          power: parseFloat(row.power),
        }));
      setHistoricalData(historical);

      const pump: PumpLog[] = rows
        .filter(
          (row) =>
            row.id &&
            row.timestamp &&
            row.preCoolTemp &&
            row.postCoolTemp &&
            row.duration
        )
        .map((row) => ({
          id: parseInt(row.id),
          timestamp: row.timestamp,
          preCoolTemp: parseFloat(row.preCoolTemp),
          postCoolTemp: parseFloat(row.postCoolTemp),
          duration: row.duration,
        }));
      setPumpLogs(pump);
    });
  }, []);

  const coolingChartData = pumpLogs.map((log) => ({
    ...log,
    efficiencyGain: parseFloat(
      ((log.preCoolTemp - log.postCoolTemp) * 0.5 + 15).toFixed(2)
    ),
  }));

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Temperature Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <ResponsiveContainer>
              <LineChart
                data={historicalData}
                margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke="hsl(var(--primary))"
                  tick={{ fill: "hsl(var(--primary))" }}
                  fontSize={12}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="hsl(var(--accent))"
                  tick={{ fill: "hsl(var(--accent))" }}
                  fontSize={12}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="surfaceTemp"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  name="Surface Temp"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="ambientTemp"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  dot={false}
                  name="Ambient Temp"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Power & Voltage</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <ResponsiveContainer>
              <LineChart
                data={historicalData}
                margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke="hsl(var(--primary))"
                  tick={{ fill: "hsl(var(--primary))" }}
                  fontSize={12}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="hsl(var(--accent))"
                  tick={{ fill: "hsl(var(--accent))" }}
                  fontSize={12}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="voltage"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  name="Voltage"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="power"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  dot={false}
                  name="Power"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Cooling Efficiency</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <ResponsiveContainer>
              <ComposedChart
                data={coolingChartData}
                margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  stroke="hsl(var(--primary))"
                  tick={{ fill: "hsl(var(--primary))" }}
                  fontSize={12}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="hsl(var(--chart-2))"
                  tick={{ fill: "hsl(var(--chart-2))" }}
                  fontSize={12}
                  unit="%"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  yAxisId="left"
                  dataKey="preCoolTemp"
                  fill="hsl(var(--destructive))"
                  radius={4}
                  name="Pre-Cool Temp"
                />
                <Bar
                  yAxisId="left"
                  dataKey="postCoolTemp"
                  fill="hsl(var(--primary))"
                  radius={4}
                  name="Post-Cool Temp"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="efficiencyGain"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "hsl(var(--chart-2))" }}
                  name="Efficiency Gain (%)"
                  unit="%"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
